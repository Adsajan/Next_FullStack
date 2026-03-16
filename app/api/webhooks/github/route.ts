import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

import { triggerNextJsDeploy } from "@/lib/jenkins";

// Buffer/crypto require the Node.js runtime.
export const runtime = "nodejs";

type DeployConfig = {
  repoUrl: string;
  branch: string;
  deployId: string;
  appDomain: string;
  includeMongo: boolean;
  mongoDb?: string;
  envFileContent: string;
};

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const parseBooleanEnv = (value: string): boolean =>
  /^(1|true|yes|on)$/iu.test(value.trim());

// Normalize repo URLs for consistent matching.
const normalizeRepoUrl = (url: string): string =>
  url.trim().replace(/\.git$/iu, "").replace(/\/+$/u, "").toLowerCase();

const loadDeployConfigs = (): DeployConfig[] => [
  {
    repoUrl: getRequiredEnv("NEXT_FULLSTACK_REPO"),
    branch: getRequiredEnv("NEXT_FULLSTACK_BRANCH"),
    deployId: getRequiredEnv("NEXT_FULLSTACK_DEPLOY_ID"),
    appDomain: getRequiredEnv("NEXT_FULLSTACK_APP_DOMAIN"),
    includeMongo: parseBooleanEnv(getRequiredEnv("NEXT_FULLSTACK_INCLUDE_MONGO")),
    mongoDb: process.env.NEXT_FULLSTACK_MONGO_DB,
    envFileContent: getRequiredEnv("NEXT_FULLSTACK_ENV_FILE")
  }
];

const isValidSignature = (rawBody: string, signature: string, secret: string) => {
  const hmac = createHmac("sha256", secret);
  hmac.update(rawBody, "utf8");
  const digest = `sha256=${hmac.digest("hex")}`;

  const signatureBuffer = Buffer.from(signature);
  const digestBuffer = Buffer.from(digest);

  if (signatureBuffer.length !== digestBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, digestBuffer);
};

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const event = req.headers.get("x-github-event") ?? "";
    const signature = req.headers.get("x-hub-signature-256") ?? "";
    const secret = getRequiredEnv("GITHUB_WEBHOOK_SECRET");

    if (!signature || !isValidSignature(rawBody, signature, secret)) {
      return NextResponse.json(
        { ok: false, message: "Invalid signature." },
        { status: 401 }
      );
    }

    if (event === "ping") {
      return NextResponse.json({ ok: true, message: "pong" }, { status: 200 });
    }

    if (event !== "push") {
      return NextResponse.json(
        { ok: true, message: "Ignored non-push event.", event },
        { status: 200 }
      );
    }

    const payload = JSON.parse(rawBody) as {
      ref?: string;
      repository?: {
        html_url?: string;
        clone_url?: string;
        git_url?: string;
      };
    };

    const repoUrl =
      payload.repository?.html_url ??
      payload.repository?.clone_url ??
      payload.repository?.git_url ??
      "";

    const ref = payload.ref ?? "";
    const branch = ref.startsWith("refs/heads/") ? ref.slice(11) : "";

    if (!repoUrl || !branch) {
      return NextResponse.json(
        { ok: true, message: "Ignored: missing repo or branch." },
        { status: 200 }
      );
    }

    const normalizedRepo = normalizeRepoUrl(repoUrl);
    const configs = loadDeployConfigs();
    const match = configs.find(
      (config) =>
        normalizeRepoUrl(config.repoUrl) === normalizedRepo &&
        config.branch === branch
    );

    if (!match) {
      return NextResponse.json(
        { ok: true, message: "Ignored: unknown repo or branch." },
        { status: 200 }
      );
    }

    const result = await triggerNextJsDeploy({
      deployId: match.deployId,
      gitRepo: match.repoUrl,
      branch,
      appDomain: match.appDomain,
      envFileContent: match.envFileContent,
      includeMongo: match.includeMongo,
      mongoDb: match.includeMongo ? match.mongoDb : undefined
    });

    return NextResponse.json(
      { ok: true, message: "Deploy triggered.", data: result },
      { status: 202 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json(
      { ok: false, message: "Webhook handling failed.", error: message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";

import { triggerNextJsDeploy } from "@/lib/jenkins";

// Buffer is used in the Jenkins helper, so force the Node.js runtime.
export const runtime = "nodejs";

// Validate the incoming JSON body before calling Jenkins.
const deploySchema = z
  .object({
    deployId: z.string().min(1, "DEPLOY_ID is required."),
    gitRepo: z.string().min(1, "GIT_REPO is required."),
    branch: z.string().min(1, "BRANCH is required."),
    appDomain: z.string().min(1, "APP_DOMAIN is required."),
    envFileContent: z.string(),
    includeMongo: z.boolean(),
    mongoDb: z.string().optional()
  })
  .refine((data) => !data.includeMongo || !!data.mongoDb, {
    message: "MONGO_DB is required when INCLUDE_MONGO is true.",
    path: ["mongoDb"]
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = deploySchema.parse(body);

    const result = await triggerNextJsDeploy({
      deployId: payload.deployId,
      gitRepo: payload.gitRepo,
      branch: payload.branch,
      appDomain: payload.appDomain,
      envFileContent: payload.envFileContent,
      includeMongo: payload.includeMongo,
      mongoDb: payload.mongoDb
    });

    return NextResponse.json(
      {
        message: "Deploy triggered.",
        data: result
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request body.", issues: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Unknown server error.";

    // Treat upstream Jenkins failures as a bad gateway.
    const status = message.startsWith("Jenkins trigger failed") ? 502 : 500;

    return NextResponse.json(
      { message: "Failed to trigger deploy.", error: message },
      { status }
    );
  }
}

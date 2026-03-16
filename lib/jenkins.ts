export type NextJsDeployParams = {
  deployId: string;
  gitRepo: string;
  branch: string;
  appDomain: string;
  envFileContent: string;
  includeMongo: boolean;
  mongoDb?: string;
};

type JenkinsConfig = {
  baseUrl: string;
  username: string;
  apiToken: string;
  jobName: string;
};

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const getJenkinsConfig = (): JenkinsConfig => ({
  baseUrl: getRequiredEnv("JENKINS_BASE_URL"),
  username: getRequiredEnv("JENKINS_USERNAME"),
  apiToken: getRequiredEnv("JENKINS_API_TOKEN"),
  jobName: getRequiredEnv("JENKINS_JOB_NAME")
});

export async function triggerNextJsDeploy(params: NextJsDeployParams) {
  const { baseUrl, username, apiToken, jobName } = getJenkinsConfig();

  // Ensure a clean base URL and build the Jenkins endpoint.
  const normalizedBaseUrl = baseUrl.replace(/\/+$/u, "");
  const jobPath = `job/${encodeURIComponent(jobName)}/buildWithParameters`;
  const url = `${normalizedBaseUrl}/${jobPath}`;

  // Jenkins expects parameters as application/x-www-form-urlencoded.
  const body = new URLSearchParams({
    DEPLOY_ID: params.deployId,
    GIT_REPO: params.gitRepo,
    BRANCH: params.branch,
    APP_DOMAIN: params.appDomain,
    ENV_FILE_CONTENT: params.envFileContent,
    INCLUDE_MONGO: params.includeMongo ? "true" : "false"
  });

  if (params.mongoDb) {
    body.set("MONGO_DB", params.mongoDb);
  }

  const authToken = Buffer.from(`${username}:${apiToken}`).toString("base64");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authToken}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (![200, 201, 202].includes(response.status)) {
    const responseText = await response.text().catch(() => "");
    const trimmed = responseText.trim();
    const details = trimmed ? ` Response: ${trimmed}` : "";
    throw new Error(
      `Jenkins trigger failed (${response.status} ${response.statusText}).${details}`
    );
  }

  // Jenkins often returns the queued item URL in the Location header.
  const queueUrl = response.headers.get("location") ?? undefined;
  return { status: response.status, queueUrl };
}

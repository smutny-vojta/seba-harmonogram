import { runtimeConfig } from "@/config";
import { archiveExpiredTermGroups } from "@/features/groups";

export const dynamic = "force-dynamic";

function hasValidCronSecret(request: Request): boolean {
  if (!runtimeConfig.cronSecret) {
    return runtimeConfig.nodeEnv !== "production";
  }

  const headerSecret = request.headers.get("x-cron-secret");
  const authorization = request.headers.get("authorization");
  const bearerSecret = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  return (
    headerSecret === runtimeConfig.cronSecret ||
    bearerSecret === runtimeConfig.cronSecret
  );
}

export async function GET(request: Request) {
  if (!hasValidCronSecret(request)) {
    return Response.json(
      { error: "Neplatné cron oprávnění." },
      { status: 401 },
    );
  }

  const result = await archiveExpiredTermGroups(new Date());

  return Response.json({
    archivedCount: result.archivedCount,
    affectedTermCount: result.affectedTermCount,
    executedAt: new Date().toISOString(),
  });
}

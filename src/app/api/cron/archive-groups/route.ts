import { archiveExpiredTermGroups } from "@/features/groups/dal";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

function hasValidCronSecret(request: Request): boolean {
  if (!env.CRON_SECRET) {
    return env.NODE_ENV !== "production";
  }

  const headerSecret = request.headers.get("x-cron-secret");
  const authorization = request.headers.get("authorization");
  const bearerSecret = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  return headerSecret === env.CRON_SECRET || bearerSecret === env.CRON_SECRET;
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

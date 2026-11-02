import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-response";
import { getActorId, getDemoRole } from "@/lib/session";
import { canPublishBrief } from "@/server/access";
import { randomUUID } from "node:crypto";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const role = await getDemoRole();
  if (!canPublishBrief(role)) {
    return jsonError("FORBIDDEN", "Only Ánh can publish.", "Chỉ lãnh đạo mới phát hành.", 403);
  }

  const draft = await prisma.report.findUnique({ where: { id } });
  if (!draft || draft.status !== "draft" || !draft.body) {
    return jsonError(
      "CONFLICT",
      "Draft the brief first.",
      "Hãy soạn nháp trước.",
      409,
    );
  }

  const actor = await getActorId(role);
  const published = await prisma.report.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: new Date(),
    },
  });

  await prisma.decision.create({
    data: {
      id: randomUUID(),
      reportId: id,
      text: "Weekly brief published for week of 2026-11-02",
      madeBy: actor,
    },
  });

  await prisma.auditEvent.create({
    data: {
      id: randomUUID(),
      actor,
      action: "report_publish",
      entity: "report",
      entityId: id,
      detail: {},
    },
  });

  return jsonOk({ report: published });
}

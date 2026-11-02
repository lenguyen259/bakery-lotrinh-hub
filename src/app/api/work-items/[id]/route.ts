import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-response";
import { getActorId, getDemoRole } from "@/lib/session";
import { canMoveStage } from "@/server/access";
import { randomUUID } from "node:crypto";

type Params = { params: Promise<{ id: string }> };

const STAGES = [
  "inbox",
  "shaped",
  "prototype",
  "test",
  "released",
  "parked",
] as const;

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const role = await getDemoRole();
  if (!canMoveStage(role)) {
    return jsonError("FORBIDDEN", "Sponsor only.", "Chỉ lãnh đạo.", 403);
  }

  const body = (await request.json()) as {
    stage?: string;
    rice?: {
      reach?: number;
      impact?: number;
      confidence?: number;
      effort?: number;
    };
  };

  if (body.stage && !STAGES.includes(body.stage as (typeof STAGES)[number])) {
    return jsonError("INVALID_STAGE", "Unknown stage.", "Giai đoạn không hợp lệ.", 400);
  }

  const actor = await getActorId(role);
  const item = await prisma.workItem.update({
    where: { id },
    data: {
      stage: body.stage,
      riceReach: body.rice?.reach,
      riceImpact: body.rice?.impact,
      riceConfidence: body.rice?.confidence,
      riceEffort: body.rice?.effort,
      updatedAt: new Date(),
    },
  });

  await prisma.auditEvent.create({
    data: {
      id: randomUUID(),
      actor,
      action: "work_item_patch",
      entity: "work_item",
      entityId: id,
      detail: body,
    },
  });

  return jsonOk({ item });
}

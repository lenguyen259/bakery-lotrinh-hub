import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-response";
import { shapeIdea } from "@/lib/ai/client";
import { getActorId, getDemoRole } from "@/lib/session";
import { canShape } from "@/server/access";
import {
  isTooVague,
  shapeOutputHasInventedImpact,
} from "@/server/shape-policy";
import { shapeFixtureForIdea } from "@/lib/ai/demo-fixtures";
import { rateLimit } from "@/lib/rate-limit";
import { randomUUID } from "node:crypto";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const role = await getDemoRole();
  if (!canShape(role)) {
    return jsonError("FORBIDDEN", "Trainers and sponsors only.", "Chỉ huấn luyện hoặc lãnh đạo.", 403);
  }
  if (!rateLimit(`shape:${role}`, 10, 60_000)) {
    return jsonError("RATE_LIMIT", "Too many shape attempts.", "Quá nhiều lần định hình.", 429);
  }

  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) {
    return jsonError("NOT_FOUND", "Idea not found.", "Không tìm thấy ý tưởng.", 404);
  }

  const actor = await getActorId(role);
  let { shaped, mode, flags } = await shapeIdea(id, idea.body);

  if (shapeOutputHasInventedImpact(idea.body, shaped)) {
    shaped = shapeFixtureForIdea(id);
    if (id === "idea-vague" || shaped.confidence >= 0.4) {
      // keep fixture
    }
    flags = [...flags, "INVENTED_IMPACT"];
    mode = mode === "live" ? "fallback" : mode;
  }

  const confidence = Number(shaped.confidence);
  const tooVague = isTooVague(confidence);
  const status = tooVague ? "new" : "shaped";

  const updated = await prisma.idea.update({
    where: { id },
    data: {
      confidence,
      missingInfo: shaped.missing_info,
      shapedJson: shaped,
      status,
    },
  });

  await prisma.auditEvent.create({
    data: {
      id: randomUUID(),
      actor,
      action: "idea_shape",
      entity: "idea",
      entityId: id,
      detail: { mode, flags, confidence, tooVague },
    },
  });

  return jsonOk({
    idea: updated,
    shaped,
    mode,
    flags,
    tooVague,
    message_vi: tooVague ? "Ghi chú còn mơ hồ — chưa đủ để định hình" : undefined,
  });
}

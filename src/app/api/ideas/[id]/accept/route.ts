import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-response";
import { getActorId, getDemoRole } from "@/lib/session";
import { canAccept } from "@/server/access";
import { canAcceptIdea, type ShapeOutput } from "@/server/shape-policy";
import { randomUUID } from "node:crypto";

type Params = { params: Promise<{ id: string }> };

async function nextWorkItemId(): Promise<string> {
  const items = await prisma.workItem.findMany({ select: { id: true } });
  const numbers = items
    .map((i) => Number(i.id.replace("LT-", "")))
    .filter((n) => !Number.isNaN(n));
  const next = Math.max(0, ...numbers) + 1;
  return `LT-${String(next).padStart(2, "0")}`;
}

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const role = await getDemoRole();
  if (!canAccept(role)) {
    return jsonError("FORBIDDEN", "Colleagues cannot accept.", "Đồng nghiệp không thể chấp nhận.", 403);
  }

  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) {
    return jsonError("NOT_FOUND", "Idea not found.", "Không tìm thấy ý tưởng.", 404);
  }

  const confidence = idea.confidence ? Number(idea.confidence) : null;
  if (!canAcceptIdea(confidence)) {
    return jsonError(
      "CONFLICT",
      "Idea confidence is too low to accept.",
      "Độ tin cậy quá thấp để đưa lên bảng.",
      409,
    );
  }

  const shaped = idea.shapedJson as ShapeOutput | null;
  if (!shaped) {
    return jsonError(
      "CONFLICT",
      "Shape the idea first.",
      "Hãy định hình ý tưởng trước.",
      409,
    );
  }

  const workItemId = await nextWorkItemId();
  const actor = await getActorId(role);

  const workItem = await prisma.workItem.create({
    data: {
      id: workItemId,
      title: shaped.title,
      area: shaped.area,
      stage: "shaped",
      storyEn: shaped.story_en,
      storyVi: shaped.story_vi,
      acceptance: shaped.acceptance,
    },
  });

  const updatedIdea = await prisma.idea.update({
    where: { id },
    data: {
      status: "shaped",
      workItemId,
    },
  });

  await prisma.auditEvent.create({
    data: {
      id: randomUUID(),
      actor,
      action: "idea_accept",
      entity: "work_item",
      entityId: workItemId,
      detail: { ideaId: id },
    },
  });

  return jsonOk({ workItem, idea: updatedIdea });
}

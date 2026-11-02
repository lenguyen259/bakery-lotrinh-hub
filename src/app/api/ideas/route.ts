import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-response";
import { getActorId, getDemoRole } from "@/lib/session";
import { canSubmitIdea } from "@/server/access";
import { randomUUID } from "node:crypto";

export async function POST(request: Request) {
  const role = await getDemoRole();
  if (!canSubmitIdea()) {
    return jsonError("FORBIDDEN", "Not allowed.", "Không được phép.", 403);
  }
  const body = (await request.json()) as { body?: string; locale?: string };
  const text = body.body?.trim() ?? "";
  const locale = body.locale === "en" ? "en" : "vi";
  if (!text || text.length > 1000) {
    return jsonError(
      "INVALID_BODY",
      "Idea must be 1–1000 characters.",
      "Ý tưởng phải từ 1–1000 ký tự.",
      400,
    );
  }
  const actor = await getActorId(role);
  const id = `idea-${randomUUID().slice(0, 8)}`;
  const idea = await prisma.idea.create({
    data: {
      id,
      authorId: actor,
      body: text,
      locale,
      status: "new",
    },
  });
  await prisma.auditEvent.create({
    data: {
      id: randomUUID(),
      actor,
      action: "idea_submit",
      entity: "idea",
      entityId: id,
      detail: { locale },
    },
  });
  return jsonOk({ idea });
}

export async function GET() {
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });
  return jsonOk({ ideas });
}

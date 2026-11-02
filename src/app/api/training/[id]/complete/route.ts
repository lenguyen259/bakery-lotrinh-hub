import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-response";
import { getActorId, getDemoRole } from "@/lib/session";
import { randomUUID } from "node:crypto";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id: moduleId } = await params;
  const role = await getDemoRole();
  const actor = await getActorId(role);

  const trainingModule = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { questions: { orderBy: { id: "asc" } } },
  });
  if (!trainingModule) {
    return jsonError("NOT_FOUND", "Module not found.", "Không tìm thấy bài.", 404);
  }

  const body = (await request.json()) as { answers?: number[] };
  const answers = body.answers ?? [];
  if (answers.length !== trainingModule.questions.length) {
    return jsonError(
      "INVALID_ANSWERS",
      "Answer every question.",
      "Trả lời đủ câu hỏi.",
      400,
    );
  }

  let score = 0;
  trainingModule.questions.forEach((q, index) => {
    if (answers[index] === q.correctIndex) {
      score += 1;
    }
  });
  const passed = score >= 2;

  await prisma.completion.upsert({
    where: {
      personId_moduleId: { personId: actor, moduleId },
    },
    create: {
      personId: actor,
      moduleId,
      score,
      passed,
      completedAt: new Date(),
    },
    update: {
      score,
      passed,
      completedAt: new Date(),
    },
  });

  await prisma.auditEvent.create({
    data: {
      id: randomUUID(),
      actor,
      action: "training_complete",
      entity: "module",
      entityId: moduleId,
      detail: { score, passed },
    },
  });

  return jsonOk({ score, passed, passMark: 2 });
}

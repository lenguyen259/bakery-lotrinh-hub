import { prisma } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api-response";
import { draftBrief, safeBriefFixture } from "@/lib/ai/client";
import { getActorId, getDemoRole } from "@/lib/session";
import { canDraftBrief } from "@/server/access";
import { assertCitations } from "@/server/citations";
import { rateLimit } from "@/lib/rate-limit";
import { randomUUID } from "node:crypto";

const WEEK_START = new Date("2026-11-02");

export async function POST() {
  const role = await getDemoRole();
  if (!canDraftBrief(role)) {
    return jsonError("FORBIDDEN", "Trainer or sponsor only.", "Chỉ huấn luyện hoặc lãnh đạo.", 403);
  }
  if (!rateLimit(`draft:${role}`, 5, 60_000)) {
    return jsonError("RATE_LIMIT", "Too many drafts.", "Quá nhiều lần soạn.", 429);
  }

  const workItems = await prisma.workItem.findMany({ select: { id: true, title: true } });
  const allowedIds = workItems.map((w) => w.id);
  const actor = await getActorId(role);

  let { body, mode, flags } = await draftBrief(
    workItems.map((w) => `${w.id} ${w.title}`),
    allowedIds,
  );

  const citation = assertCitations(body, allowedIds);
  if (!citation.ok) {
    body = safeBriefFixture;
    flags = [...flags, "BAD_CITATION"];
    mode = mode === "live" ? "fallback" : mode;
  }

  const report = await prisma.report.upsert({
    where: { id: "report-week-2026-11-02" },
    create: {
      id: "report-week-2026-11-02",
      weekStart: WEEK_START,
      status: "draft",
      body,
      mode,
      failureFlags: flags,
    },
    update: {
      body,
      mode,
      failureFlags: flags,
      status: "draft",
    },
  });

  await prisma.auditEvent.create({
    data: {
      id: randomUUID(),
      actor,
      action: "report_draft",
      entity: "report",
      entityId: report.id,
      detail: { flags, mode },
    },
  });

  return jsonOk({ report, body, flags, mode });
}

export async function GET() {
  const report = await prisma.report.findUnique({
    where: { id: "report-week-2026-11-02" },
  });
  const published = await prisma.report.findFirst({
    where: { weekStart: WEEK_START, status: "published" },
    orderBy: { publishedAt: "desc" },
  });
  return jsonOk({ draft: report, published });
}

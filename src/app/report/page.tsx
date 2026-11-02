import { prisma } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getDemoRole, getLocale } from "@/lib/session";
import { ReportPanel } from "@/components/ReportPanel";
import { canDraftBrief, canPublishBrief } from "@/server/access";
import type { BriefBody } from "@/server/citations";

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const role = await getDemoRole();

  const report = await prisma.report.findUnique({
    where: { id: "report-week-2026-11-02" },
  });

  const published = report?.status === "published";
  const canSeeDraft = canDraftBrief(role);
  const body =
    published || canSeeDraft
      ? ((report?.body as BriefBody | null) ?? null)
      : null;

  if (role === "colleague" && !published) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl">{t.report.title}</h1>
        <p className="text-cocoa/70">
          {locale === "vi"
            ? "Chưa có bản phát hành — lãnh đạo sẽ đăng sau khi soạn."
            : "No published brief yet — leadership will publish after drafting."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">{t.report.title}</h1>
      <p className="text-sm text-cocoa/70">{t.home.sub}</p>
      {published ? (
        <p className="text-sm text-pandan">{t.report.published}</p>
      ) : null}
      <ReportPanel
        canDraft={canSeeDraft && !published}
        canPublish={canPublishBrief(role) && !published}
        initialBody={body}
        published={published}
        reportId="report-week-2026-11-02"
      />
    </div>
  );
}

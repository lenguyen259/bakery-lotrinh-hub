"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BriefBody } from "@/server/citations";

export function ReportPanel({
  canDraft,
  canPublish,
  initialBody,
  published,
  reportId,
}: {
  canDraft: boolean;
  canPublish: boolean;
  initialBody: BriefBody | null;
  published: boolean;
  reportId: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState<BriefBody | null>(initialBody);
  const [view, setView] = useState<"default" | "baker" | "finance">("default");
  const [flags, setFlags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function draft() {
    setLoading(true);
    const res = await fetch("/api/reports/draft", { method: "POST" });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      setBody(json.data.body);
      setFlags(json.data.flags ?? []);
    }
    router.refresh();
  }

  async function publish() {
    setLoading(true);
    const res = await fetch(`/api/reports/${reportId}/publish`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    }
  }

  if (published && !body) {
    return <p className="text-pandan">Brief đã phát hành — xem bản dưới.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {canDraft && !published ? (
          <button
            type="button"
            onClick={draft}
            disabled={loading}
            className="rounded-full bg-caramel px-4 py-2 text-sm text-paper"
          >
            Soạn nháp
          </button>
        ) : null}
        {canPublish && body && !published ? (
          <button
            type="button"
            onClick={publish}
            disabled={loading}
            className="rounded-full bg-pandan px-4 py-2 text-sm text-paper"
          >
            Phát hành
          </button>
        ) : null}
        {body ? (
          <>
            <button
              type="button"
              className="rounded-full border border-cocoa/20 px-3 py-1 text-sm"
              onClick={() => setView("default")}
            >
              Bullets
            </button>
            <button
              type="button"
              className="rounded-full border border-cocoa/20 px-3 py-1 text-sm"
              onClick={() => setView("baker")}
            >
              Bếp
            </button>
            <button
              type="button"
              className="rounded-full border border-cocoa/20 px-3 py-1 text-sm"
              onClick={() => setView("finance")}
            >
              Tài chính
            </button>
          </>
        ) : null}
      </div>
      {flags.length > 0 ? (
        <p className="text-sm text-clay">Flags: {flags.join(", ")}</p>
      ) : null}
      {body ? (
        <article className="rounded-2xl border border-cocoa/15 bg-white/50 p-6 text-sm leading-relaxed">
          {view === "baker" ? (
            <>
              <p>{body.baker_en}</p>
              <p className="mt-2 text-cocoa/80">{body.baker_vi}</p>
            </>
          ) : view === "finance" ? (
            <>
              <p>{body.finance_en}</p>
              <p className="mt-2 text-cocoa/80">{body.finance_vi}</p>
            </>
          ) : (
            <ul className="list-disc space-y-3 pl-5">
              {body.bullets.map((bullet, index) => (
                <li key={index}>
                  <p>{bullet.text_vi}</p>
                  <p className="text-cocoa/70">{bullet.text_en}</p>
                  {bullet.cites.length > 0 ? (
                    <p className="text-xs text-pandan">{bullet.cites.join(", ")}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </article>
      ) : (
        <p className="text-cocoa/70">Chưa có nháp — bấm Soạn nháp để tạo năm ý chính.</p>
      )}
    </div>
  );
}

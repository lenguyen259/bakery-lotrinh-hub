"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function IdeaActions({
  ideaId,
  canShape,
  canAccept,
  hasShape,
  confidenceOk,
  labels,
}: {
  ideaId: string;
  canShape: boolean;
  canAccept: boolean;
  hasShape: boolean;
  confidenceOk: boolean;
  labels: {
    shape: string;
    accept: string;
    tooVague: string;
    shapedOk: string;
  };
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function shape() {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/ideas/${ideaId}/shape`, { method: "POST" });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setMessage(json.error?.message_vi ?? "Lỗi");
      return;
    }
    setMessage(
      json.data.tooVague ? labels.tooVague : labels.shapedOk,
    );
    router.refresh();
  }

  async function accept() {
    setLoading(true);
    setMessage(null);
    const res = await fetch(`/api/ideas/${ideaId}/accept`, { method: "POST" });
    const json = await res.json();
    setLoading(false);
    if (!json.ok) {
      setMessage(json.error?.message_vi ?? "Lỗi");
      return;
    }
    setMessage(`Đã tạo ${json.data.workItem.id}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {canShape ? (
          <button
            type="button"
            onClick={shape}
            disabled={loading}
            className="rounded-md bg-caramel px-4 py-2 text-sm font-medium text-paper hover:bg-caramel/90 disabled:opacity-60"
          >
            {labels.shape}
          </button>
        ) : null}
        {canAccept && hasShape && confidenceOk ? (
          <button
            type="button"
            onClick={accept}
            disabled={loading}
            className="rounded-md bg-pandan px-4 py-2 text-sm font-medium text-paper hover:bg-pandan/90 disabled:opacity-60"
          >
            {labels.accept}
          </button>
        ) : null}
      </div>
      {message ? (
        <p className="text-sm text-cocoa/80" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}

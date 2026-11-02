"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function IdeaActions({
  ideaId,
  canShape,
  canAccept,
  hasShape,
  confidenceOk,
}: {
  ideaId: string;
  canShape: boolean;
  canAccept: boolean;
  hasShape: boolean;
  confidenceOk: boolean;
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
    setMessage(json.data.tooVague ? json.data.message_vi : "Đã định hình");
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
    <div className="mt-3 flex flex-wrap gap-2">
      {canShape ? (
        <button
          type="button"
          onClick={shape}
          disabled={loading}
          className="rounded-full bg-caramel px-4 py-2 text-sm text-paper"
        >
          Định hình
        </button>
      ) : null}
      {canAccept && hasShape && confidenceOk ? (
        <button
          type="button"
          onClick={accept}
          disabled={loading}
          className="rounded-full bg-pandan px-4 py-2 text-sm text-paper"
        >
          Đưa lên bảng
        </button>
      ) : null}
      {message ? <p className="text-sm text-cocoa">{message}</p> : null}
    </div>
  );
}

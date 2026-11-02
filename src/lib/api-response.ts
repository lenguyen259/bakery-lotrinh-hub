import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function jsonError(
  code: string,
  messageEn: string,
  messageVi: string,
  status: number,
) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message_en: messageEn,
        message_vi: messageVi,
      },
    },
    { status },
  );
}

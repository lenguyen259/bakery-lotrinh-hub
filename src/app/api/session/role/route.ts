import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { ROLE_COOKIE } from "@/lib/session";
import { prisma } from "@/lib/db";
import { randomUUID } from "node:crypto";
import { parseRole } from "@/server/access";

export async function POST(request: Request) {
  const body = (await request.json()) as { role?: string };
  const role = parseRole(body.role);
  const response = NextResponse.json({ ok: true, role });
  response.cookies.set(ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  await prisma.auditEvent.create({
    data: {
      id: randomUUID(),
      actor: role,
      action: "role_switch",
      entity: "session",
      entityId: role,
      detail: {},
    },
  });
  return response;
}

export async function GET() {
  return jsonError(
    "METHOD_NOT_ALLOWED",
    "Use POST to switch demo role.",
    "Dùng POST để đổi vai demo.",
    405,
  );
}

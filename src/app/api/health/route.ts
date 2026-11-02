import { prisma } from "@/lib/db";
import { isAiConfigured } from "@/lib/ai/client";
import { NextResponse } from "next/server";

export async function GET() {
  let db: "up" | "down" = "down";
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = "up";
  } catch {
    db = "down";
  }
  const ai = isAiConfigured() ? "configured" : "demo";
  return NextResponse.json({
    ok: db === "up",
    db,
    ai,
  });
}

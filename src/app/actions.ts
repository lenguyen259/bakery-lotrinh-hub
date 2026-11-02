"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE, ROLE_COOKIE } from "@/lib/session";
import type { DemoRole } from "@/server/access";
import { prisma } from "@/lib/db";
import { randomUUID } from "node:crypto";

export async function setRoleColleague() {
  await setDemoRole("colleague");
}

export async function setRoleTrainer() {
  await setDemoRole("trainer");
}

export async function setRoleSponsor() {
  await setDemoRole("sponsor");
}

async function setDemoRole(role: DemoRole) {
  const store = await cookies();
  store.set(ROLE_COOKIE, role, {
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
  revalidatePath("/", "layout");
}

export async function toggleLocale(current: "vi" | "en") {
  const next = current === "vi" ? "en" : "vi";
  const store = await cookies();
  store.set(LOCALE_COOKIE, next, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  revalidatePath("/", "layout");
}

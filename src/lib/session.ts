import { cookies } from "next/headers";
import { parseRole, type DemoRole } from "@/server/access";

export const ROLE_COOKIE = "demo_role";
export const LOCALE_COOKIE = "locale";

export async function getDemoRole(): Promise<DemoRole> {
  const store = await cookies();
  return parseRole(store.get(ROLE_COOKIE)?.value);
}

export async function getLocale(): Promise<"vi" | "en"> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : "vi";
}

export async function getActorId(role: DemoRole): Promise<string> {
  switch (role) {
    case "sponsor":
      return "anh";
    case "trainer":
      return "tram";
    case "colleague":
      return "bao";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

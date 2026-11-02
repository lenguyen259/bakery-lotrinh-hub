export type DemoRole = "colleague" | "trainer" | "sponsor";

export function parseRole(value: string | undefined | null): DemoRole {
  if (value === "trainer" || value === "sponsor") {
    return value;
  }
  return "colleague";
}

export function canSubmitIdea(): boolean {
  return true;
}

export function canShape(role: DemoRole): boolean {
  return role === "trainer" || role === "sponsor";
}

export function canAccept(role: DemoRole): boolean {
  return role === "trainer" || role === "sponsor";
}

export function canMoveStage(role: DemoRole): boolean {
  return role === "sponsor";
}

export function canDraftBrief(role: DemoRole): boolean {
  return role === "trainer" || role === "sponsor";
}

export function canPublishBrief(role: DemoRole): boolean {
  return role === "sponsor";
}

export function canSeeCompletionNames(role: DemoRole): boolean {
  return role === "trainer" || role === "sponsor";
}

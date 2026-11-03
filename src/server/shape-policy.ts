import { z } from "zod";

export const shapeSchema = z.object({
  title: z.string(),
  area: z.enum(["ops", "finance", "mfg", "sales", "cross"]),
  story_en: z.string(),
  story_vi: z.string(),
  acceptance: z.tuple([z.string(), z.string(), z.string()]),
  confidence: z.number(),
  missing_info: z.array(z.string()),
});

export type ShapeOutput = z.infer<typeof shapeSchema>;

const VND_IN_TEXT =
  /(?:₫|\b\d{1,3}(?:[.,]\d{3})+\s*(?:đ|VND|vnd)\b|\b\d{6,}\s*(?:đ|VND|vnd)\b)/i;

export function ideaHadMoneyMention(ideaBody: string): boolean {
  return VND_IN_TEXT.test(ideaBody);
}

export function shapeOutputHasInventedImpact(
  ideaBody: string,
  shaped: ShapeOutput,
): boolean {
  if (ideaHadMoneyMention(ideaBody)) {
    return false;
  }
  const blob = JSON.stringify(shaped);
  return VND_IN_TEXT.test(blob);
}

/** Rejects KPI-style numbers (%, counts) not present in the colleague note. */
export function shapeOutputHasInventedMetrics(
  ideaBody: string,
  shaped: ShapeOutput,
): boolean {
  const blob = JSON.stringify(shaped);
  if (!/%/.test(ideaBody) && /%/.test(blob)) {
    return true;
  }
  const ideaDigits = new Set(ideaBody.match(/\d+/g) ?? []);
  const outDigits = blob.match(/\d+/g) ?? [];
  if (ideaDigits.size === 0 && outDigits.length > 0) {
    return true;
  }
  for (const digit of outDigits) {
    if (!ideaDigits.has(digit) && Number(digit) >= 15) {
      return true;
    }
  }
  return false;
}

export function isTooVague(confidence: number): boolean {
  return confidence < 0.4;
}

export function canAcceptIdea(confidence: number | null | undefined): boolean {
  return confidence != null && confidence >= 0.4;
}

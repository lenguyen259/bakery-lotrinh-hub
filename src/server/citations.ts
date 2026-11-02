export type BriefBullet = {
  text_en: string;
  text_vi: string;
  cites: string[];
};

export type BriefBody = {
  bullets: BriefBullet[];
  risks_en: string;
  risks_vi: string;
  asks_en: string;
  asks_vi: string;
  baker_en: string;
  baker_vi: string;
  finance_en: string;
  finance_vi: string;
};

const LT_ID_PATTERN = /LT-\d+/g;

function collectLtTokens(text: string): string[] {
  return text.match(LT_ID_PATTERN) ?? [];
}

function allBriefText(brief: BriefBody): string[] {
  const parts: string[] = [
    brief.risks_en,
    brief.risks_vi,
    brief.asks_en,
    brief.asks_vi,
    brief.baker_en,
    brief.baker_vi,
    brief.finance_en,
    brief.finance_vi,
  ];
  for (const bullet of brief.bullets) {
    parts.push(bullet.text_en, bullet.text_vi);
  }
  return parts;
}

export type CitationResult =
  | { ok: true }
  | { ok: false; invalidIds: string[] };

export function assertCitations(
  brief: BriefBody,
  allowedIds: string[],
): CitationResult {
  const allowed = new Set(allowedIds);
  const invalid = new Set<string>();

  for (const bullet of brief.bullets) {
    for (const id of bullet.cites) {
      if (!allowed.has(id)) {
        invalid.add(id);
      }
    }
    for (const token of collectLtTokens(bullet.text_en)) {
      if (!allowed.has(token)) {
        invalid.add(token);
      }
    }
    for (const token of collectLtTokens(bullet.text_vi)) {
      if (!allowed.has(token)) {
        invalid.add(token);
      }
    }
  }

  for (const text of allBriefText(brief)) {
    for (const token of collectLtTokens(text)) {
      if (!allowed.has(token)) {
        invalid.add(token);
      }
    }
  }

  if (invalid.size > 0) {
    return { ok: false, invalidIds: [...invalid].sort() };
  }
  return { ok: true };
}

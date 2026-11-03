import { generateObject } from "ai";
import { createLlmProvider, getAiModelId } from "@/lib/ai/provider";
import { z } from "zod";
import {
  shapeSchema,
  shapeOutputHasInventedImpact,
  type ShapeOutput,
} from "@/server/shape-policy";
import { assertCitations, type BriefBody } from "@/server/citations";
import {
  inventedImpactFixture,
  safeBriefFixture,
  shapeFixtureForIdea,
} from "@/lib/ai/demo-fixtures";

export type AiMode = "demo" | "live" | "fallback";

function resolveDemoMode(): "on" | "off" | "auto" {
  const raw = process.env.AI_DEMO_MODE ?? "auto";
  if (raw === "on" || raw === "off") {
    return raw;
  }
  return "auto";
}

export function getAiBannerMode(): AiMode {
  const mode = resolveDemoMode();
  const hasKey = Boolean(process.env.OPENAI_API_KEY?.trim());
  if (mode === "on") {
    return "demo";
  }
  if (mode === "off") {
    return hasKey ? "live" : "demo";
  }
  return hasKey ? "live" : "demo";
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

async function callShapeModel(
  ideaBody: string,
): Promise<{ output: ShapeOutput; mode: AiMode }> {
  const provider = createLlmProvider();
  const model = provider(getAiModelId());
  const { object } = await generateObject({
    model,
    schema: shapeSchema,
    prompt: `Shape this colleague idea into a product story. Do not invent VND amounts.\n\n${ideaBody}`,
  });
  return { output: object, mode: "live" };
}

export async function shapeIdea(
  ideaId: string,
  ideaBody: string,
): Promise<{ shaped: ShapeOutput; mode: AiMode; flags: string[] }> {
  const flags: string[] = [];
  const demoMode = resolveDemoMode();
  const hasKey = isAiConfigured();

  let shaped: ShapeOutput;
  let mode: AiMode = "demo";

  if (demoMode === "on" || (demoMode === "auto" && !hasKey)) {
    shaped = shapeFixtureForIdea(ideaId);
    mode = "demo";
  } else {
    try {
      const live = await callShapeModel(ideaBody);
      if (shapeOutputHasInventedImpact(ideaBody, live.output)) {
        shaped = shapeFixtureForIdea(ideaId);
        mode = "fallback";
        flags.push("INVENTED_IMPACT");
      } else {
        shaped = live.output;
        mode = live.mode;
      }
    } catch {
      shaped = shapeFixtureForIdea(ideaId);
      mode = "fallback";
      flags.push("MODEL_ERROR");
    }
  }

  if (shaped.confidence >= 0.4 && ideaId !== "idea-vague") {
    // keep fixture confidence for known demos
  }

  return { shaped, mode, flags };
}

const briefSchema = z.object({
  bullets: z
    .array(
      z.object({
        text_en: z.string(),
        text_vi: z.string(),
        cites: z.array(z.string()),
      }),
    )
    .length(5),
  risks_en: z.string(),
  risks_vi: z.string(),
  asks_en: z.string(),
  asks_vi: z.string(),
  baker_en: z.string(),
  baker_vi: z.string(),
  finance_en: z.string(),
  finance_vi: z.string(),
});

export async function draftBrief(
  workItemTitles: string[],
  allowedIds: string[],
): Promise<{ body: BriefBody; mode: AiMode; flags: string[] }> {
  const flags: string[] = [];
  const demoMode = resolveDemoMode();
  const hasKey = isAiConfigured();

  if (demoMode === "on" || (demoMode === "auto" && !hasKey)) {
    return { body: safeBriefFixture, mode: "demo", flags };
  }

  try {
    const provider = createLlmProvider();
    const model = provider(getAiModelId());
    const { object } = await generateObject({
      model,
      schema: briefSchema,
      prompt: `Write a weekly leadership brief with exactly five bullets citing only real ids from: ${workItemTitles.join(", ")}. Every LT- id in text must appear in that list.`,
    });
    const citation = assertCitations(object, allowedIds);
    if (!citation.ok) {
      flags.push("BAD_CITATION");
      return { body: safeBriefFixture, mode: "fallback", flags };
    }
    return { body: object, mode: "live", flags };
  } catch {
    flags.push("MODEL_ERROR");
    return { body: safeBriefFixture, mode: "fallback", flags };
  }
}

export { inventedImpactFixture, safeBriefFixture, shapeFixtureForIdea };

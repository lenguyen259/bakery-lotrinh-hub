import { generateObject } from "ai";
import { createLlmProvider, getAiModelId } from "@/lib/ai/provider";
import { z } from "zod";
import { shapeSchema, type ShapeOutput } from "@/server/shape-policy";
import { finalizeShapedOutput } from "@/server/shape-finalize";
import { assertCitations, type BriefBody } from "@/server/citations";
import {
  inventedImpactFixture,
  safeBriefFixture,
  shapeFixtureForIdea,
} from "@/lib/ai/demo-fixtures";

export type AiMode = "demo" | "live" | "fallback" | "deterministic";

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
    system:
      "Shape colleague notes only. Do not invent percentages, KPIs, or VND amounts absent from the note. Keep confidence below 0.4 when the note lacks place, pain, and acceptance detail.",
    prompt: ideaBody,
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

  if (ideaId === "idea-vague") {
    const finalized = finalizeShapedOutput(ideaId, ideaBody, shapeFixtureForIdea(ideaId));
    return {
      shaped: finalized.shaped,
      mode: "deterministic",
      flags: finalized.flags,
    };
  }

  let candidate: ShapeOutput;
  let mode: AiMode = "demo";

  if (demoMode === "on" || (demoMode === "auto" && !hasKey)) {
    candidate = shapeFixtureForIdea(ideaId);
    mode = "demo";
  } else {
    try {
      const live = await callShapeModel(ideaBody);
      candidate = live.output;
      mode = live.mode;
    } catch {
      candidate = shapeFixtureForIdea(ideaId);
      mode = "fallback";
      flags.push("MODEL_ERROR");
    }
  }

  const finalized = finalizeShapedOutput(ideaId, ideaBody, candidate);
  if (finalized.flags.length > 0) {
    flags.push(...finalized.flags);
    if (mode === "live") {
      mode = "fallback";
    }
  }

  return { shaped: finalized.shaped, mode, flags };
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

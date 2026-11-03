import type { ShapeOutput } from "@/server/shape-policy";
import {
  shapeOutputHasInventedImpact,
  shapeOutputHasInventedMetrics,
} from "@/server/shape-policy";
import { shapeFixtureForIdea } from "@/lib/ai/demo-fixtures";

export function finalizeShapedOutput(
  ideaId: string,
  ideaBody: string,
  candidate: ShapeOutput,
): { shaped: ShapeOutput; flags: string[] } {
  const flags: string[] = [];
  if (ideaId === "idea-vague") {
    return { shaped: shapeFixtureForIdea("idea-vague"), flags: ["VAGUE_IDEA"] };
  }

  if (shapeOutputHasInventedImpact(ideaBody, candidate)) {
    flags.push("INVENTED_IMPACT");
    return { shaped: shapeFixtureForIdea(ideaId), flags };
  }
  if (shapeOutputHasInventedMetrics(ideaBody, candidate)) {
    flags.push("INVENTED_METRICS");
    return { shaped: shapeFixtureForIdea(ideaId), flags };
  }
  if (ideaId === "idea-photo" && candidate.confidence < 0.4) {
    flags.push("LOW_CONFIDENCE");
    return { shaped: shapeFixtureForIdea("idea-photo"), flags };
  }

  return { shaped: candidate, flags };
}

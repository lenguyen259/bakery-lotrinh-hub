import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAcceptIdea,
  isTooVague,
  shapeOutputHasInventedImpact,
  type ShapeOutput,
} from "../src/server/shape-policy";

describe("shape policy", () => {
  it("treats confidence below 0.4 as too vague", () => {
    assert.equal(isTooVague(0.2), true);
    assert.equal(isTooVague(0.39), true);
    assert.equal(isTooVague(0.4), false);
    assert.equal(isTooVague(0.8), false);
  });

  it("blocks accept when confidence is missing or low", () => {
    assert.equal(canAcceptIdea(null), false);
    assert.equal(canAcceptIdea(0.2), false);
    assert.equal(canAcceptIdea(0.8), true);
  });

  it("flags invented VND when idea had none", () => {
    const shaped: ShapeOutput = {
      title: "Test",
      area: "ops",
      story_en: "Saves 5000000 VND",
      story_vi: "Tiết kiệm",
      acceptance: ["a", "b", "c"],
      confidence: 0.9,
      missing_info: [],
    };
    assert.equal(
      shapeOutputHasInventedImpact("dùng AI cho bánh", shaped),
      true,
    );
  });

  it("allows money when idea already mentioned it", () => {
    const shaped: ShapeOutput = {
      title: "Test",
      area: "finance",
      story_en: "Matches 1250000 VND transfer",
      story_vi: "Khớp chuyển khoản",
      acceptance: ["a", "b", "c"],
      confidence: 0.9,
      missing_info: [],
    };
    assert.equal(
      shapeOutputHasInventedImpact("Hóa đơn 1250000 VND chưa khớp", shaped),
      false,
    );
  });
});

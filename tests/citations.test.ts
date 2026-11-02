import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertCitations, type BriefBody } from "../src/server/citations";
import { safeBriefFixture } from "../src/lib/ai/demo-fixtures";

describe("assertCitations", () => {
  const allowed = ["LT-01", "LT-02", "LT-03"];

  it("passes the safe brief fixture", () => {
    const result = assertCitations(safeBriefFixture, allowed);
    assert.equal(result.ok, true);
  });

  it("rejects LT-99 in cites", () => {
    const tampered: BriefBody = {
      ...safeBriefFixture,
      bullets: safeBriefFixture.bullets.map((b, i) =>
        i === 0 ? { ...b, cites: ["LT-99"] } : b,
      ),
    };
    const result = assertCitations(tampered, allowed);
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.ok(result.invalidIds.includes("LT-99"));
    }
  });

  it("rejects LT- tokens embedded in bullet text", () => {
    const tampered: BriefBody = {
      ...safeBriefFixture,
      bullets: [
        {
          text_en: "See LT-04 for more",
          text_vi: "Xem LT-04",
          cites: ["LT-01"],
        },
        ...safeBriefFixture.bullets.slice(1),
      ],
    };
    const result = assertCitations(tampered, allowed);
    assert.equal(result.ok, false);
  });

  it("requires exactly five bullets in fixture", () => {
    assert.equal(safeBriefFixture.bullets.length, 5);
  });
});

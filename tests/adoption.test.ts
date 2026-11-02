import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeOutletDetails,
  computeOutletRates,
  type PersonRow,
} from "../src/server/adoption";

describe("adoption rates", () => {
  const people: PersonRow[] = [
    { id: "thao", name: "Thảo", role: "colleague", outletId: "CTR-NH" },
    { id: "duc", name: "Đức", role: "colleague", outletId: "CTR-NH" },
    { id: "my", name: "My", role: "colleague", outletId: "CTR-NH" },
    { id: "phong", name: "Phong", role: "colleague", outletId: "CTR-NH" },
    { id: "chi", name: "Chi", role: "colleague", outletId: "CTR-NH" },
    { id: "hung", name: "Hùng", role: "colleague", outletId: "CTR-TD" },
    { id: "vy", name: "Vy", role: "colleague", outletId: "CTR-TD" },
    { id: "bao", name: "Bảo", role: "colleague", outletId: "CTR-PMH" },
    { id: "kiet", name: "Kiệt", role: "colleague", outletId: "CTR-PMH" },
    { id: "lan", name: "Lan", role: "colleague", outletId: "KIT-D3" },
  ];

  const completions = [
    ...["thao", "duc", "my", "phong"].flatMap((personId) =>
      ["mod-oven", "mod-vat", "mod-idea"].map((moduleId) => ({
        personId,
        moduleId,
        passed: true,
      })),
    ),
    ...["mod-oven", "mod-vat", "mod-idea"].map((moduleId) => ({
      personId: "hung",
      moduleId,
      passed: true,
    })),
    { personId: "kiet", moduleId: "mod-oven", passed: true },
  ];

  it("matches 80 / 50 / 0 for demo counters", () => {
    const rates = computeOutletRates(people, completions);
    const nh = rates.find((r) => r.outletId === "CTR-NH");
    const td = rates.find((r) => r.outletId === "CTR-TD");
    const pmh = rates.find((r) => r.outletId === "CTR-PMH");
    assert.equal(nh?.rate, 80);
    assert.equal(td?.rate, 50);
    assert.equal(pmh?.rate, 0);
  });

  it("lists Chi as unfinished for trainers", () => {
    const details = computeOutletDetails(people, completions);
    const nh = details.find((d) => d.outletId === "CTR-NH");
    assert.ok(nh?.unfinishedNames.includes("Chi"));
  });
});

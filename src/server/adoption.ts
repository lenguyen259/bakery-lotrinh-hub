export type PersonRow = {
  id: string;
  name: string;
  role: string;
  outletId: string | null;
};

export type CompletionRow = {
  personId: string;
  moduleId: string;
  passed: boolean;
};

export const MODULE_IDS = ["mod-oven", "mod-vat", "mod-idea"] as const;

export const OUTLETS = [
  { id: "CTR-NH", nameVi: "Quầy demo Nguyễn Huệ", nameEn: "Demo counter Nguyễn Huệ" },
  { id: "CTR-TD", nameVi: "Quầy demo Thảo Điền", nameEn: "Demo counter Thảo Điền" },
  { id: "CTR-PMH", nameVi: "Quầy demo Phú Mỹ Hưng", nameEn: "Demo counter Phú Mỹ Hưng" },
] as const;

function isColleagueAtCounter(person: PersonRow): boolean {
  return (
    person.role === "colleague" &&
    person.outletId != null &&
    person.outletId.startsWith("CTR-")
  );
}

export function personFinishedAllModules(
  personId: string,
  completions: CompletionRow[],
): boolean {
  const passedModules = new Set(
    completions
      .filter((c) => c.personId === personId && c.passed)
      .map((c) => c.moduleId),
  );
  return MODULE_IDS.every((id) => passedModules.has(id));
}

export type OutletRate = {
  outletId: string;
  nameVi: string;
  nameEn: string;
  rate: number;
  finished: number;
  total: number;
};

export type OutletDetail = OutletRate & {
  finishedNames: string[];
  unfinishedNames: string[];
};

export function computeOutletRates(
  people: PersonRow[],
  completions: CompletionRow[],
): OutletRate[] {
  return OUTLETS.map((outlet) => {
    const colleagues = people.filter(
      (p) => p.outletId === outlet.id && isColleagueAtCounter(p),
    );
    const finished = colleagues.filter((p) =>
      personFinishedAllModules(p.id, completions),
    ).length;
    const total = colleagues.length;
    const rate = total === 0 ? 0 : Math.round((finished / total) * 100);
    return {
      outletId: outlet.id,
      nameVi: outlet.nameVi,
      nameEn: outlet.nameEn,
      rate,
      finished,
      total,
    };
  });
}

export function computeOutletDetails(
  people: PersonRow[],
  completions: CompletionRow[],
): OutletDetail[] {
  return OUTLETS.map((outlet) => {
    const colleagues = people.filter(
      (p) => p.outletId === outlet.id && isColleagueAtCounter(p),
    );
    const finishedPeople = colleagues.filter((p) =>
      personFinishedAllModules(p.id, completions),
    );
    const unfinishedPeople = colleagues.filter(
      (p) => !personFinishedAllModules(p.id, completions),
    );
    const total = colleagues.length;
    const finished = finishedPeople.length;
    const rate = total === 0 ? 0 : Math.round((finished / total) * 100);
    return {
      outletId: outlet.id,
      nameVi: outlet.nameVi,
      nameEn: outlet.nameEn,
      rate,
      finished,
      total,
      finishedNames: finishedPeople.map((p) => p.name),
      unfinishedNames: unfinishedPeople.map((p) => p.name),
    };
  });
}

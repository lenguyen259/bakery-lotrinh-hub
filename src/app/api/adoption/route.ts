import { prisma } from "@/lib/db";
import { jsonOk } from "@/lib/api-response";
import { getDemoRole } from "@/lib/session";
import { canSeeCompletionNames } from "@/server/access";
import {
  computeOutletDetails,
  computeOutletRates,
  type PersonRow,
} from "@/server/adoption";

export async function GET() {
  const role = await getDemoRole();
  const people = await prisma.person.findMany();
  const completions = await prisma.completion.findMany();
  const personRows: PersonRow[] = people.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    outletId: p.outletId,
  }));
  const completionRows = completions.map((c) => ({
    personId: c.personId,
    moduleId: c.moduleId,
    passed: c.passed,
  }));

  const outlets = computeOutletRates(personRows, completionRows);

  if (!canSeeCompletionNames(role)) {
    return jsonOk({ outlets });
  }

  const details = computeOutletDetails(personRows, completionRows);
  return jsonOk({ outlets, details });
}

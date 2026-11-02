import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ovenUrl = process.env.NEXT_PUBLIC_OVENFLOOR_URL || null;
const tillUrl = process.env.NEXT_PUBLIC_TILLBRIDGE_URL || null;

async function main() {
  await prisma.auditEvent.deleteMany();
  await prisma.decision.deleteMany();
  await prisma.completion.deleteMany();
  await prisma.question.deleteMany();
  await prisma.module.deleteMany();
  await prisma.idea.deleteMany();
  await prisma.workItem.deleteMany();
  await prisma.report.deleteMany();
  await prisma.person.deleteMany();

  const people = [
    { id: "lan", name: "Lan Phạm", role: "colleague", outletId: "KIT-D3" },
    { id: "tram", name: "Trâm Bùi", role: "trainer", outletId: null },
    { id: "anh", name: "Ánh Đặng", role: "sponsor", outletId: null },
    { id: "thao", name: "Thảo", role: "colleague", outletId: "CTR-NH" },
    { id: "duc", name: "Đức", role: "colleague", outletId: "CTR-NH" },
    { id: "my", name: "My", role: "colleague", outletId: "CTR-NH" },
    { id: "phong", name: "Phong", role: "colleague", outletId: "CTR-NH" },
    { id: "chi", name: "Chi", role: "colleague", outletId: "CTR-NH" },
    { id: "hung", name: "Hùng", role: "colleague", outletId: "CTR-TD" },
    { id: "vy", name: "Vy", role: "colleague", outletId: "CTR-TD" },
    { id: "bao", name: "Bảo Nguyễn", role: "colleague", outletId: "CTR-PMH" },
    { id: "kiet", name: "Kiệt", role: "colleague", outletId: "CTR-PMH" },
  ];

  for (const p of people) {
    await prisma.person.create({ data: p });
  }

  const workItems = [
    {
      id: "LT-01",
      title: "Batch plan the night before",
      area: "mfg",
      stage: "released",
      sourceRequirementId: "OF-R01",
      externalUrl: ovenUrl,
    },
    {
      id: "LT-02",
      title: "Reconcile transfer lines without posting from chat",
      area: "finance",
      stage: "released",
      sourceRequirementId: "QT-R03",
      externalUrl: tillUrl,
    },
    {
      id: "LT-03",
      title: "Floor tablet for waste reasons",
      area: "ops",
      stage: "test",
      sourceRequirementId: "OF-R05",
    },
    {
      id: "LT-04",
      title: "Gift-box order to invoice draft",
      area: "sales",
      stage: "prototype",
      sourceRequirementId: "QT-R01",
    },
    {
      id: "LT-06",
      title: "Vietnamese explanation on every AI screen",
      area: "cross",
      stage: "shaped",
    },
    {
      id: "LT-07",
      title: "A second kitchen",
      area: "ops",
      stage: "parked",
    },
    {
      id: "LT-08",
      title: "Loyalty stamps",
      area: "sales",
      stage: "inbox",
    },
  ];

  for (const item of workItems) {
    await prisma.workItem.create({ data: item });
  }

  await prisma.idea.create({
    data: {
      id: "idea-vague",
      authorId: "bao",
      body: "dùng AI cho bánh",
      locale: "vi",
      status: "new",
    },
  });

  await prisma.idea.create({
    data: {
      id: "idea-photo",
      authorId: "lan",
      body: "Cuối ngày tủ mát còn bánh mì pate, chụp ảnh và ghi lý do hao hụt mất 10 phút. Muốn một nút: chụp, chọn lý do, xong.",
      locale: "vi",
      status: "new",
    },
  });

  await prisma.report.create({
    data: {
      id: "report-week-2026-11-02",
      weekStart: new Date("2026-11-02"),
      status: "draft",
      body: undefined,
      mode: "demo",
      failureFlags: [],
    },
  });

  const modules = [
    {
      id: "mod-oven",
      sortOrder: 1,
      titleEn: "Night plan quantities",
      titleVi: "Số lượng kế hoạch đêm",
      bodyEn:
        "The night quantity comes from the plan function in Ovenfloor. The model may explain the plan but must not change tray counts.",
      bodyVi:
        "Số lượng mẻ đêm đến từ hàm kế hoạch trong Ovenfloor. Mô hình được giải thích nhưng không được đổi số khay.",
    },
    {
      id: "mod-vat",
      sortOrder: 2,
      titleEn: "VAT stays in code",
      titleVi: "VAT nằm trong code",
      bodyEn:
        "VAT is computed in Tillbridge code. Never ask the model for tax on an invoice.",
      bodyVi:
        "VAT được tính trong code Tillbridge. Không hỏi mô hình về thuế trên hóa đơn.",
    },
    {
      id: "mod-idea",
      sortOrder: 3,
      titleEn: "Shape a useful idea",
      titleVi: "Định hình ý tưởng hữu ích",
      bodyEn:
        "An idea needs the place, the pain, and the finished moment. Saying use AI is not enough.",
      bodyVi:
        "Ý tưởng cần nơi, nỗi đau, và khoảnh khắc xong việc. Nói dùng AI là chưa đủ.",
    },
  ];

  for (const mod of modules) {
    await prisma.module.create({ data: mod });
  }

  const questions = [
    {
      id: "q-oven-1",
      moduleId: "mod-oven",
      promptEn: "Where do night tray counts come from?",
      promptVi: "Số khay đêm lấy từ đâu?",
      choicesEn: ["The plan function", "The chat model", "A guess"],
      choicesVi: ["Hàm kế hoạch", "Mô hình chat", "Đoán"],
      correctIndex: 0,
    },
    {
      id: "q-oven-2",
      moduleId: "mod-oven",
      promptEn: "Can the model change quantities?",
      promptVi: "Mô hình có được đổi số lượng không?",
      choicesEn: ["No", "Yes, always", "Only on Fridays"],
      choicesVi: ["Không", "Có, luôn luôn", "Chỉ thứ Sáu"],
      correctIndex: 0,
    },
    {
      id: "q-oven-3",
      moduleId: "mod-oven",
      promptEn: "Who releases the plan?",
      promptVi: "Ai phát hành kế hoạch?",
      choicesEn: ["A person on the floor", "The model alone", "Nobody"],
      choicesVi: ["Một người trên sàn", "Chỉ mô hình", "Không ai"],
      correctIndex: 0,
    },
    {
      id: "q-vat-1",
      moduleId: "mod-vat",
      promptEn: "Where is VAT calculated?",
      promptVi: "VAT được tính ở đâu?",
      choicesEn: ["In code", "In the prompt", "On paper only"],
      choicesVi: ["Trong code", "Trong prompt", "Chỉ trên giấy"],
      correctIndex: 0,
    },
    {
      id: "q-vat-2",
      moduleId: "mod-vat",
      promptEn: "Should you ask the model for tax?",
      promptVi: "Có nên hỏi mô hình về thuế không?",
      choicesEn: ["No", "Yes", "Only for croissants"],
      choicesVi: ["Không", "Có", "Chỉ cho croissant"],
      correctIndex: 0,
    },
    {
      id: "q-vat-3",
      moduleId: "mod-vat",
      promptEn: "Which app owns invoice VAT?",
      promptVi: "App nào giữ VAT hóa đơn?",
      choicesEn: ["Tillbridge", "Ovenfloor", "Email"],
      choicesVi: ["Tillbridge", "Ovenfloor", "Email"],
      correctIndex: 0,
    },
    {
      id: "q-idea-1",
      moduleId: "mod-idea",
      promptEn: "What must an idea include?",
      promptVi: "Ý tưởng phải có gì?",
      choicesEn: ["Place, pain, finished moment", "Only the word AI", "A logo"],
      choicesVi: ["Nơi, nỗi đau, lúc xong", "Chỉ chữ AI", "Một logo"],
      correctIndex: 0,
    },
    {
      id: "q-idea-2",
      moduleId: "mod-idea",
      promptEn: 'Is "use AI" enough?',
      promptVi: '"Dùng AI" đã đủ chưa?',
      choicesEn: ["No", "Yes", "Only on Mondays"],
      choicesVi: ["Chưa", "Rồi", "Chỉ thứ Hai"],
      correctIndex: 0,
    },
    {
      id: "q-idea-3",
      moduleId: "mod-idea",
      promptEn: "Who accepts a shaped idea onto the board?",
      promptVi: "Ai đưa ý tưởng đã định hình lên bảng?",
      choicesEn: ["Trainer or sponsor", "Any colleague", "Nobody"],
      choicesVi: ["Huấn luyện hoặc lãnh đạo", "Mọi đồng nghiệp", "Không ai"],
      correctIndex: 0,
    },
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: {
        ...q,
        choicesEn: q.choicesEn,
        choicesVi: q.choicesVi,
      },
    });
  }

  const finishedModules = ["mod-oven", "mod-vat", "mod-idea"] as const;
  const nhDone = ["thao", "duc", "my", "phong"];
  for (const personId of nhDone) {
    for (const moduleId of finishedModules) {
      await prisma.completion.create({
        data: {
          personId,
          moduleId,
          score: 3,
          passed: true,
          completedAt: new Date("2026-11-01"),
        },
      });
    }
  }

  for (const moduleId of finishedModules) {
    await prisma.completion.create({
      data: {
        personId: "hung",
        moduleId,
        score: 3,
        passed: true,
        completedAt: new Date("2026-11-01"),
      },
    });
  }

  await prisma.completion.create({
    data: {
      personId: "kiet",
      moduleId: "mod-oven",
      score: 3,
      passed: true,
      completedAt: new Date("2026-11-01"),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

import type { BriefBody } from "@/server/citations";
import type { ShapeOutput } from "@/server/shape-policy";

export const safeBriefFixture: BriefBody = {
  bullets: [
    {
      text_en: "LT-01 night batch plan is released for tomorrow's bake.",
      text_vi: "LT-01: kế hoạch mẻ đêm đã phát hành cho ngày mai.",
      cites: ["LT-01"],
    },
    {
      text_en: "LT-02 lets finance reconcile transfers without posting from chat.",
      text_vi: "LT-02: đối soát chuyển khoản không ghi sổ từ chat.",
      cites: ["LT-02"],
    },
    {
      text_en: "LT-03 floor tablet for waste reasons is in test at one counter.",
      text_vi: "LT-03: máy tính bảng ghi hao hụt đang thử nghiệm.",
      cites: ["LT-03"],
    },
    {
      text_en: "Training adoption stays uneven across the three demo counters.",
      text_vi: "Hoàn thành đào tạo còn chênh giữa ba quầy demo.",
      cites: [],
    },
    {
      text_en: "Cross-team copy on every AI screen remains shaped, not released.",
      text_vi: "Bản giải thích AI trên mọi màn hình vẫn ở giai đoạn định hình.",
      cites: [],
    },
  ],
  risks_en: "Test items may slip if tablet feedback is late.",
  risks_vi: "Hạng mục thử nghiệm có thể trễ nếu phản hồi máy tính bảng chậm.",
  asks_en: "Confirm counter hours before expanding LT-03.",
  asks_vi: "Xác nhận giờ quầy trước khi mở rộng LT-03.",
  baker_en:
    "Trays and waste reasons stay on the floor plan; finish mod-oven at each counter.",
  baker_vi:
    "Khay và lý do hao hụt gắn với kế hoạch sàn; hoàn thành mod-oven từng quầy.",
  finance_en:
    "Invoice drafts and unmatched transfers stay in Tillbridge until finance confirms.",
  finance_vi:
    "Nháp hóa đơn và chuyển khoản chưa khớp vẫn ở Tillbridge cho tài chính xác nhận.",
};

export const badCitationBriefFixture: BriefBody = {
  ...safeBriefFixture,
  bullets: safeBriefFixture.bullets.map((b, i) =>
    i === 0 ? { ...b, cites: ["LT-99"] } : b,
  ),
};

export function shapeFixtureForIdea(ideaId: string): ShapeOutput {
  if (ideaId === "idea-vague") {
    return {
      title: "Use AI for baking",
      area: "cross",
      story_en: "Use AI for baking without specifying where or why.",
      story_vi: "Dùng AI cho bánh mà chưa nói rõ nơi và nỗi đau.",
      acceptance: [
        "Define the outlet or kitchen step",
        "Name the pain in minutes or trays",
        "Describe the finished moment",
      ],
      confidence: 0.2,
      missing_info: [
        "Which counter or kitchen step?",
        "What pain in minutes or trays?",
      ],
    };
  }

  if (ideaId === "idea-photo") {
    return {
      title: "One-tap waste photo at close",
      area: "ops",
      story_en:
        "At day end, staff photograph leftover pâté baguettes, pick a fixed waste reason, and save a same-day record without changing batch quantities.",
      story_vi:
        "Cuối ngày, chụp ảnh bánh còn lại, chọn lý do hao hụt cố định, lưu trong ngày; số lượng mẻ không tự đổi.",
      acceptance: [
        "Waste reasons come from the fixed list shared with Ovenfloor.",
        "Each record is stamped same-day before the counter closes.",
        "Batch quantity in the night plan does not change automatically; a person adjusts if needed.",
      ],
      confidence: 0.8,
      missing_info: [],
    };
  }

  return {
    title: "Shaped idea",
    area: "ops",
    story_en: "A shaped operational improvement.",
    story_vi: "Cải tiến vận hành đã định hình.",
    acceptance: ["Criterion one", "Criterion two", "Criterion three"],
    confidence: 0.6,
    missing_info: [],
  };
}

export function inventedImpactFixture(ideaId: string): ShapeOutput {
  const base = shapeFixtureForIdea(ideaId);
  return {
    ...base,
    story_en: `${base.story_en} Saves 2000000 VND per week.`,
    confidence: 0.85,
  };
}

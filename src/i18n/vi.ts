export const vi = {
  kicker: "PROGRAMME · PORTFOLIO",
  wordmark: "Lộ trình",
  nav: {
    home: "Trang chủ",
    backlog: "Backlog",
    roadmap: "Lộ trình",
    ideas: "Ý tưởng",
    report: "Báo cáo tuần",
    training: "Đào tạo",
    adoption: "Áp dụng",
    trust: "Tin cậy",
  },
  home: {
    headline: "Tuần này lãnh đạo cần thấy gì",
    sub: "Tuần 2–8 tháng 11, 2026",
    released: "Đã phát hành",
    inTest: "Đang thử / mẫu",
    adoption: "Hoàn thành đào tạo theo quầy",
    demoLinks: "Demo vận hành",
    urlUnset: "Demo URL not set yet",
  },
  role: {
    label: "Vai demo",
    colleague: "Đồng nghiệp (Bảo)",
    trainer: "Huấn luyện (Trâm)",
    sponsor: "Lãnh đạo (Ánh)",
  },
  locale: "English",
  disclaimer:
    "Đây là bản minh hoạ portfolio cho vị trí AI Implementation Specialist tại Sharon JSC. Không phải hệ thống, sản phẩm hay thương hiệu vận hành chính thức của Sharon. Dữ liệu là dữ liệu giả lập cho một bếp bánh demo tại TP.HCM.",
  aiBanner: {
    demo: "Chế độ minh hoạ — chưa gọi mô hình",
    fallback: "Mô hình lỗi — dùng bản an toàn",
    live: "Đang dùng mô hình thật",
  },
  stages: {
    released: "Đã phát hành",
    test: "Thử nghiệm",
    prototype: "Mẫu",
    shaped: "Đã định hình",
    inbox: "Hộp thư",
    parked: "Tạm dừng",
  },
  areas: {
    ops: "Vận hành",
    finance: "Tài chính",
    mfg: "Sản xuất",
    sales: "Bán hàng",
    cross: "Liên phòng",
  },
  roadmap: {
    now: "Hiện tại",
    next: "Tiếp theo",
    later: "Sau này",
    parked: "Tạm dừng",
  },
  ideas: {
    title: "Hộp thư ý tưởng",
    shape: "Định hình",
    accept: "Đưa lên bảng",
    tooVague: "Ghi chú còn mơ hồ — chưa đủ để định hình",
    shaped: "Đã định hình — chờ chấp nhận",
  },
  report: {
    title: "Báo cáo tuần",
    draft: "Soạn nháp",
    publish: "Phát hành",
    baker: "Phiên bản bếp",
    finance: "Phiên bản tài chính",
    published: "Đã phát hành",
  },
  training: {
    title: "Ba bài ngắn",
    pass: "Cần đúng 2/3 câu",
    submit: "Nộp bài",
  },
  trust: {
    title: "Tin cậy và giới hạn demo",
    completion:
      "Hoàn thành bài học là tín hiệu triển khai công cụ sàn, không phải điểm nhân sự hay kỷ luật.",
  },
};

export type Dictionary = {
  [K in keyof typeof vi]: (typeof vi)[K] extends string
    ? string
    : (typeof vi)[K] extends Record<string, string>
      ? Record<keyof (typeof vi)[K], string>
      : (typeof vi)[K];
};

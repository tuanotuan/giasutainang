export interface ServiceContent {
  slug: string;
  title: string;
  summary: string;
  benefits: string[];
  audiences: string[];
  faq: { question: string; answer: string }[];
}

export const serviceContents: ServiceContent[] = [
  {
    slug: "day-kem-1-1-tai-nha-hoac-online",
    title: "Dạy kèm 1-1 tại nhà hoặc online",
    summary: "Lộ trình cá nhân hóa theo năng lực, mục tiêu và tốc độ tiếp thu của từng học sinh.",
    benefits: ["Tập trung hoàn toàn vào một học sinh", "Lịch học linh hoạt", "Phản hồi tiến độ thường xuyên", "Dễ điều chỉnh phương pháp"],
    audiences: ["Học sinh mất gốc", "Học sinh cần bồi dưỡng nâng cao", "Người học có lịch riêng", "Gia đình muốn theo sát tiến độ"],
    faq: [{ question: "Nên chọn học tại nhà hay online?", answer: "Tùy độ tuổi, khả năng tự tập trung và điều kiện di chuyển. Chuyên viên sẽ giúp gia đình cân nhắc." }, { question: "Có được học thử không?", answer: "Gia đình có thể trao đổi về một buổi học thử trước khi thống nhất lịch dài hạn." }],
  },
  {
    slug: "lop-hoc-nhom-tiet-kiem",
    title: "Lớp học nhóm tiết kiệm",
    summary: "Nhóm nhỏ từ hai đến tám học viên, cân bằng tương tác, chất lượng và chi phí.",
    benefits: ["Chi phí hợp lý", "Có bạn cùng luyện tập", "Tăng kỹ năng trao đổi", "Nhóm được xếp theo trình độ"],
    audiences: ["Nhóm bạn cùng lớp", "Anh chị em trong gia đình", "Học sinh thích tương tác", "Nhóm ôn thi chung mục tiêu"],
    faq: [{ question: "Nhóm tối đa bao nhiêu học viên?", answer: "Mô hình gợi ý từ hai đến tám học viên để người dạy vẫn theo sát từng bạn." }],
  },
  {
    slug: "tim-gia-su-mien-phi",
    title: "Tìm gia sư miễn phí",
    summary: "Tiếp nhận nhu cầu, tư vấn và đề xuất hồ sơ phù hợp mà không thu phí kết nối từ phụ huynh.",
    benefits: ["Tư vấn không thu phí", "Hồ sơ rõ ràng", "Đề xuất theo ngân sách", "Hỗ trợ khi cần điều chỉnh"],
    audiences: ["Phụ huynh lần đầu tìm gia sư", "Học sinh cần người dạy gấp", "Gia đình cần so sánh hồ sơ", "Người học online"],
    faq: [{ question: "Phụ huynh có mất phí giới thiệu không?", answer: "Không. Học phí được gia đình và gia sư thống nhất trực tiếp." }],
  },
  {
    slug: "luyen-thi-chuyen-cap",
    title: "Luyện thi chuyển cấp",
    summary: "Củng cố nền tảng, luyện dạng bài và xây tâm lý vững vàng cho kỳ thi chuyển cấp.",
    benefits: ["Đánh giá lỗ hổng đầu vào", "Kế hoạch theo giai đoạn", "Luyện đề có chữa lỗi", "Theo dõi tiến bộ"],
    audiences: ["Học sinh lớp 5", "Học sinh lớp 9", "Học sinh thi trường chất lượng cao", "Học sinh cần củng cố nền tảng"],
    faq: [{ question: "Nên bắt đầu ôn từ khi nào?", answer: "Nên đánh giá năng lực sớm từ đầu năm học để có đủ thời gian củng cố mà không tạo áp lực." }],
  },
  {
    slug: "luyen-thi-dai-hoc",
    title: "Luyện thi đại học",
    summary: "Ôn tập có trọng tâm, luyện đề và tối ưu chiến lược làm bài theo mục tiêu ngành học.",
    benefits: ["Lộ trình theo mục tiêu điểm", "Chuyên đề trọng tâm", "Kỹ năng phân bổ thời gian", "Đánh giá qua đề mô phỏng"],
    audiences: ["Học sinh lớp 11-12", "Học sinh cần tăng tốc", "Học sinh ôn lại kiến thức nền", "Thí sinh tự do"],
    faq: [{ question: "Có thể học riêng một chuyên đề không?", answer: "Có. Lộ trình có thể tập trung vào phần kiến thức học sinh đang yếu." }],
  },
  {
    slug: "luyen-thi-hoc-sinh-gioi",
    title: "Luyện thi học sinh giỏi",
    summary: "Bồi dưỡng tư duy nâng cao, mở rộng chuyên đề và rèn cách trình bày bài thi chuyên sâu.",
    benefits: ["Chuyên đề nâng cao", "Phát triển tư duy độc lập", "Tài liệu chọn lọc", "Phản biện lời giải"],
    audiences: ["Học sinh đội tuyển", "Học sinh thi trường chuyên", "Học sinh yêu thích môn học", "Học sinh cần thử thách nâng cao"],
    faq: [{ question: "Có cần kiểm tra đầu vào không?", answer: "Có một bài trao đổi hoặc đánh giá ngắn để chọn độ khó và lộ trình phù hợp." }],
  },
  {
    slug: "gia-su-ngoai-ngu",
    title: "Gia sư ngoại ngữ",
    summary: "Học tiếng Anh, Nhật, Hàn, Trung, Pháp theo mục tiêu giao tiếp, học thuật hoặc chứng chỉ.",
    benefits: ["Luyện đủ bốn kỹ năng", "Nội dung theo mục tiêu", "Tăng thời lượng giao tiếp", "Lịch học linh hoạt"],
    audiences: ["Học sinh phổ thông", "Sinh viên", "Người đi làm", "Người luyện chứng chỉ"],
    faq: [{ question: "Có gia sư luyện IELTS không?", answer: "Có hồ sơ theo từng kỹ năng và mục tiêu band điểm để người học lựa chọn." }],
  },
  {
    slug: "gia-su-nang-khieu",
    title: "Gia sư năng khiếu",
    summary: "Khơi mở sở thích với piano, guitar, vẽ, thanh nhạc và các môn năng khiếu khác.",
    benefits: ["Học qua thực hành", "Tiến độ vừa sức", "Phát triển sự tự tin", "Có thể học tại nhà"],
    audiences: ["Trẻ em khám phá sở thích", "Học sinh chuẩn bị thi năng khiếu", "Người lớn học thư giãn", "Gia đình cần lịch linh hoạt"],
    faq: [{ question: "Có cần mua nhạc cụ trước không?", answer: "Tùy môn học. Gia sư sẽ tư vấn dụng cụ tối thiểu phù hợp với giai đoạn bắt đầu." }],
  },
];

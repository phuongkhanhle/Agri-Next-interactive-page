/**
 * Agri-Next Vietnam project showcase content — sourced from the
 * "[AGRI-NEXT VN] Partner Proposal" deck. Edit here to update the "Dự án" page
 * and the "Săn Sticker" quiz (questions point visitors to these sections).
 */

export const PROJECT_TAGLINE = 'Protecting Nature, Preserving Life';
export const CAMPAIGN_NAME = 'Young Roots, Green Future';
export const CAMPAIGN_NAME_VI = 'Mầm rễ Trẻ, Tương lai Xanh';

export const PROJECT_INTRO =
  'Agri-Next Việt Nam là sáng kiến do thanh niên dẫn dắt, hướng tới việc xây dựng một hệ sinh thái học tập – thử nghiệm – lan tỏa nông nghiệp bền vững, kết nối người trẻ với mô hình nông nghiệp thích ứng với biến đổi khí hậu và đổi mới sáng tạo tại Cao Bằng.';

export const PROJECT_MISSION =
  'Xây dựng hệ sinh thái nông nghiệp thích ứng khí hậu, nơi thanh niên là lực lượng tiên phong bảo tồn tri thức bản địa và phát triển kinh tế xanh.';

export const PROJECT_VISION =
  'Trở thành hệ sinh thái nông nghiệp tiên phong tại miền núi phía Bắc, nơi tri thức bản địa và công nghệ hiện đại hội tụ để kiến tạo tương lai xanh bền vững cho thế hệ trẻ Việt Nam.';

export const FOUNDER_QUOTES = [
  {
    quote:
      'Nông nghiệp Việt Nam mang trong mình tiềm năng vô hạn. Sứ mệnh của Agri-Next là khai mở những tiềm năng đó bằng những giải pháp tiên tiến.',
    author: 'Đồng sáng lập Agri-Next Vietnam',
  },
  {
    quote:
      'Với nhiều người nông nghiệp là một lĩnh vực đã cũ, nhưng với tôi nông nghiệp là một sự khám phá. Chính vì thế Agri-Next là khởi đầu trên hành trình này.',
    author: 'Đồng sáng lập Agri-Next Vietnam',
  },
];

export const CONTEXT_STATS = [
  { value: '70%', label: 'thanh niên miền núi phía Bắc di cư', source: 'TCTK 2021' },
  { value: '>60%', label: 'đất nông nghiệp Đông Bắc suy thoái do biến đổi khí hậu', source: 'Bộ NN&PTNT 2021' },
  { value: 'Tiềm năng', label: 'lớn về rau bản địa, dược liệu & tri thức truyền thống của Cao Bằng', source: '' },
];

export const PROJECT_GOALS = [
  'Trao quyền cho 40 thanh niên với kỹ năng nông nghiệp bền vững và khởi nghiệp.',
  'Thúc đẩy mô hình canh tác tái sinh, thích ứng khí hậu.',
  'Kết hợp tri thức bản địa và kỹ thuật hiện đại để bảo tồn đa dạng sinh học.',
  'Thu hút cộng đồng thông qua chiến dịch truyền thông.',
  'Đồng hành cùng các nhóm thanh niên phát triển 2–3 sáng kiến nông nghiệp xanh quy mô nhỏ.',
];

export const EXPECTED_IMPACT = [
  'Giữ chân thanh niên, tạo sinh kế xanh tại địa phương.',
  'Thúc đẩy an ninh lương thực và phục hồi môi trường.',
  'Bảo tồn di sản nông nghiệp & tri thức bản địa.',
  'Lan tỏa thay đổi hành vi, mở rộng mô hình bền vững.',
];

export interface ProjectPhase {
  no: string;
  title: string;
  summary: string;
  bullets: string[];
  mascot: 'idea' | 'walk' | 'video';
  tone: 'olive' | 'moss' | 'amber';
}

export const PROJECT_PHASES: ProjectPhase[] = [
  {
    no: '01',
    title: 'Trại huấn luyện (Bootcamp)',
    summary:
      'Chương trình đào tạo tập trung 5 ngày, 20 học viên/trại — kết nối thanh niên với chuyên gia, nông dân và đất đai.',
    bullets: [
      'Phục hồi hệ sinh thái',
      'Nguồn lực bền vững',
      'Giáo dục cộng đồng',
      'Học tập qua thực hành',
    ],
    mascot: 'idea',
    tone: 'olive',
  },
  {
    no: '02',
    title: 'Ruộng mẫu Agri-Next & Cố vấn tích hợp',
    summary:
      'Không gian 1.000 m² do thanh niên vận hành để thực hành và thử nghiệm các loài cây bản địa của Cao Bằng.',
    bullets: [
      'Mô hình canh tác tuần hoàn',
      'Chế biến xanh (sấy, lên men, đóng gói)',
      'Cố vấn chuyên gia',
      'Học viên trở thành Peer Mentor',
    ],
    mascot: 'walk',
    tone: 'moss',
  },
  {
    no: '03',
    title: `Chiến dịch “${CAMPAIGN_NAME}”`,
    summary:
      'Chiến dịch truyền thông số khuếch đại tiếng nói địa phương và quảng bá sản phẩm bản địa, hướng tới 500.000 lượt tiếp cận.',
    bullets: [
      'Kể chuyện số (Digital Storytelling)',
      'Infographic, podcast, video ngắn',
      'Tôn vinh hình mẫu nông dân trẻ',
      'Lan tỏa lối sống xanh',
    ],
    mascot: 'video',
    tone: 'amber',
  },
];

export const BOOTCAMP_STATS = [
  { value: '20', label: 'học viên Bootcamp 2025' },
  { value: '50–60%', label: 'học viên là nữ' },
  { value: '04', label: 'cố vấn đồng đẳng' },
  { value: '03', label: 'ý tưởng mô hình khởi nghiệp' },
];

export const BOOTCAMP_FORMAT = [
  { value: '4 ngày', label: 'Học lý thuyết (online)' },
  { value: '1 ngày', label: 'Mentoring' },
  { value: '2 ngày', label: 'Thực hành tại Cao Bằng' },
];

export const BOOTCAMP_MODULES = [
  { no: 1, title: 'Agri-Next & Biến đổi khí hậu', detail: 'Tổng quan BĐKH và ảnh hưởng tới địa phương.' },
  { no: 2, title: 'Permaculture', detail: 'Nông nghiệp bền vững & thiết kế trang trại bền vững tại Việt Nam.' },
  { no: 3, title: 'Kinh tế tuần hoàn', detail: 'Zero Waste trong nông nghiệp, mô hình Vườn – Ao – Chuồng (VAC) cải tiến.' },
  { no: 4, title: 'Nông nghiệp thông minh', detail: 'Nông nghiệp 4.0: IoT, drone, AI giám sát mùa màng; xu hướng carbon thấp.' },
  { no: 5, title: 'Khởi nghiệp nông nghiệp', detail: 'Phát triển ý tưởng từ cây bản địa, case study startup nông sản Việt.' },
  { no: 6, title: 'Tư duy đổi mới', detail: 'Design thinking, tài chính nhỏ, marketing số & storytelling cho nông sản.' },
];

export const FIELD_ZONES = [
  {
    name: 'Vườn rau bản địa',
    detail: 'Nơi gieo trồng và giữ giống các loại rau quen thuộc của bà con Cao Bằng như cải mèo, rau ngót rừng, rau dền.',
    mascot: 'walk' as const,
  },
  {
    name: 'Vườn thuốc (dược liệu)',
    detail: 'Góc trồng các cây thuốc bản địa như đinh lăng, sa nhân, nghệ đen — gìn giữ tri thức dùng cây thuốc của đồng bào vùng cao.',
    mascot: 'idea' as const,
  },
];

export const CAMPAIGN_RESULTS = [
  { value: '599.228', label: 'lượt tiếp cận' },
  { value: '458.301', label: 'lượt xem' },
  { value: '51.681', label: 'lượt tương tác' },
  { value: '70', label: 'bài viết' },
  { value: '7', label: 'video / reels' },
  { value: '03', label: 'webinar' },
];

export const WEBINARS = [
  'Từ mảnh đất quê hương đến nông nghiệp thông minh',
  'Permaculture: từ lý thuyết đến thực tiễn',
  'Kinh tế tuần hoàn và Zero Waste',
];

/* ---------------- Cuộc thi "Cao Bằng Xanh" ---------------- */

export const CAO_BANG_XANH = {
  name: 'Cao Bằng Xanh',
  subtitle: 'Nâng tầm tri thức nông nghiệp bản địa',
  theme: 'Đau đáu giữ rừng, bền bỉ giữ bản – Tôn vinh tri thức bản địa và bản sắc nông nghiệp truyền thống Cao Bằng',
  hashtag: '#CaoBangXanh',
  intro:
    'Cuộc thi do Agri-Next Vietnam khởi xướng (với sự hỗ trợ của UNDP & Youth4Climate, trong khuôn khổ Call for Solution 2025) nhằm phát hiện, gìn giữ và lan tỏa các giá trị văn hóa nông nghiệp cổ truyền tại Cao Bằng.',
  who: 'Bạn trẻ 18–29 tuổi trên toàn quốc · Cá nhân hoặc nhóm tối đa 3 người · Không cần có mặt tại Cao Bằng',
  topics: [
    { title: 'Di sản văn hóa nông nghiệp & nghề truyền thống', example: 'Lễ cúng cơm mới, nghề rèn, dệt thổ cẩm, bánh khảo, men lá…' },
    { title: 'Sản phẩm bản địa & mô hình xanh bền vững', example: 'Thạch đen, lúa nếp hương, chè đắng, lợn đen thả rừng…' },
    { title: 'Hạt nhân xanh – Giữ rừng, giữ bản', example: 'Già làng giữ rừng, người trẻ về quê khởi nghiệp xanh…' },
    { title: 'Sáng kiến phát huy văn hóa nông nghiệp', example: 'Du lịch trải nghiệm gặt lúa, quảng bá nông sản trên MXH…' },
  ],
  formats: [
    { title: 'Bài viết', detail: 'Dưới 1.000 từ, kèm ít nhất 3 ảnh thực tế có chú thích.' },
    { title: 'Video dọc 9:16', detail: '3–5 phút, âm thanh rõ, khuyến khích có phụ đề.' },
  ],
  bonus: 'Cộng điểm ưu tiên cho tác phẩm bằng tiếng dân tộc (Tày, Nùng, H’Mông, Dao…) có phụ đề Tiếng Việt.',
  dates: [
    { date: '16/11/2026', label: 'Mở cổng nhận bài' },
    { date: '16/12/2026', label: 'Hạn chót nộp bài (23:59)' },
    { date: '27/12/2026', label: 'Công bố kết quả tại Webinar' },
  ],
  prizes: [
    { title: 'Giải Nhất', value: '3.000.000đ' },
    { title: 'Giải Nhì', value: '2.000.000đ' },
    { title: 'Giải Ba', value: '1.000.000đ' },
    { title: 'Đề bài được quan tâm nhất', value: 'Thành chủ đề Webinar toàn quốc' },
  ],
  allEntrants: 'Mọi bài dự thi hợp lệ đều nhận Giấy chứng nhận điện tử (e-certificate) từ Agri-Next Vietnam.',
  rulesUrl: 'https://docs.google.com/document/d/1UudZ11cgA5RME6ZJOEJdC_5JQJSpV5htBYeBcaPufww/edit',
  howToSubmit:
    'Gửi qua Email của Ban Tổ chức hoặc nhắn tin Fanpage Agri-Next Vietnam, tiêu đề: [CBX] Họ tên – Dạng 1/Dạng 2 – Tên bài dự thi.',
  scoring: '70% điểm Ban Giám khảo + 30% điểm tiếp cận trên mạng xã hội',
};

export const UPCOMING_WEBINAR = {
  title: 'Chọn Kinh tế hay chọn Bền vững trong Nông nghiệp?',
  blurb:
    'Webinar sắp tới của Agri-Next: cùng chuyên gia và các bạn trẻ tranh luận liệu thu nhập và bền vững có phải là hai lựa chọn đối lập — và làm sao để nông nghiệp vùng cao có cả hai.',
  status: 'Sắp mở đăng ký',
  date: '27/12/2026',
  highlight: 'Công bố kết quả & vinh danh cuộc thi Cao Bằng Xanh',
};

export const CORE_VALUES = [
  { title: 'Bản địa', detail: 'Luôn lấy con người và tri thức địa phương làm gốc.', motif: 'diamond' as const },
  { title: 'Sáng tạo', detail: 'Không ngừng ứng dụng công nghệ để tối ưu hiệu quả.', motif: 'star' as const },
  { title: 'Bền vững', detail: 'Mọi hành động hướng tới lợi ích lâu dài cho môi trường và cộng đồng.', motif: 'flower' as const },
];

export const SDGS = ['SDG 8', 'SDG 12', 'SDG 13', 'SDG 15'];

export const TEAM = {
  founders: [
    { name: 'Lê Thị Phương Khanh', role: 'Sáng lập, Đồng Trưởng dự án' },
    { name: 'Trần Linh Trang', role: 'Đồng sáng lập, Đồng Trưởng dự án' },
  ],
  leads: [
    { name: 'Trần Viết Tuấn Anh', role: 'Quản lý Hình ảnh, Thiết kế' },
    { name: 'Nguyễn Dương Bảo Linh', role: 'Trưởng ban Đào tạo' },
    { name: 'Phạm Thùy Dương', role: 'Trưởng ban Truyền thông' },
    { name: 'Nguyễn Đỗ Vân Khanh', role: 'Trưởng ban Đối ngoại' },
    { name: 'Đỗ Mỹ Anh', role: 'Quan hệ đối tác' },
    { name: 'Hồ Thị Hoài Anh', role: 'Trợ lý quản lý dự án' },
    { name: 'Nguyễn Thị Hòe', role: 'Phát triển nội dung' },
    { name: 'Lê Hiền Phương Giang', role: 'Phát triển nội dung' },
    { name: 'Phạm Phương Thảo', role: 'Hỗ trợ truyền thông' },
  ],
};

/* ------------------------------------------------------------------ */
/* "Săn Sticker" quiz — every answer can be found on the "Dự án" page. */
/* ------------------------------------------------------------------ */

export type ShowcaseSectionId =
  | 'du-an-gioi-thieu'
  | 'du-an-cao-bang-xanh'
  | 'du-an-nong-nghiep-cao-bang'
  | 'du-an-boi-canh'
  | 'du-an-giai-doan'
  | 'du-an-bootcamp'
  | 'du-an-ruong-mau'
  | 'du-an-chien-dich'
  | 'du-an-gia-tri';

export const SHOWCASE_SECTION_LABELS: Record<ShowcaseSectionId, string> = {
  'du-an-gioi-thieu': 'Giới thiệu & Sứ mệnh',
  'du-an-cao-bang-xanh': 'Cuộc thi Cao Bằng Xanh & Webinar',
  'du-an-boi-canh': 'Bối cảnh',
  'du-an-nong-nghiep-cao-bang': 'Nông nghiệp Cao Bằng',
  'du-an-giai-doan': '3 hoạt động chính',
  'du-an-bootcamp': 'Bootcamp',
  'du-an-ruong-mau': 'Ruộng mẫu',
  'du-an-chien-dich': 'Chiến dịch truyền thông',
  'du-an-gia-tri': 'Tầm nhìn & Giá trị',
};

export interface StickerQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  section: ShowcaseSectionId;
}

export const STICKER_QUESTIONS: StickerQuestion[] = [
  {
    id: 'q-youth',
    question: 'Agri-Next đặt mục tiêu trao quyền cho bao nhiêu thanh niên qua 2 đợt Bootcamp?',
    options: ['10 thanh niên', '20 thanh niên', '40 thanh niên', '100 thanh niên'],
    answer: 2,
    explain: '2 đợt Bootcamp × 20 học viên = 40 thanh niên được trao quyền.',
    section: 'du-an-gioi-thieu',
  },
  {
    id: 'q-field',
    question: 'Ruộng mẫu Agri-Next tại Cao Bằng rộng khoảng bao nhiêu?',
    options: ['100 m²', '1.000 m²', '1 héc-ta', '5.000 m²'],
    answer: 1,
    explain: 'Ruộng mẫu 1.000 m² gồm vườn rau bản địa và vườn thuốc để thanh niên thực hành.',
    section: 'du-an-ruong-mau',
  },
  {
    id: 'q-campaign',
    question: 'Chiến dịch truyền thông số của Agri-Next có tên là gì?',
    options: ['Green Farm Vietnam', 'Young Roots, Green Future', 'Save the Soil', 'Climate Kids'],
    answer: 1,
    explain: '“Young Roots, Green Future” – Mầm rễ Trẻ, Tương lai Xanh.',
    section: 'du-an-chien-dich',
  },
  {
    id: 'q-migration',
    question: 'Theo TCTK 2021, khoảng bao nhiêu % thanh niên miền núi phía Bắc di cư rời quê?',
    options: ['20%', '45%', '70%', '90%'],
    answer: 2,
    explain: '70% — đây là lý do Agri-Next muốn tạo sinh kế xanh ngay tại quê hương.',
    section: 'du-an-boi-canh',
  },
  {
    id: 'q-soil',
    question: 'Biến đổi khí hậu đã gây suy thoái bao nhiêu đất nông nghiệp vùng Đông Bắc?',
    options: ['Hơn 10%', 'Hơn 30%', 'Hơn 60%', 'Không đáng kể'],
    answer: 2,
    explain: 'Hơn 60% đất nông nghiệp Đông Bắc bị suy thoái (Bộ NN&PTNT 2021).',
    section: 'du-an-boi-canh',
  },
  {
    id: 'q-bootcamp-days',
    question: 'Mỗi trại huấn luyện Agri-Next đào tạo tập trung trong bao lâu?',
    options: ['1 ngày', '5 ngày', '1 tháng', '1 năm'],
    answer: 1,
    explain: 'Chương trình tập trung 5 ngày, 20 học viên mỗi trại.',
    section: 'du-an-bootcamp',
  },
  {
    id: 'q-values',
    question: '3 giá trị cốt lõi của Agri-Next là gì?',
    options: [
      'Nhanh – Rẻ – Nhiều',
      'Bản địa – Sáng tạo – Bền vững',
      'Công nghệ – Lợi nhuận – Quy mô',
      'Xanh – Sạch – Đẹp',
    ],
    answer: 1,
    explain: 'Bản địa · Sáng tạo · Bền vững.',
    section: 'du-an-gia-tri',
  },
  {
    id: 'q-phases',
    question: 'Đâu KHÔNG phải là một trong 3 hoạt động chính của Agri-Next?',
    options: ['Trại huấn luyện', 'Ruộng mẫu & cố vấn', 'Chiến dịch truyền thông số', 'Xây nhà máy phân bón'],
    answer: 3,
    explain: '3 hoạt động: Bootcamp, Ruộng mẫu với cố vấn tích hợp, và chiến dịch truyền thông.',
    section: 'du-an-giai-doan',
  },
  {
    id: 'q-vac',
    question: 'Trong Module “Kinh tế tuần hoàn”, mô hình VAC là viết tắt của?',
    options: ['Vốn – An toàn – Chất lượng', 'Vườn – Ao – Chuồng', 'Vụ – Ấm – Chín', 'Vật tư – Ăn – Chế biến'],
    answer: 1,
    explain: 'VAC = Vườn – Ao – Chuồng, mô hình tuần hoàn truyền thống được cải tiến.',
    section: 'du-an-bootcamp',
  },
  {
    id: 'q-herb',
    question: 'Loại cây nào được trồng trong Vườn thuốc của ruộng mẫu?',
    options: ['Cà phê', 'Đinh lăng & sa nhân', 'Cao su', 'Thanh long'],
    answer: 1,
    explain: 'Vườn thuốc có các cây bản địa như đinh lăng, sa nhân, nghệ đen.',
    section: 'du-an-ruong-mau',
  },
  {
    id: 'q-reach',
    question: 'Chiến dịch “Young Roots, Green Future” hướng tới bao nhiêu lượt tiếp cận?',
    options: ['5.000', '50.000', '500.000', '5 triệu'],
    answer: 2,
    explain: 'Mục tiêu 500.000 lượt tiếp cận — và đã đạt gần 600.000!',
    section: 'du-an-chien-dich',
  },
  {
    id: 'q-network',
    question: 'Agri-Next đồng hành cùng mạng lưới thanh niên khí hậu nào?',
    options: ['Youth 4 Climate', 'Green Peace Kids', 'Climate Club', 'Eco Youth Asia'],
    answer: 0,
    explain: 'Agri-Next được dẫn dắt cùng tinh thần mạng lưới Youth 4 Climate.',
    section: 'du-an-gioi-thieu',
  },
  {
    id: 'q-mentor',
    question: 'Sau Bootcamp, học viên có thể trở thành gì để tạo vòng lặp học tập?',
    options: ['Khách hàng', 'Cố vấn đồng đẳng (Peer Mentor)', 'Nhà đầu tư', 'Giám khảo'],
    answer: 1,
    explain: 'Học viên trở thành Peer Mentor, hướng dẫn lứa tiếp theo.',
    section: 'du-an-giai-doan',
  },
  {
    id: 'q-permaculture',
    question: '“Permaculture” mà Bootcamp giảng dạy nói về điều gì?',
    options: [
      'Trồng một loại cây trên diện tích lớn',
      'Thiết kế trang trại / hệ sinh thái bền vững',
      'Dùng thật nhiều phân bón hoá học',
      'Nuôi trồng thuỷ sản công nghiệp',
    ],
    answer: 1,
    explain: 'Permaculture là thiết kế hệ sinh thái nông nghiệp bền vững, tự cân bằng.',
    section: 'du-an-bootcamp',
  },
  {
    id: 'q-chestnut',
    question: 'Hạt dẻ Trùng Khánh nổi tiếng nhờ sinh trưởng ven dòng sông nào?',
    options: ['Sông Hồng', 'Sông Quây Sơn', 'Sông Đà', 'Sông Mã'],
    answer: 1,
    explain: 'Hạt dẻ Trùng Khánh lớn lên nhờ khí hậu mát lạnh và đất phù sa ven sông Quây Sơn.',
    section: 'du-an-nong-nghiep-cao-bang',
  },
  {
    id: 'q-vermicelli',
    question: 'Miến dong Phia Đén được làm từ nguyên liệu nào?',
    options: ['Gạo nếp', 'Củ dong riềng', 'Bột mì', 'Khoai lang'],
    answer: 1,
    explain: 'Củ dong riềng trồng trên 800 m ở Phia Đén cho sợi miến dai, không tẩy trắng.',
    section: 'du-an-nong-nghiep-cao-bang',
  },
  {
    id: 'q-grassjelly',
    question: 'Đặc sản nào của Cao Bằng còn được gọi là “sương sáo”?',
    options: ['Thạch đen Đông Khê', 'Lê Bảo Lạc', 'Hạt dẻ Trùng Khánh', 'Chè đắng'],
    answer: 0,
    explain: 'Thạch đen (sương sáo) Đông Khê cho hiệu quả kinh tế gấp 3–4 lần cây lúa.',
    section: 'du-an-nong-nghiep-cao-bang',
  },
  {
    id: 'q-vetiver',
    question: 'Agri-Next gợi ý trồng cỏ gì theo đường đồng mức để chống xói mòn đất dốc ở Phia Đén?',
    options: ['Cỏ voi', 'Cỏ vetiver', 'Cỏ lau', 'Cỏ mần trầu'],
    answer: 1,
    explain: 'Cỏ vetiver có bộ rễ sâu giữ đất, chống rửa trôi mùa mưa lũ.',
    section: 'du-an-nong-nghiep-cao-bang',
  },
  {
    id: 'q-cbx-age',
    question: 'Cuộc thi “Cao Bằng Xanh” dành cho bạn trẻ trong độ tuổi nào?',
    options: ['12–17 tuổi', '18–29 tuổi', '30–45 tuổi', 'Mọi lứa tuổi'],
    answer: 1,
    explain: 'Công dân Việt Nam 18–29 tuổi trên toàn quốc, cá nhân hoặc nhóm tối đa 3 người.',
    section: 'du-an-cao-bang-xanh',
  },
  {
    id: 'q-cbx-format',
    question: 'Video dự thi “Cao Bằng Xanh” cần quay theo khung hình nào?',
    options: ['Ngang 16:9', 'Vuông 1:1', 'Dọc 9:16', 'Tuỳ ý'],
    answer: 2,
    explain: 'Video dọc 9:16, dài 3–5 phút — phù hợp xem trên điện thoại.',
    section: 'du-an-cao-bang-xanh',
  },
  {
    id: 'q-cbx-hashtag',
    question: 'Hashtag chính thức của cuộc thi “Cao Bằng Xanh” là gì?',
    options: ['#GreenCaoBang', '#CaoBangXanh', '#AgriNext2026', '#MamReTre'],
    answer: 1,
    explain: '#CaoBangXanh — đừng quên gắn khi chia sẻ bài dự thi nhé!',
    section: 'du-an-cao-bang-xanh',
  },
];

export const STICKER_QUIZ_LENGTH = 5;
export const STICKER_PASS_SCORE = 4;

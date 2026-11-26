import type { SustainabilityPersona } from '../types';

export interface CaoBangSpecialty {
  id: string;
  name: string;
  regionLabel: string;
  season: string;
  tagline: string;
  description: string;
  climateChallenge: string;
  agriNextSolution: string;
  keyMetric: string;
}

export const CAO_BANG_SPECIALTIES: CaoBangSpecialty[] = [
  {
    id: 'hat-de-trung-khanh',
    name: 'Hạt dẻ Trùng Khánh',
    regionLabel: 'Lưu vực sông Quây Sơn · Trùng Khánh',
    season: 'Thu hoạch tháng 9 – 10 âm lịch',
    tagline: 'Chỉ dẫn địa lý danh tiếng với vị bùi béo đặc trưng núi đá vôi',
    description:
      'Hạt dẻ Trùng Khánh sinh trưởng đặc hữu nhờ khí hậu mát lạnh và đất phù sa ven sông Quây Sơn. Hạt to đều, vỏ nâu sẫm, khi rang chín tỏa hương thơm ngậy khó lẫn.',
    climateChallenge:
      'Biến đổi khí hậu gây sương muối muộn và khô hạn cục bộ làm giảm tỷ lệ đậu quả và khiến cây già dễ nhiễm sâu đục thân.',
    agriNextSolution:
      'Phủ thực bì giữ ẩm gốc, sử dụng phân hữu cơ ủ vi sinh tại chỗ và đào tạo thanh niên xây dựng câu chuyện truy xuất nguồn gốc số.',
    keyMetric: 'Chỉ dẫn địa lý quốc gia · Sinh kế chủ lực của hơn 1.200 hộ dân',
  },
  {
    id: 'thach-den-dong-khe',
    name: 'Thạch đen Đông Khê',
    regionLabel: 'Huyện Thạch An · Đông Khê',
    season: 'Vụ chính từ tháng 4 – 9 dương lịch',
    tagline: 'Cây dược liệu giải nhiệt tạo giá trị kinh tế vượt trội cho vùng cao',
    description:
      'Cây thạch đen (sương sáo) phát triển mạnh trên các triền đất thoáng khí ở Đông Khê, cho lá dày giàu nhựa tự nhiên, là nguyên liệu chủ lực cho ngành thực phẩm giải khát.',
    climateChallenge:
      'Canh tác độc canh lâu năm và phụ thuộc thương lái thu mua nguyên liệu thô khiến đất dễ thoái hóa và giá bán bấp bênh.',
    agriNextSolution:
      'Luân canh họ đậu cải tạo đất trên ruộng mẫu 1.000 m², kết hợp sơ chế sạch và phát triển dòng trà thạch đen đóng gói OCOP.',
    keyMetric: 'Hiệu quả kinh tế cao gấp 3–4 lần cây lúa truyền thống',
  },
  {
    id: 'mien-dong-phia-den',
    name: 'Miến dong Phia Đén',
    regionLabel: 'Huyện Nguyên Bình · Phia Đén',
    season: 'Thu hoạch củ cuối thu – chế biến mùa đông',
    tagline: 'Sợi miến dai trong từ củ dong riềng vùng núi cao, vươn ra xuất khẩu',
    description:
      'Củ dong riềng trồng ở độ cao trên 800m tại Phia Đén tích tụ hàm lượng tinh bột dồi dào, tạo ra sợi miến màu xám tự nhiên, không tẩy trắng và nấu lâu không nát.',
    climateChallenge:
      'Canh tác trên sườn dốc dễ gây rửa trôi tầng đất mặt mỗi mùa mưa lũ lớn, đồng thời bã dong riềng sau chế biến cần xử lý thân thiện môi trường.',
    agriNextSolution:
      'Trồng cỏ vetiver theo đường đồng mức chống xói mòn và tận dụng bã dong riềng ủ phân compost tuần hoàn trả lại dinh dưỡng cho đất.',
    keyMetric: 'Sản phẩm OCOP 4–5 sao · Đã xuất khẩu sang thị trường quốc tế',
  },
  {
    id: 'le-duoc-lieu-bao-lac',
    name: 'Lê & Dược liệu Bảo Lạc',
    regionLabel: 'Vùng cao Bảo Lạc · Phia Oắc',
    season: 'Lê chín rộ tháng 7 – 8 dương lịch',
    tagline: 'Cây ăn quả ôn đới và thảo dược bản địa dưới tán rừng',
    description:
      'Khí hậu lạnh vùng cao Bảo Lạc và hệ sinh thái Phia Oắc nuôi dưỡng các giống lê giòn ngọt, mận máu, măng khô cùng nhiều giống dược liệu bản địa quý của đồng bào Tày, Nùng, Mông, Dao.',
    climateChallenge:
      'Đường vận chuyển xa trung tâm, tỷ lệ hao hụt sau thu hoạch cao và thanh niên địa phương có xu hướng rời bản đi làm ăn xa.',
    agriNextSolution:
      'Ứng dụng nông lâm kết hợp dưới tán rừng, tập huấn khởi nghiệp xanh cho thanh niên dân tộc thiểu số và kết nối du lịch nông nghiệp trải nghiệm.',
    keyMetric: 'Bảo tồn giống cây bản địa · Gắn nông nghiệp với bảo vệ rừng',
  },
];

export interface AgriNextPillar {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  impactFact: string;
}

export const AGRI_NEXT_PILLARS: AgriNextPillar[] = [
  {
    index: '01',
    title: 'Trại huấn luyện Thanh niên (Bootcamp)',
    subtitle: 'Kiến thức nông nghiệp tái sinh & khởi nghiệp xanh',
    description:
      'Đào tạo tập trung cho các trại viên thanh niên địa phương và đồng bào dân tộc thiểu số tại Cao Bằng, kết nối tri thức bản địa với tư duy quản trị chuỗi giá trị nông sản hiện đại.',
    impactFact: 'Trao quyền cho thanh niên địa phương làm chủ sinh kế xanh tại quê hương',
  },
  {
    index: '02',
    title: 'Không gian học tập & Ruộng mẫu 1.000 m²',
    subtitle: 'Thực nghiệm, đồng sáng tạo và bảo tồn giống bản địa',
    description:
      'Khu vườn thực hành rộng 1.000 m² tại Cao Bằng nơi thanh niên trực tiếp thử nghiệm ủ phân vi sinh, che phủ đất, luân canh thích ứng khí hậu và bảo tồn nguồn gen cây dược liệu bản địa.',
    impactFact: '1.000 m² mô hình canh tác tuần hoàn mở cho cộng đồng đến tham quan học hỏi',
  },
  {
    index: '03',
    title: 'Chiến dịch "Mầm rễ Trẻ, Tương lai Xanh"',
    subtitle: 'Young Roots, Green Futures · Đồng hành Youth 4 Climate',
    description:
      'Khuếch đại tiếng nói người trẻ vùng cao qua truyền thông số và trò chơi tương tác, giúp người tiêu dùng đô thị hiểu rõ giá trị bền vững đằng sau mỗi nông sản Cao Bằng.',
    impactFact: 'Kết nối trực tiếp nông dân trẻ Cao Bằng với cộng đồng yêu nông sản sạch',
  },
];

/* =========================================================================
   GAME 1: "MÙA VỤ TÁI SINH" (6-Season Climate-Smart Farm Decision Simulator)
   ========================================================================= */

export interface FarmDilemmaChoice {
  id: string;
  label: string;
  detail: string;
  tag: SustainabilityPersona;
  effects: {
    soil: number;
    income: number;
    community: number;
    quality: number;
  };
  outcomeNote: string;
}

export interface FarmDilemma {
  id: string;
  seasonNumber: number;
  seasonTitle: string;
  location: string;
  situation: string;
  mascotHint: string;
  choices: FarmDilemmaChoice[];
}

export const FARM_DILEMMAS: FarmDilemma[] = [
  {
    id: 'dilemma-1-soil',
    seasonNumber: 1,
    seasonTitle: 'Mùa Xuân · Chuẩn bị đất ruộng mẫu 1.000 m²',
    location: 'Sườn đồi Phia Đén, Nguyên Bình',
    situation:
      'Đất trồng dong riềng sau nhiều vụ canh tác bắt đầu chai cứng và dễ rửa trôi khi mưa đầu mùa kéo tới. Bạn chọn cách phục hồi đất nào?',
    mascotHint: 'Đất khỏe là gốc rễ của mọi mùa vụ thích ứng biến đổi khí hậu!',
    choices: [
      {
        id: 'c1-compost',
        label: 'Ủ phân compost từ bã dong riềng & trồng cỏ giữ đất',
        detail: 'Tốn thêm công lao động ban đầu nhưng tái tạo mùn hữu cơ lâu dài.',
        tag: 'eco_guardian',
        effects: { soil: 18, income: -4, community: 8, quality: 14 },
        outcomeNote:
          'Tuyệt vời! Độ ẩm và vi sinh vật đất phục hồi rõ rệt, giảm hẳn xói mòn khi mưa lớn về.',
      },
      {
        id: 'c1-chemical',
        label: 'Tăng phân bón hóa học để rút ngắn thời gian trồng',
        detail: 'Cây lên nhanh trong vụ này và tiết kiệm nhân công chăm sóc.',
        tag: 'market_builder',
        effects: { soil: -15, income: 12, community: -4, quality: -8 },
        outcomeNote:
          'Sản lượng trước mắt tăng nhưng đất bạc màu nhanh hơn, dễ suy kiệt ở các vụ tiếp theo.',
      },
      {
        id: 'c1-workshop',
        label: 'Tổ chức ngày hội ủ phân bản địa cùng thanh niên trong bản',
        detail: 'Vừa xử lý đất hữu cơ vừa chia sẻ kỹ thuật với 15 hộ lân cận.',
        tag: 'community_weaver',
        effects: { soil: 14, income: 2, community: 18, quality: 10 },
        outcomeNote:
          'Mô hình lan tỏa mạnh! Cả bản cùng áp dụng kỹ thuật phủ thực bì cho mùa vụ mới.',
      },
    ],
  },
  {
    id: 'dilemma-2-frost',
    seasonNumber: 2,
    seasonTitle: 'Mùa Hè · Nắng hạn xen mưa đá bất thường',
    location: 'Vùng trồng Thạch đen Đông Khê, Thạch An',
    situation:
      'Đợt nắng nóng kéo dài 3 tuần đe dọa vườn thạch đen đang ra lá non. Bạn sẽ ứng phó ra sao để bảo vệ năng suất?',
    mascotHint: 'Thích ứng khí hậu thông minh giúp giảm rủi ro mất mùa cho nông hộ.',
    choices: [
      {
        id: 'c2-mulch',
        label: 'Che phủ rơm rạ sinh học & luân canh đậu tương che bóng',
        detail: 'Giữ ẩm tự nhiên cho đất và bổ sung đạm sinh học cho vụ sau.',
        tag: 'eco_guardian',
        effects: { soil: 16, income: 6, community: 6, quality: 14 },
        outcomeNote:
          'Lá thạch đen giữ được độ dày và hàm lượng nhựa cao dù thời tiết khắc nghiệt.',
      },
      {
        id: 'c2-drip',
        label: 'Lắp cảm biến độ ẩm & tưới nhỏ giọt tiết kiệm nước',
        detail: 'Đầu tư thiết bị thông minh giúp tối ưu lượng nước suối tự nhiên.',
        tag: 'agri_innovator',
        effects: { soil: 10, income: 8, community: 6, quality: 16 },
        outcomeNote:
          'Tiết kiệm tới 45% lượng nước tưới và giữ chất lượng lá đồng đều toàn vườn.',
      },
      {
        id: 'c2-pump',
        label: 'Bơm tưới tràn liên tục và thu hoạch sớm chạy thời tiết',
        detail: 'Giữ được dòng tiền nhanh nhưng lá chưa đạt độ chín tối ưu.',
        tag: 'market_builder',
        effects: { soil: -10, income: 10, community: -2, quality: -12 },
        outcomeNote:
          'Bạn bán được hàng sớm nhưng thương lái ép giá vì chất lượng lá thạch chưa đạt chuẩn.',
      },
    ],
  },
  {
    id: 'dilemma-3-youth',
    seasonNumber: 3,
    seasonTitle: 'Chuyển Mùa · Giữ chân thanh niên Cao Bằng',
    location: 'Trại huấn luyện Agri-Next Bootcamp',
    situation:
      'Nhiều bạn trẻ trong xã dự định rời quê đi làm công nhân vì nghĩ làm nông vất vả, thu nhập bấp bênh. Bạn đề xuất sáng kiến nào?',
    mascotHint: 'Thanh niên địa phương chính là trái tim của Agri-Next Vietnam.',
    choices: [
      {
        id: 'c3-coop',
        label: 'Lập tổ hợp tác thanh niên chia sẻ lợi nhuận minh bạch',
        detail: 'Cùng nhau sản xuất theo tiêu chuẩn xanh và chia sẻ đầu ra chung.',
        tag: 'community_weaver',
        effects: { soil: 6, income: 12, community: 20, quality: 10 },
        outcomeNote:
          '12 bạn trẻ quyết định ở lại quê hương, biến ruộng mẫu thành hợp tác xã nông nghiệp trẻ.',
      },
      {
        id: 'c3-digital',
        label: 'Đào tạo quay video kể chuyện bản địa & bán hàng số',
        detail: 'Biến kỹ năng truyền thông của Gen Z thành lợi thế cho đặc sản quê nhà.',
        tag: 'agri_innovator',
        effects: { soil: 4, income: 18, community: 14, quality: 8 },
        outcomeNote:
          'Các video kể chuyện mùa dẻ và miến dong thu hút hàng chục nghìn lượt quan tâm từ thành phố!',
      },
      {
        id: 'c3-hire',
        label: 'Thuê nhân công thời vụ từ nơi khác để giữ tiến độ',
        detail: 'Nhanh gọn cho vụ mùa nhưng chưa tạo được đội ngũ kế cận tại chỗ.',
        tag: 'market_builder',
        effects: { soil: 0, income: 10, community: -12, quality: 4 },
        outcomeNote:
          'Công việc vẫn chạy nhưng cộng đồng trẻ địa phương chưa thấy cơ hội gắn bó lâu dài.',
      },
    ],
  },
  {
    id: 'dilemma-4-chestnut',
    seasonNumber: 4,
    seasonTitle: 'Mùa Thu · Thu hoạch Hạt dẻ Trùng Khánh',
    location: 'Lưu vực sông Quây Sơn, Trùng Khánh',
    situation:
      'Hạt dẻ Trùng Khánh vào chính vụ nhưng trên thị trường xuất hiện nhiều hạt dẻ trôi nổi mạo danh, khiến khách hàng khó phân biệt.',
    mascotHint: 'Niềm tin người tiêu dùng đến từ sự minh bạch nguồn gốc.',
    choices: [
      {
        id: 'c4-qr',
        label: 'Gắn mã QR truy xuất từng vườn dẻ & nhật ký canh tác xanh',
        detail: 'Khách quét mã thấy ngay hộ nông dân, ngày thu hoạch và chứng nhận.',
        tag: 'agri_innovator',
        effects: { soil: 6, income: 16, community: 10, quality: 18 },
        outcomeNote:
          'Khách hàng đô thị sẵn sàng trả giá cao hơn nhờ tin tưởng 100% xuất xứ Trùng Khánh!',
      },
      {
        id: 'c4-wholesale',
        label: 'Bán xô toàn bộ cho thương lái tại vườn cho nhanh gọn',
        detail: 'Thu tiền mặt ngay nhưng mất quyền định giá thương hiệu địa phương.',
        tag: 'market_builder',
        effects: { soil: 0, income: 8, community: -6, quality: -8 },
        outcomeNote:
          'Tiền về nhanh nhưng biên lợi nhuận thấp và người mua không biết tới công sức làm nông sạch.',
      },
      {
        id: 'c4-tour',
        label: 'Mở lễ hội nhặt hạt dẻ & trải nghiệm rang dẻ bản địa',
        detail: 'Kết hợp du lịch sinh thái để du khách tự tay thu hoạch tại vườn.',
        tag: 'community_weaver',
        effects: { soil: 8, income: 14, community: 18, quality: 12 },
        outcomeNote:
          'Du khách hào hứng chia sẻ trải nghiệm, giúp thương hiệu hạt dẻ quê nhà lan tỏa tự nhiên.',
      },
    ],
  },
  {
    id: 'dilemma-5-processing',
    seasonNumber: 5,
    seasonTitle: 'Cuối Thu · Nâng tầm giá trị nông sản OCOP',
    location: 'Xưởng sơ chế hợp tác xã thanh niên',
    situation:
      'Nguồn nguyên liệu thạch đen, miến dong và thảo dược Bảo Lạc đã ổn định. Bạn muốn đưa sản phẩm ra thị trường thành phố bằng chiến lược nào?',
    mascotHint: 'Chế biến sâu và bao bì kể chuyện giúp nông sản vùng cao đứng vững.',
    choices: [
      {
        id: 'c5-giftbox',
        label: 'Thiết kế hộp quà "Hương vị Non Nước" dùng bao bì giấy tái chế',
        detail: 'Kết hợp 4 đặc sản Cao Bằng kèm câu chuyện bảo tồn khí hậu.',
        tag: 'eco_guardian',
        effects: { soil: 14, income: 14, community: 10, quality: 16 },
        outcomeNote:
          'Bộ quà xanh chinh phục các doanh nghiệp và người tiêu dùng trẻ yêu lối sống bền vững!',
      },
      {
        id: 'c5-b2b',
        label: 'Ký hợp đồng cung ứng chuẩn hóa với chuỗi cửa hàng thực phẩm sạch',
        detail: 'Đảm bảo sản lượng tiêu thụ ổn định quanh năm cho bà con.',
        tag: 'market_builder',
        effects: { soil: 4, income: 20, community: 8, quality: 14 },
        outcomeNote:
          'Thu nhập nông hộ tăng đều 35%, tạo động lực mở rộng diện tích canh tác chuẩn sạch.',
      },
      {
        id: 'c5-preserve',
        label: 'Phát triển dòng dược liệu đặc hữu theo bài thuốc dân gian Tày - Dao',
        detail: 'Tôn vinh tri thức bản địa kết hợp kiểm nghiệm an toàn hiện đại.',
        tag: 'community_weaver',
        effects: { soil: 10, income: 12, community: 18, quality: 16 },
        outcomeNote:
          'Tri thức quý của nghệ nhân lớn tuổi được thế hệ trẻ gìn giữ và tạo ra giá trị kinh tế mới.',
      },
    ],
  },
  {
    id: 'dilemma-6-scale',
    seasonNumber: 6,
    seasonTitle: 'Mùa Đông · Tổng kết & Nhân rộng mô hình',
    location: 'Diễn đàn Thanh niên Hành động vì Khí hậu',
    situation:
      'Sau một năm thành công, ruộng mẫu 1.000 m² nhận được khoản tài trợ mở rộng. Bạn ưu tiên phân bổ nguồn lực vào đâu?',
    mascotHint: 'Quyết định cuối cùng định hình bản sắc nhà lãnh đạo nông nghiệp xanh của bạn!',
    choices: [
      {
        id: 'c6-seedbank',
        label: 'Xây ngân hàng hạt giống bản địa & nhân rộng nông nghiệp tái sinh',
        detail: 'Bảo vệ đa dạng sinh học Cao Bằng cho nhiều thế hệ tương lai.',
        tag: 'eco_guardian',
        effects: { soil: 20, income: 4, community: 12, quality: 16 },
        outcomeNote:
          'Ngân hàng giống bản địa trở thành lá chắn khí hậu bền vững cho toàn vùng.',
      },
      {
        id: 'c6-academy',
        label: 'Mở thêm 3 khóa Bootcamp miễn phí cho thanh niên các huyện vùng xa',
        detail: 'Nhân rộng mạng lưới người trẻ khởi nghiệp xanh tại Bảo Lạc, Trùng Khánh.',
        tag: 'community_weaver',
        effects: { soil: 10, income: 8, community: 22, quality: 10 },
        outcomeNote:
          'Mạng lưới "Mầm rễ Trẻ" phủ rộng khắp Cao Bằng, lan tỏa cảm hứng hành động vì khí hậu.',
      },
      {
        id: 'c6-platform',
        label: 'Xây nền tảng kết nối trực tiếp "Từ vườn Cao Bằng đến bàn ăn"',
        detail: 'Cắt giảm trung gian, tăng minh bạch giá trị và thu thập dữ liệu thị trường.',
        tag: 'agri_innovator',
        effects: { soil: 8, income: 20, community: 12, quality: 14 },
        outcomeNote:
          'Người tiêu dùng kết nối thẳng với nông dân trẻ, mở ra tương lai nông nghiệp số minh bạch!',
      },
    ],
  },
];

export const PERSONA_LABELS: Record<
  SustainabilityPersona,
  { title: string; subtitle: string; badge: string }
> = {
  eco_guardian: {
    title: 'Người Gìn Giữ Hệ Sinh Thái',
    subtitle: 'Bạn đặt sức khỏe đất đai, đa dạng sinh học và nông nghiệp tái sinh lên hàng đầu.',
    badge: 'Bảo vệ Khí hậu',
  },
  market_builder: {
    title: 'Kiến Trúc Sư Chuỗi Giá Trị',
    subtitle: 'Bạn nhạy bén về đầu ra bền vững, hiệu quả kinh tế và chuẩn hóa thương hiệu nông sản.',
    badge: 'Phát triển Thị trường',
  },
  community_weaver: {
    title: 'Người Kết Nối Cộng Đồng Trẻ',
    subtitle: 'Bạn tin sức mạnh lớn nhất nằm ở thanh niên địa phương và tri thức bản địa Cao Bằng.',
    badge: 'Sức mạnh Cộng đồng',
  },
  agri_innovator: {
    title: 'Nhà Tiên Phong Nông Nghiệp Số',
    subtitle: 'Bạn kết hợp công nghệ truy xuất, nông nghiệp thông minh và truyền thông hiện đại.',
    badge: 'Đổi mới Sáng tạo',
  },
};

/* =========================================================================
   GAME 2: "THỬ THÁCH NÔNG SẢN CAO BẰNG" (8 Knowledge & Awareness Questions)
   ========================================================================= */

export interface QuizQuestion {
  id: string;
  topic:
    | 'Đặc sản & Chỉ dẫn địa lý'
    | 'Nông nghiệp tái sinh'
    | 'Thích ứng khí hậu Cao Bằng'
    | 'Khởi nghiệp xanh & OCOP';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CAO_BANG_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Đặc sản & Chỉ dẫn địa lý',
    question: 'Đặc sản nào của huyện Trùng Khánh (Cao Bằng) gắn liền với lưu vực sông Quây Sơn và đã được bảo hộ Chỉ dẫn địa lý?',
    options: ['Hạt dẻ Trùng Khánh', 'Cam sành Hàm Yên', 'Chè Shan Tuyết Suối Giàng', 'Hồi Lạng Sơn'],
    correctIndex: 0,
    explanation:
      'Hạt dẻ Trùng Khánh nổi tiếng to đều, bùi ngọt đặc trưng nhờ thổ nhưỡng và khí hậu riêng biệt ven sông Quây Sơn.',
  },
  {
    id: 'q2',
    topic: 'Đặc sản & Chỉ dẫn địa lý',
    question: 'Sợi miến dong Phia Đén (huyện Nguyên Bình) có màu xám trong tự nhiên và nấu lâu không nát nhờ làm từ nguyên liệu gì?',
    options: ['Bột gạo nếp ong', 'Tinh bột củ dong riềng trồng trên núi cao', 'Bột sắn dây rừng', 'Bột khoai sọ vùng cao'],
    correctIndex: 1,
    explanation:
      'Củ dong riềng trồng ở vùng núi cao mát lạnh Phia Đén tích tụ tinh bột chất lượng cao, giúp miến dong Cao Bằng vươn ra xuất khẩu.',
  },
  {
    id: 'q3',
    topic: 'Đặc sản & Chỉ dẫn địa lý',
    question: 'Huyện Thạch An (Đông Khê, Cao Bằng) nổi tiếng nhất với loại cây trồng kinh tế chủ lực nào?',
    options: ['Cây hồ tiêu', 'Cây thạch đen (sương sáo)', 'Cây cà phê chè', 'Cây thanh long ruột đỏ'],
    correctIndex: 1,
    explanation:
      'Thạch đen Đông Khê là cây trồng chủ lực của Thạch An, mang lại thu nhập cao gấp nhiều lần so với canh tác lúa truyền thống.',
  },
  {
    id: 'q4',
    topic: 'Nông nghiệp tái sinh',
    question: 'Trong mô hình ruộng mẫu 1.000 m² của Agri-Next, biện pháp nào giúp chống rửa trôi đất trên sườn dốc Cao Bằng hiệu quả nhất?',
    options: [
      'Đốt sạch thực bì sau mỗi vụ thu hoạch',
      'Che phủ thực bì hữu cơ & trồng cây theo đường đồng mức',
      'Cày xới thật sâu theo chiều dốc đứng từ trên xuống',
      'Phun thuốc diệt cỏ toàn bộ sườn đồi',
    ],
    correctIndex: 1,
    explanation:
      'Che phủ thực bì và canh tác theo đường đồng mức giúp giữ nước, giảm xói mòn tầng đất mặt và nuôi dưỡng hệ vi sinh đất.',
  },
  {
    id: 'q5',
    topic: 'Thích ứng khí hậu Cao Bằng',
    question: 'Hai thách thức lớn nhất mà sáng kiến Agri-Next Vietnam tập trung giải quyết tại Cao Bằng là gì?',
    options: [
      'Thiếu đất đô thị và ô nhiễm tiếng ồn',
      'Suy thoái đất do biến đổi khí hậu và tình trạng di cư của thanh niên',
      'Xâm nhập mặn ven biển và thiếu điện lưới',
      'Dư thừa lao động công nghiệp nặng',
    ],
    correctIndex: 1,
    explanation:
      'Agri-Next Vietnam trao quyền cho thanh niên địa phương ứng dụng nông nghiệp tái sinh để phục hồi đất đai và kiến tạo sinh kế ngay tại quê nhà.',
  },
  {
    id: 'q6',
    topic: 'Nông nghiệp tái sinh',
    question: 'Việc tận dụng bã củ dong riềng và phụ phẩm nông nghiệp để ủ phân compost mang lại lợi ích kép nào?',
    options: [
      'Giảm rác thải ô nhiễm nguồn nước & bổ sung mùn hữu cơ cải tạo đất',
      'Làm tăng độ chua của đất để diệt giun đất',
      'Chỉ giúp giảm mùi mà không có dinh dưỡng cho cây',
      'Thay thế hoàn toàn ánh sáng mặt trời cho cây trồng',
    ],
    correctIndex: 0,
    explanation:
      'Kinh tế tuần hoàn biến phụ phẩm thành phân hữu cơ giàu dinh dưỡng, giảm chi phí đầu vào và bảo vệ nguồn nước suối vùng cao.',
  },
  {
    id: 'q7',
    topic: 'Khởi nghiệp xanh & OCOP',
    question: 'Chiến dịch truyền thông số của Agri-Next Vietnam đồng hành cùng tinh thần Youth 4 Climate mang thông điệp gì?',
    options: [
      'Fast Farm, Fast Profit',
      'Young Roots, Green Futures (Mầm rễ Trẻ, Tương lai Xanh)',
      'Urban First, Rural Later',
      'Only Export, No Local',
    ],
    correctIndex: 1,
    explanation:
      '"Young Roots, Green Futures" tôn vinh vai trò tiên phong của thế hệ trẻ kết hợp tri thức bản địa và kỹ thuật hiện đại vì tương lai xanh.',
  },
  {
    id: 'q8',
    topic: 'Khởi nghiệp xanh & OCOP',
    question: 'Giải pháp nào giúp đặc sản vùng cao như lê Bảo Lạc hay hạt dẻ Trùng Khánh gia tăng giá trị bền vững nhất khi tiếp cận khách hàng trẻ?',
    options: [
      'Bán nguyên liệu thô không nhãn mác để giảm tối đa chi phí',
      'Chuẩn hóa OCOP, minh bạch truy xuất nguồn gốc và kể câu chuyện canh tác xanh',
      'Giảm giá thấp hơn sản phẩm công nghiệp bằng mọi cách',
      'Chỉ bán duy nhất tại chợ phiên trong xã',
    ],
    correctIndex: 1,
    explanation:
      'Người tiêu dùng hiện đại đánh giá cao sự minh bạch, chất lượng chuẩn hóa và tác động tích cực tới môi trường và cộng đồng bản địa.',
  },
];

/* =========================================================================
   GAME 3: "GIỎ QUÀ XANH & GÓC NHÌN THỊ TRƯỜNG" (Market Insight Discovery)
   ========================================================================= */

export interface MarketProductItem {
  id: string;
  name: string;
  origin: string;
  priceVnd: number;
  ecoImpact: string;
  category: string;
  description: string;
}

export const MARKET_PRODUCTS: MarketProductItem[] = [
  {
    id: 'prod-hat-de',
    name: 'Hạt dẻ Trùng Khánh rang củi (500g)',
    origin: 'Trùng Khánh · OCOP',
    priceVnd: 145000,
    ecoImpact: 'Trồng phủ thực bì, có mã QR truy xuất từng hộ nông dân',
    category: 'Đặc sản hạt',
    description: 'Hạt tuyển chọn vụ thu, bùi ngọt tự nhiên, đóng túi giấy kraft tái chế.',
  },
  {
    id: 'prod-tra-thach-den',
    name: 'Trà lá Thạch đen Đông Khê hữu cơ',
    origin: 'Thạch An · Đông Khê',
    priceVnd: 110000,
    ecoImpact: 'Canh tác luân canh họ đậu không thuốc trừ sâu hóa học',
    category: 'Thức uống thảo mộc',
    description: 'Lá thạch đen sấy lạnh giữ trọn vị thanh mát, tiện pha chế tại nhà.',
  },
  {
    id: 'prod-mien-dong',
    name: 'Miến dong Phia Đén nguyên chất (500g)',
    origin: 'Nguyên Bình · Phia Đén',
    priceVnd: 95000,
    ecoImpact: 'Bã dong riềng ủ phân tuần hoàn, chống xói mòn đất dốc',
    category: 'Thực phẩm khô',
    description: '100% tinh bột củ dong riềng vùng cao, không chất tẩy, sợi dai ngon.',
  },
  {
    id: 'prod-le-duoc-lieu',
    name: 'Trà thảo dược & Lê sấy dẻo Bảo Lạc',
    origin: 'Bảo Lạc · Dưới tán rừng',
    priceVnd: 135000,
    ecoImpact: 'Nông lâm kết hợp bảo vệ đa dạng sinh học rừng đầu nguồn',
    category: 'Dược liệu & Quả khô',
    description: 'Vị ngọt thanh lê vùng cao kết hợp thảo mộc bản địa đồng bào Tày - Dao.',
  },
  {
    id: 'prod-mat-ong-rung',
    name: 'Mật ong hoa rừng Non Nước (250ml)',
    origin: 'Vườn Quốc gia Phia Oắc',
    priceVnd: 165000,
    ecoImpact: 'Nuôi ong tự nhiên hỗ trợ thụ phấn cho hệ cây bản địa',
    category: 'Đặc sản tự nhiên',
    description: 'Mật ong nguyên chất thu hoạch bền vững, giàu hương hoa rừng núi đá.',
  },
  {
    id: 'prod-bootcamp-pass',
    name: 'Voucher Trải nghiệm Ruộng mẫu 1.000 m²',
    origin: 'Agri-Next Cao Bằng',
    priceVnd: 150000,
    ecoImpact: '100% doanh thu hỗ trợ quỹ học bổng thanh niên khởi nghiệp xanh',
    category: 'Du lịch nông nghiệp',
    description: '1 ngày hóa thân thành nông dân tái sinh cùng các bạn trẻ Cao Bằng.',
  },
];

export const BUYING_FACTORS = [
  'Nguồn gốc minh bạch (QR / Chỉ dẫn địa lý)',
  'Canh tác hữu cơ, bảo vệ đất & khí hậu',
  'Hương vị đặc sản bản địa độc đáo',
  'Ủng hộ sinh kế thanh niên & đồng bào vùng cao',
  'Giá cả hợp lý & dễ đặt mua online',
  'Bao bì xanh, đẹp để làm quà tặng',
];

export const PREFERRED_CHANNELS = [
  'TikTok / Video ngắn kể chuyện nông dân',
  'Facebook / Instagram cộng đồng xanh',
  'Sàn TMĐT (Shopee / Lazada Mall OCOP)',
  'Website chính thức của Agri-Next',
  'Hội chợ nông sản & Du lịch trải nghiệm tại Cao Bằng',
];

export const WTP_TIERS = [
  { value: 0, label: 'Giữ nguyên giá thị trường (0%)', desc: 'Ưu tiên giá tương đương hàng phổ thông' },
  { value: 10, label: 'Sẵn sàng trả thêm +10%', desc: 'Khi có thông tin nguồn gốc rõ ràng' },
  { value: 20, label: 'Sẵn sàng trả thêm +20%', desc: 'Khi chứng minh được tác động tái sinh xanh' },
  { value: 30, label: 'Sẵn sàng trả thêm +30% trở lên', desc: 'Ủng hộ mạnh mẽ sản phẩm bền vững & cộng đồng trẻ' },
];

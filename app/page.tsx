"use client";

import { useMemo, useState } from "react";

const TOC = [
  ["H01", "Tóc thẳng ngôi giữa", "Tối giản"], ["H02", "Sóng Hàn mái rèm", "Nàng thơ"],
  ["H03", "Tóc đuôi ngựa thấp", "Thanh lịch"], ["H04", "Tóc đuôi ngựa cao", "Năng động"],
  ["H05", "Nửa buộc nửa xõa", "Đa dụng"], ["H06", "Búi thấp", "Sang trọng"],
] as const;

const LOAI_SAN_PHAM = ["Thời trang / quần áo", "Mỹ phẩm / chăm sóc da", "Túi / phụ kiện", "Giày dép", "Đồ gia dụng / phong cách sống", "Thể thao"];

const KHONG_GIAN = {
  "Tự chọn tại Đà Nẵng": "Tự chọn một bối cảnh Đà Nẵng chân thực, phù hợp nhất với sản phẩm và phong cách; có chất địa phương nhưng không biến thành ảnh check-in du lịch.",
  "Café ven biển": "Café mở gần biển Đà Nẵng, đá sáng màu, gỗ nhạt, ghế vải linen, gió biển và ánh sáng đại dương; tiểu cảnh nhiệt đới và gốm sứ tinh tế.",
  "Café sân vườn": "Café sân vườn Đà Nẵng nhiều lớp cây nhiệt đới, nắng xuyên tán, tường vữa có chất liệu, lối đi đá và tiểu cảnh được chăm chút.",
  "Đồi Sơn Trà": "Điểm nhìn trên sườn Sơn Trà với lớp cây xanh, biển xanh xa, chiều sâu khí quyển, gió tự nhiên và ánh sáng giờ vàng.",
  "Biển Mỹ Khê buổi sớm": "Bãi Mỹ Khê trong nắng sớm dịu, cát sạch, nước xanh nhạt, trời thoáng, ít người; cảm giác editorial ven biển thay vì ảnh du lịch.",
  "Sông Hàn chiều tối": "Không khí ven sông Hàn vào blue hour, bokeh thành phố và phản chiếu nhẹ, hiện đại sang trọng, không có biển hiệu giả dễ đọc.",
  "Hẻm miền Trung": "Hẻm hoặc sân trong yên tĩnh với tường vàng ấm, gỗ cũ, hoa giấy và chi tiết thủ công; thơ mộng nhưng không sân khấu hóa.",
} as const;

const NHAN_VAT = {
  "Nàng thơ": "Mơ màng, nhẹ nhàng, hướng nội, chuyển động mềm, biểu cảm tự nhiên, khoảnh khắc điện ảnh không gượng ép.",
  "Tổng tài": "Điềm tĩnh, quyền lực, cao cấp; dáng dứt khoát, biểu cảm tiết chế, kiến trúc hiện đại và tinh thần quiet luxury.",
  "Tiểu thư": "Nữ tính tinh tế, chỉn chu, duyên dáng và hơi tinh nghịch; café hoặc sân vườn cao cấp.",
  "Cô gái phố biển": "Tươi mới, thư giãn, nhiều nắng; gió tự nhiên, chuyển động đời thường và phong cách sống Đà Nẵng hiện đại.",
  "Editorial tối giản": "Tạo dáng điêu khắc, đường nét sạch, nhiều khoảng thở và cảm giác tạp chí thời trang cao cấp.",
} as const;

const BO_CUC = {
  "Quy tắc 1/3": "Đặt người mẫu trên một đường 1/3, hướng nhìn hoặc chuyển động vào khoảng trống; sản phẩm nằm gần một điểm giao.",
  "Tỷ lệ vàng": "Dẫn mắt theo đường xoắn ốc tỷ lệ vàng từ không gian đến gương mặt rồi kết thúc tại sản phẩm.",
  "Đường dẫn": "Dùng kiến trúc, quầy café, lối đi, bờ biển hoặc lan can làm đường dẫn mắt đến người mẫu và sản phẩm.",
  "Khung trong khung": "Dùng cửa, cửa sổ, vòm, cây lá hoặc tiểu cảnh để tạo khung tự nhiên, không che sản phẩm.",
  "Khoảng trống": "Bố cục bất đối xứng, nhiều negative space, silhouette rõ và sản phẩm dễ đọc.",
  "Chiều sâu nhiều lớp": "Tiền cảnh mờ nhẹ, chủ thể sắc nét, hậu cảnh có chiều sâu khí quyển để tạo cảm giác điện ảnh.",
} as const;

const DANG = {
  "Tự chọn theo vibe": "Tự chọn dáng tự nhiên và hiệu quả thương mại; phải nhìn rõ sản phẩm và không che chi tiết quan trọng.",
  "Bước đi tự nhiên": "Khoảnh khắc đang bước, vai thả lỏng, tay chuyển động tự nhiên, tóc và vải có độ bay vừa phải.",
  "Editorial tự tin": "Dáng contrapposto cân bằng, một chân hơi đưa trước, tư thế cao, một tay tương tác tự nhiên với sản phẩm.",
  "Mềm mại duyên dáng": "Góc người ba phần tư, cổ tay thả lỏng, đầu hơi nghiêng, đường cong cơ thể thanh lịch nhưng không cường điệu.",
  "Cận cảnh sản phẩm": "Khung ba phần tư, sản phẩm gần máy ảnh hơn, gương mặt vẫn thấy rõ, chất liệu và cấu tạo là trọng tâm.",
  "Hành động đời thường": "Một hành động hợp sản phẩm như chỉnh quai, vuốt vải, cầm cốc hoặc sử dụng sản phẩm; cảm giác bắt gặp giữa khoảnh khắc.",
} as const;

const ANH_MAT = {
  "Nhìn lệch tự nhiên": "Không nhìn vào máy ảnh; nhìn nhẹ về phía không gian, như được chụp trong khoảnh khắc không sắp đặt.",
  "Nhìn sản phẩm": "Nhìn tự nhiên vào sản phẩm hoặc bàn tay đang tương tác, biểu cảm hài lòng nhẹ, không giống tư thế bán hàng.",
  "Nghiêng mặt nhìn xa": "Gương mặt ba phần tư hoặc profile sạch, nhìn xa; vẫn bảo toàn nhận diện khuôn mặt.",
  "Hạ mắt nhẹ": "Ánh mắt hạ nhẹ, mí thư giãn, hướng nội nhưng không buồn hoặc buồn ngủ.",
  "Mải mê hành động": "Tập trung vào việc bước đi, chỉnh tóc, chạm ly hoặc dùng sản phẩm; hoàn toàn không chú ý máy ảnh.",
} as const;

const TRANG_DIEM = {
  "Trong veo Hàn Quốc": "Nền da căng nhẹ tự nhiên, má hồng trong, mi tơi, môi hồng đào bóng vừa; không làm thay đổi đường nét gương mặt.",
  "Trang điểm nàng thơ": "Nền mỏng, má hồng lan nhẹ, mắt nâu hồng mềm, môi rose-beige; cảm giác dịu và mơ màng.",
  "Clean girl": "Da sạch bán lì, chân mày gọn tự nhiên, eyeliner cực mảnh, môi nude hồng; tối giản và hiện đại.",
  "Tổng tài sắc nét": "Nền satin, contour rất nhẹ, mắt nâu trung tính có độ sâu, môi đỏ nâu hoặc nude lạnh; quyền lực nhưng không già.",
  "Nắng biển": "Da glow khỏe, tàn nhang cực nhẹ nếu hợp, má coral, môi tint trong; tươi và chịu được ánh sáng ngoài trời.",
  "Gần như không trang điểm": "Giữ texture da thật, chỉ cân bằng sắc da, môi dưỡng và mi tự nhiên; không filter, không da nhựa.",
} as const;

const PHU_KIEN = {
  "Tối giản tự động": "Chỉ thêm phụ kiện tối thiểu phù hợp với sản phẩm; không cạnh tranh, che khuất hoặc tạo thêm sản phẩm tương tự.",
  "Ngọc trai tinh tế": "Khuyên tai ngọc trai nhỏ hoặc vòng cổ mảnh; thanh lịch, nữ tính, không quá dạ hội.",
  "Kim loại tối giản": "Khuyên tai hoặc vòng tay kim loại mảnh màu vàng nhạt/bạc tùy bảng màu sản phẩm.",
  "Kính thời trang": "Kính râm hoặc kính gọng mảnh được cầm hoặc đeo tự nhiên; không che toàn bộ gương mặt nếu cần nhận diện.",
  "Khăn lụa": "Khăn lụa nhỏ phối ở cổ, tóc hoặc quai túi nếu hợp; màu bổ trợ sản phẩm, không có logo giả.",
  "Không phụ kiện": "Không thêm trang sức, kính, mũ, khăn hoặc đạo cụ thời trang ngoài sản phẩm chính.",
} as const;

const ANH_SANG = {
  "Tự chọn theo bối cảnh": "Tự chọn thời điểm và ánh sáng tự nhiên nhất cho không gian, sản phẩm và nhân vật.",
  "Nắng sớm dịu": "Ánh sáng sớm mềm, trong và hơi ấm, bóng đổ dài nhẹ, da tự nhiên.",
  "Nắng xuyên tán": "Ánh sáng loang qua cây hoặc rèm, tạo lớp sáng tối tinh tế nhưng không đổ họa tiết khó chịu lên sản phẩm.",
  "Giờ vàng": "Nắng vàng thấp, viền tóc nhẹ, chiều sâu ấm và lãng mạn; giữ đúng màu sản phẩm.",
  "Blue hour": "Ánh sáng xanh tím sau hoàng hôn kết hợp đèn thực tế ấm, sang và điện ảnh.",
  "Ánh sáng café cửa sổ": "Nguồn sáng cửa sổ lớn mềm từ một bên, nền café có chiều sâu và da không bị phẳng.",
} as const;

const XOA_PHONG = {
  "Bokeh tự nhiên": "Use realistic optical background blur from a wide-aperture portrait lens, with smooth bokeh, gradual depth falloff and sharp product edges; never use artificial cutout blur.",
  "Mờ tiền cảnh điện ảnh": "Add a subtle out-of-focus foreground layer such as foliage, a café edge or reflected light, while the model and product remain precisely focused.",
  "Hậu cảnh vừa đủ rõ": "Use moderate depth of field: the setting remains recognizable but softened enough to separate the silhouette and product naturally.",
  "Nét sâu tự nhiên": "Use deeper natural focus for landscape or architectural context, while preserving tonal separation around the model.",
} as const;

const DO_DOI_THUONG = {
  "Nhẹ · Tinh tế": "Add a few believable background details: one or two casually dressed people, a parked scooter, used café tables, slightly uneven plants and subtle surface wear. Keep them secondary and softly out of focus.",
  "Vừa · Tự nhiên": "Make the location feel actively lived-in: several background patrons or pedestrians, occasional scooters or traffic, imperfect table placement, half-used cups, small reflections, signage shapes without readable text, and mild motion blur. Avoid symmetry and staged spacing.",
  "Nhiều · Đường phố": "Use authentic Da Nang street or café activity with layered pedestrians, scooters, passing traffic, mixed practical lights, casual clutter and motion blur; maintain a clean visual pocket around the model and product.",
  "Yên tĩnh · Có dấu vết": "No prominent crowd, but show human presence through pushed-back chairs, a jacket on a seat, used cups, footprints, parked bikes, imperfect foliage and weathered surfaces.",
} as const;

const MOC_THI_GIAC = {
  "Chuyển động bất ngờ": "catch a visually immediate transition—mid-turn, first step, wind catching the garment or a spontaneous hand gesture—while keeping the product readable",
  "Khoảnh khắc cảm xúc": "lead with a genuine micro-expression or spontaneous laugh that feels observed rather than performed",
  "Tương phản cảnh & sản phẩm": "create a strong but natural tonal or color separation between the product and its surroundings without artificial spotlighting",
  "Góc nhìn đời thường": "use an intimate observer viewpoint as if a friend noticed the moment, with believable foreground depth and imperfect framing",
  "Chi tiết gây tò mò": "introduce one plausible foreground or environmental detail that creates curiosity without obscuring the product or becoming clickbait",
  "Tự chọn theo sản phẩm": "choose one clear scroll-stopping visual idea appropriate to the product, setting and character; keep it authentic and achievable by a real camera",
} as const;

const MAY_ANH_CHAT_PHIM = {
  "Điện thoại đời thường": "a candid modern smartphone photograph with restrained computational processing, natural local contrast, slight edge softness and believable auto-exposure",
  "Canon AE-1 · Superia 400": "a Canon AE-1 35mm snapshot on Fujifilm Superia 400, with modest organic grain, gentle green-cyan shadows, warm skin and slightly imperfect exposure",
  "Contax T2 · Portra 400": "a Contax T2 snapshot on Kodak Portra 400, with soft highlight roll-off, fine grain, muted saturation and natural warm skin tones",
  "Olympus Mju-II · Gold 200": "an Olympus Mju-II point-and-shoot photograph on Kodak Gold 200, with direct everyday color, mild corner softness and casual focus behavior",
  "Fujifilm X100 · Classic Chrome": "a Fujifilm X100-series documentary-style frame with a restrained Classic Chrome palette, gentle digital grain and subtle highlight compression",
  "Máy ảnh số tự nhiên": "a believable full-frame digital photograph using a normal 50mm-equivalent lens, moderate dynamic range, restrained sharpening and no beauty retouching",
} as const;

const ANH_TIEP_THEO = {
  "Ảnh 2 · Khoảnh khắc khác": "Create a clearly different candid moment from the first image, not a minor pose adjustment.",
  "Ảnh 3 · Đổi góc máy": "Move the camera to a distinctly different side, height and distance while keeping continuity.",
  "Ảnh 4 · Chi tiết tự nhiên": "Capture an intimate spontaneous detail or interaction rather than a formal product close-up.",
  "Ảnh 5 · Chuyển động mạnh": "Create the most dynamic candid frame in the sequence with believable body, hair, fabric and environmental movement.",
} as const;

const CAM_XUC_TIEP = {
  "Cười lớn che miệng": "laugh openly in a spontaneous unguarded way, with one hand loosely covering part of the smile; eyes naturally crinkle",
  "Cười mỉm nhìn xa": "give a small warm closed-mouth smile while looking away, as if noticing something pleasant",
  "Bật cười quay đầu": "be caught mid-laugh while turning the head away from camera",
  "Tò mò khám phá": "show quiet curiosity while observing or touching something in the environment",
  "Thư giãn tận hưởng": "look peaceful and fully absorbed in the breeze, light or surroundings",
  "Tinh nghịch": "show a subtle playful expression and an impulsive candid gesture without looking staged",
  "Tự chọn khác ảnh trước": "choose a believable emotion that strongly contrasts with the previous frame",
} as const;

const HUONG_DANG_TIEP = {
  "Quay lưng khoe thiết kế sau": "show the model mostly from behind to reveal the back of the outfit, with the face only in a natural partial profile if appropriate",
  "Nghiêng 3/4 quay đi": "use a rear three-quarter body angle, weight shifting naturally as she turns away",
  "Đi ngang khung hình": "walk naturally across the frame in side profile rather than toward the camera",
  "Ngồi hoặc tựa tự nhiên": "sit, lean or rest naturally on an available environmental surface with relaxed asymmetry",
  "Xoay người giữa chuyển động": "capture the torso and hips at different stages of a natural turn, with realistic fabric response",
  "Tương tác với không gian": "interact naturally with the café, beach, railing, chair, foliage or nearby object instead of presenting to camera",
  "Tự chọn khác ảnh trước": "select a new body direction, silhouette and action that are visibly different from the previous frame",
} as const;

const CHUYEN_DONG_TIEP = {
  "Gió nhẹ": "add a light irregular breeze moving a few hair strands and the edge of the garment",
  "Gió biển rõ": "use a stronger coastal cross-breeze with directional hair and fabric movement, keeping the face and product readable",
  "Đang bước": "show believable mid-step momentum, natural arm counter-swing and slight background motion blur",
  "Chạm tóc tự nhiên": "catch a casual hair-adjusting gesture caused by wind, without covering the face or product",
  "Tĩnh nhưng có nhịp": "keep the body mostly still while small environmental movement—hair tips, leaves, curtains, people or traffic—adds life",
  "Tự chọn theo cảnh": "choose a subtle physical and environmental movement appropriate to the location",
} as const;

const DOI_CANH_TIEP = {
  "Đổi nhẹ cùng địa điểm": "shift a few meters within the same location, revealing a different nearby wall, table, path, shoreline angle or cluster of people",
  "Đổi hướng nhìn ra cảnh": "turn the camera toward a different view within the same location—for example from café interior toward street or sea",
  "Sát biển / quay ra biển": "move closer to the water or rotate toward the sea, showing wind, shoreline depth and natural beach activity",
  "Góc sau quán / ven đường": "use a less polished side area of the same venue with service details, parked scooters, passing people or textured surfaces",
  "Giữ nền, đổi hoạt động": "keep the recognizable background but let people, traffic, chairs, cups, shadows and movement progress naturally",
} as const;

const GOC_MAY_TIEP = {
  "Quay vòng 45–90°": "orbit the camera 45–90 degrees around the model from the previous viewpoint, and also change either camera height or distance",
  "Góc sau 3/4 thấp": "move behind the model to a low rear three-quarter viewpoint, clearly revealing the back silhouette and environmental depth",
  "Ngang hông chính diện cạnh": "use a true side-profile viewpoint at approximately hip-to-chest camera height; do not show the same front three-quarter face angle",
  "Góc cao rộng": "move noticeably higher and farther away for a wide downward environmental view with a smaller full-body figure",
  "Góc thấp gần": "move lower and closer with a mild upward perspective; keep anatomy natural and avoid exaggerated wide-angle distortion",
  "Qua vai / từ phía sau": "shoot over the model's shoulder or from directly behind, letting the scene ahead become part of the story",
  "Cận lệch bên": "move close to one side for an asymmetric detail frame; crop differently and avoid the previous camera axis",
  "Tự chọn khác biệt mạnh": "inspect the immediately previous image and choose a camera side, height, distance and lens perspective that are unmistakably different",
} as const;

const EN: Record<string,string> = {
  "Thời trang / quần áo":"fashion or clothing", "Mỹ phẩm / chăm sóc da":"beauty or skincare", "Túi / phụ kiện":"bag or accessory", "Giày dép":"footwear", "Đồ gia dụng / phong cách sống":"home or lifestyle product", "Thể thao":"fitness product",
  "Tự chọn tại Đà Nẵng":"an authentic Da Nang setting selected to suit the product, not a tourist postcard", "Café ven biển":"a refined open-air coastal café in Da Nang with pale stone, light wood, linen seating, sea breeze and tasteful tropical vignettes", "Café sân vườn":"a photogenic Da Nang garden café with layered tropical foliage, dappled daylight, textured plaster, stone paths and curated miniature landscaping", "Đồi Sơn Trà":"a Son Tra hillside overlook with layered greenery, distant blue sea, atmospheric depth and natural breeze", "Biển Mỹ Khê buổi sớm":"My Khe beach in soft early-morning light with clean sand, pale blue water, airy sky and minimal people", "Sông Hàn chiều tối":"the Han River waterfront at blue hour with subtle city bokeh and reflections", "Hẻm miền Trung":"a quiet Central Vietnamese lane or courtyard with warm ochre walls, weathered wood, bougainvillea and handcrafted details",
  "Nàng thơ":"poetic muse—dreamy, gentle, introspective and effortlessly cinematic", "Tổng tài":"modern executive—composed, powerful, premium and quiet-luxury", "Tiểu thư":"refined young-lady elegance—polished, graceful and subtly playful", "Cô gái phố biển":"fresh coastal-city woman—relaxed, sunlit, approachable and contemporary", "Editorial tối giản":"minimal fashion editorial—sculptural, restrained and premium",
  "Tự chọn theo vibe":"a natural commercially effective pose selected to match the concept", "Bước đi tự nhiên":"a candid mid-step walk with relaxed shoulders and believable hair and fabric movement", "Editorial tự tin":"a confident balanced contrapposto pose with one leg slightly forward", "Mềm mại duyên dáng":"a graceful three-quarter angle with relaxed wrists and a subtle head tilt", "Cận cảnh sản phẩm":"a three-quarter product-priority pose with the face still visible", "Hành động đời thường":"a believable everyday action appropriate to the product",
  "Nhìn lệch tự nhiên":"look naturally away from the camera into the environment", "Nhìn sản phẩm":"look naturally at the product or the hand interacting with it", "Nghiêng mặt nhìn xa":"use a recognizable three-quarter or side profile looking into the distance", "Hạ mắt nhẹ":"use a gentle lowered gaze with a calm introspective expression", "Mải mê hành động":"focus fully on a natural action with no awareness of the camera",
  "Quy tắc 1/3":"rule of thirds, placing the model on a vertical third and the product near an intersection", "Tỷ lệ vàng":"golden-ratio visual flow leading from environment to face and then product", "Đường dẫn":"leading lines from architecture, paths, shoreline or café elements toward the model", "Khung trong khung":"frame-within-a-frame using a doorway, foliage, arch or curated vignette", "Khoảng trống":"asymmetric editorial negative space with a strong readable silhouette", "Chiều sâu nhiều lớp":"layered depth with a soft foreground, sharp subject plane and atmospheric background",
  "Trong veo Hàn Quốc":"sheer Korean makeup with luminous natural skin, soft blush, separated lashes and peach-pink lips", "Trang điểm nàng thơ":"poetic makeup with delicate rosy tones, soft brown-pink eyes and rose-beige lips", "Clean girl":"clean-girl makeup with natural brows, minimal liner and pink-nude lips", "Tổng tài sắc nét":"polished executive makeup with satin skin, subtle contour, neutral brown eyes and refined lips", "Nắng biển":"healthy coastal glow with coral blush and translucent lip tint", "Gần như không trang điểm":"near-bare makeup preserving real skin texture",
  "Tối giản tự động":"minimal accessories automatically selected to support rather than compete with the product", "Ngọc trai tinh tế":"small pearl earrings or a fine necklace", "Kim loại tối giản":"fine minimal gold or silver jewelry matched to the product palette", "Kính thời trang":"slim fashion eyewear used naturally without hiding identity", "Khăn lụa":"a small silk scarf styled at the neck, hair or bag in a complementary color", "Không phụ kiện":"no jewelry, eyewear, hat, scarf or extra fashion props",
  "Tự chọn theo bối cảnh":"lighting naturally selected for the scene and concept", "Nắng sớm dịu":"soft clear early-morning light with gentle warmth", "Nắng xuyên tán":"dappled light filtered through foliage or curtains", "Giờ vàng":"low golden-hour light with a subtle hair rim", "Blue hour":"blue-hour ambient light balanced with warm practical lights", "Ánh sáng café cửa sổ":"large soft side-window light with natural café depth",
  "Tóc thẳng ngôi giữa":"sleek long straight center-part hair", "Sóng Hàn mái rèm":"soft Korean waves with curtain bangs", "Tóc đuôi ngựa thấp":"elegant low ponytail", "Tóc đuôi ngựa cao":"polished high ponytail", "Nửa buộc nửa xõa":"half-up half-down hair", "Búi thấp":"neat low bun",
};

export default function Home() {
  const [toc, setToc] = useState("H02");
  const [loai, setLoai] = useState(LOAI_SAN_PHAM[0]);
  const [khongGian, setKhongGian] = useState<keyof typeof KHONG_GIAN>("Café sân vườn");
  const [nhanVat, setNhanVat] = useState<keyof typeof NHAN_VAT>("Nàng thơ");
  const [boCuc, setBoCuc] = useState<keyof typeof BO_CUC>("Quy tắc 1/3");
  const [dang, setDang] = useState<keyof typeof DANG>("Tự chọn theo vibe");
  const [anhMat, setAnhMat] = useState<keyof typeof ANH_MAT>("Nhìn lệch tự nhiên");
  const [trangDiem, setTrangDiem] = useState<keyof typeof TRANG_DIEM>("Trong veo Hàn Quốc");
  const [phuKien, setPhuKien] = useState<keyof typeof PHU_KIEN>("Tối giản tự động");
  const [anhSang, setAnhSang] = useState<keyof typeof ANH_SANG>("Ánh sáng café cửa sổ");
  const [xoaPhong, setXoaPhong] = useState<keyof typeof XOA_PHONG>("Bokeh tự nhiên");
  const [doiThuong, setDoiThuong] = useState<keyof typeof DO_DOI_THUONG>("Vừa · Tự nhiên");
  const [mocThiGiac, setMocThiGiac] = useState<keyof typeof MOC_THI_GIAC>("Chuyển động bất ngờ");
  const [mayAnh, setMayAnh] = useState<keyof typeof MAY_ANH_CHAT_PHIM>("Điện thoại đời thường");
  const [anhTiepTheo, setAnhTiepTheo] = useState<keyof typeof ANH_TIEP_THEO>("Ảnh 2 · Khoảnh khắc khác");
  const [camXucTiep, setCamXucTiep] = useState<keyof typeof CAM_XUC_TIEP>("Cười lớn che miệng");
  const [huongDangTiep, setHuongDangTiep] = useState<keyof typeof HUONG_DANG_TIEP>("Tự chọn khác ảnh trước");
  const [chuyenDongTiep, setChuyenDongTiep] = useState<keyof typeof CHUYEN_DONG_TIEP>("Gió nhẹ");
  const [doiCanhTiep, setDoiCanhTiep] = useState<keyof typeof DOI_CANH_TIEP>("Đổi nhẹ cùng địa điểm");
  const [gocMayTiep, setGocMayTiep] = useState<keyof typeof GOC_MAY_TIEP>("Quay vòng 45–90°");
  const [ghiChu, setGhiChu] = useState("");
  const [daChuanBi, setDaChuanBi] = useState(false);
  const [thongBao, setThongBao] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);
  const [daSaoChep, setDaSaoChep] = useState<"prompt"|"follow"|"caption"|null>(null);
  const tocDaChon = TOC.find((item) => item[0] === toc);

  const prompt = useMemo(() => `Use the two attached Model 01 images as strict identity references. I will attach the product image separately in ChatGPT; treat the last product image as the exact product reference.

Create the exact same adult woman from Model 01 wearing, holding or using the product. Preserve her facial geometry, apparent age 22–26, skin tone, eyes, nose, lips, neck, slender build and body proportions. Hairstyle ${toc}: ${EN[tocDaChon?.[1] ?? ""]}. Do not change her identity, ethnicity, age or body shape.

Product category: ${EN[loai]}. Preserve the product's exact color, material, construction, proportions, pattern and logo placement. Keep it clear and unobstructed by hands, hair or accessories.

Da Nang setting: ${EN[khongGian]}.
Character archetype: ${EN[nhanVat]}.
Pose: ${EN[dang]}.
Gaze: ${EN[anhMat]}; do not look into the camera.
Composition: ${EN[boCuc]}.
Makeup: ${EN[trangDiem]}; preserve facial identity and real skin texture.
Accessories: ${EN[phuKien]}.
Lighting: ${EN[anhSang]}.
Depth of field: ${XOA_PHONG[xoaPhong]}
Environmental realism: ${DO_DOI_THUONG[doiThuong]}
Viewer hook: ${MOC_THI_GIAC[mocThiGiac]}.
Capture treatment: ${MAY_ANH_CHAT_PHIM[mayAnh]}.

Unify the location, palette, lighting, hair movement, expression, accessories, camera angle and pose into one coherent campaign concept. Use complementary color or tonal contrast so the product separates clearly. Keep the background realistic, dimensional and secondary. The model should feel observed in an authentic moment, never posed directly at the viewer.

ANTI-PERFECTION REALISM: Do not create an empty, spotless, perfectly symmetrical or showroom-like environment. Include ordinary human traces and small visual irregularities appropriate to Da Nang: background people in varied casual poses, scooters or traffic where plausible, slightly crooked chairs, used tables, uneven foliage, minor pavement or wall wear, mixed color temperatures, small reflections and partial occlusions. Background people must look like distinct real individuals rather than duplicated extras. Keep their faces non-prominent and naturally blurred by distance, lens depth or motion. Do not let anyone stare at the camera or compete with the model. Preserve a clean separation zone immediately around the product.

HUMAN PHOTOGRAPHY REALISM: eliminate the common synthetic look. Skin must retain pores, fine facial hair, tiny tonal variation, faint under-eye and nasolabial texture, natural lip texture and realistic subsurface color—never plastic, waxy, airbrushed or uniformly smooth. Do not sharpen every eyelash or hair strand equally. Preserve small natural asymmetries in brows, smile, shoulders, wrists, stance and fabric tension without changing identity or creating defects.

Lighting must be physically plausible but not studio-perfect: allow gentle falloff across the face and body, mixed ambient color, mild bounce from nearby surfaces, slightly uneven shadow density and occasional soft highlight clipping. Never use a uniform beauty glow, identical rim light around the whole silhouette, perfectly balanced bilateral lighting or a fake spotlight isolated from the environment.

Composition must feel found, not mathematically arranged. Avoid centered symmetry, equal spacing, mirrored background objects, perfectly parallel limbs, repeated people or a spotless set. Permit off-center cropping, unequal negative space, partial foreground occlusion and natural visual weight. Keep the product legible through focus, timing and contrast—not by making the environment unnaturally empty.

Render camera characteristics as consequences of the selected capture process, not as an overlay or preset. Grain must vary naturally with tone; motion blur must follow actual movement; lens flare may appear only when a bright source plausibly enters the lens; focus softness must follow depth and subject movement. Allow a small focus miss away from the eyes only when the selected candid action justifies it. Permit slight overexposure near bright sky, water or windows while preserving product color and construction.

Allow subtle photographic imperfections: gentle sensor or film grain, slightly imperfect focus transition, natural highlight roll-off, tiny exposure variation, restrained chromatic softness near frame edges and realistic motion blur only on moving elements. Do not add fake film damage, uniform noise, decorative light leaks, warped vehicles, duplicate pedestrians or illegible text as a focal point. ${ghiChu ? `Additional direction: ${ghiChu}.` : "Prioritize a lively, tasteful and believable moment over a rigid catalog pose."}

Generate IMAGE 1 OF 5: the campaign hero image. Create one photorealistic vertical 9:16 commercial lifestyle photograph for TikTok Affiliate. The first frame must communicate one clear visual hook within a second, while remaining candid rather than sensational. Use an eye-level or slightly low camera angle. Natural anatomy and hands. Preserve real skin texture. No text, watermark, interface elements, competing products or fake logos.`, [anhMat, anhSang, boCuc, dang, doiThuong, ghiChu, khongGian, loai, mayAnh, mocThiGiac, nhanVat, phuKien, toc, tocDaChon, trangDiem, xoaPhong]);

  const followUpPrompt = useMemo(() => `Continue the same five-image campaign using the already established Model 01 identity, exact product and overall Da Nang lifestyle concept. Preserve the overall time of day while allowing natural variation in light direction, shadows, cloud cover, exposure and atmosphere.

CAPTURE TREATMENT: ${MAY_ANH_CHAT_PHIM[mayAnh]}. Maintain this camera/film family across the series, but allow frame-to-frame exposure, focus and grain variation that a real photographer would produce.

SHOT INTENT: ${ANH_TIEP_THEO[anhTiepTheo]}
FACIAL EMOTION: ${CAM_XUC_TIEP[camXucTiep]}.
BODY DIRECTION AND ACTION: ${HUONG_DANG_TIEP[huongDangTiep]}.
MOVEMENT: ${CHUYEN_DONG_TIEP[chuyenDongTiep]}.
BACKGROUND EVOLUTION: ${DOI_CANH_TIEP[doiCanhTiep]}.
MANDATORY CAMERA MOVE: ${GOC_MAY_TIEP[gocMayTiep]}.

Keep the exact same woman and product. Do not redesign the outfit or product. Maintain the same overall time of day and coherent styling, while allowing a different light direction, weather nuance or nearby part of the location. It should feel like another moment from the same outing, not the exact same frozen minute. Let pedestrians, café patrons, traffic, waves, chairs, cups, foliage, shadows and small props change naturally.

CAMERA DIVERSITY IS MANDATORY: first inspect the immediately previous generated image and identify its camera side, height, distance, subject scale and visible planes of the body. The new image must change at least three of those five attributes. Make the spatial move obvious enough that the two frames could not be mistaken for photographs taken from the same tripod position. A different pose alone does not count. Do not fall back to the common eye-level front three-quarter portrait. Do not mirror the old image or merely crop it tighter.

Do NOT reuse the previous pose, gaze, facial expression, body direction, hand placement, framing or exact background arrangement. This is a candid lifestyle sequence, not a set of formally composed hero images. Do not force rule of thirds, golden ratio, perfect symmetry or a polished catalog pose. Slightly imperfect framing, partial foreground occlusion, a tilted horizon within realistic limits, off-center cropping and spontaneous gestures are welcome when they make the moment feel human. Preserve product visibility appropriate to this shot; a back-facing beach view may prioritize showing the back construction of the garment.

Keep the same human-photography realism established in image 1: visible skin microtexture and tiny tonal variation, naturally unequal fabric folds and posture, physically consistent but slightly uneven ambient light, non-uniform focus, imperfect environmental spacing and asymmetrical visual weight. Never produce plastic skin, a universal beauty glow, identical rim lighting, mirrored objects, mathematically balanced framing or an unnaturally empty background. Give this frame its own immediate story beat rather than making a prettier duplicate.

Preserve realistic optical background blur, subtle environmental motion blur, accurate anatomy, natural hands and real skin texture. Vertical 9:16. No text, watermark, interface elements, competing products or fake logos.`, [anhTiepTheo, camXucTiep, chuyenDongTiep, doiCanhTiep, gocMayTiep, huongDangTiep, mayAnh]);

  const captionPrompt = useMemo(() => `Based on the images and product already shared in this conversation, suggest 8 Vietnamese TikTok Affiliate captions for this post.

Context:
- Product category: ${loai}
- Visual concept: ${nhanVat}
- Location/vibe: ${khongGian}, Đà Nẵng
- The video is a short AutoCut lifestyle sequence using multiple candid images.

Requirements:
- Write natural contemporary Vietnamese suitable for a personal TikTok account, not a brand advertisement.
- Make every option meaningfully different: relatable observation, playful reaction, mini story, aesthetic mood, curiosity hook, soft recommendation, short punchy line, and conversational question.
- Keep each caption concise: ideally 1–2 short sentences before hashtags.
- Use a soft, believable call-to-action such as checking the product link or giỏ hàng; do not sound pushy.
- Do not invent price, discount, material, sizing, performance, medical or beauty claims that are not visible or confirmed.
- Avoid exaggerated phrases such as “must buy,” “best ever,” guaranteed results, or fake urgency.
- Include 3–5 relevant Vietnamese hashtags per option. Avoid stuffing generic viral hashtags.
- Mention Đà Nẵng only when it fits naturally; do not make every caption location-based.
- Emojis are optional and limited to 0–2 per caption.
- Output Vietnamese only, numbered 1–8, ready to copy. Do not explain your choices.`, [khongGian, loai, nhanVat]);

  async function layTep(path: string, name: string) { const blob = await (await fetch(path)).blob(); return new File([blob], name, { type: blob.type || "image/png" }); }
  async function saoChep(text: string) { try { await navigator.clipboard.writeText(text); return true; } catch { const x=document.createElement("textarea"); x.value=text; x.readOnly=true; x.style.position="fixed"; x.style.opacity="0"; document.body.appendChild(x); x.select(); const ok=document.execCommand("copy"); x.remove(); return ok; } }
  function taiTep(file: File) { const a=document.createElement("a"); a.href=URL.createObjectURL(file); a.download=file.name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),2000); }

  async function chiaSe() {
    setDangXuLy(true); setThongBao("Đang chuẩn bị concept và ảnh tham chiếu…");
    try {
      const copied=await saoChep(prompt);
      const files=[await layTep("/model-01/turnaround.png","model-01-goc-nhin.png"),await layTep("/model-01/hairstyles.png","model-01-kieu-toc.png")];
      setDaChuanBi(true);
      if(navigator.share&&navigator.canShare?.({files})){
        try{setThongBao(`${copied?"Đã sao chép prompt. ":"Prompt ở bên dưới. "}Hãy chọn ChatGPT, sau đó thêm ảnh sản phẩm.`);await navigator.share({files,title:"Tham chiếu Model 01"});}
        catch(e){if(e instanceof DOMException&&e.name==="AbortError"){setThongBao("Đã hủy chia sẻ. Bạn có thể dùng các nút dự phòng bên dưới.");}else{files.forEach(taiTep);setThongBao("Trình duyệt chặn chia sẻ. Hai ảnh tham chiếu đã được tải xuống; hãy đính kèm chúng và ảnh sản phẩm trong ChatGPT.");}}
      }else{files.forEach(taiTep);setThongBao(`${copied?"Đã sao chép prompt. ":"Hãy sao chép prompt bên dưới. "}Hai ảnh tham chiếu đã được tải xuống.`);}
    }catch(e){setThongBao(e instanceof Error?e.message:"Không thể chuẩn bị nội dung.");}
    finally{setDangXuLy(false);}
  }

  function hienTrangThaiDaChep(loai: "prompt"|"follow"|"caption") { setDaSaoChep(loai); navigator.vibrate?.(35); window.setTimeout(()=>setDaSaoChep(current=>current===loai?null:current),2400); }
  async function copyOnly(){const ok=await saoChep(prompt);setDaChuanBi(true);if(ok)hienTrangThaiDaChep("prompt");setThongBao(ok?"Prompt đã sẵn sàng — mở ChatGPT và dán sau khi đính kèm ảnh.":"Trình duyệt chặn sao chép. Hãy nhấn giữ nội dung prompt rồi chọn Tất cả → Sao chép.");}
  async function copyFollowUp(){const ok=await saoChep(followUpPrompt);if(ok)hienTrangThaiDaChep("follow");setThongBao(ok?"Prompt ảnh tiếp theo đã sẵn sàng — dán vào đúng cuộc trò chuyện đang dùng.":"Hãy nhấn giữ prompt tiếp nối rồi chọn Tất cả → Sao chép.");}
  async function copyCaption(){const ok=await saoChep(captionPrompt);if(ok)hienTrangThaiDaChep("caption");setThongBao(ok?"Prompt gợi ý caption đã sẵn sàng — dán vào cuộc trò chuyện sau khi tạo ảnh.":"Hãy nhấn giữ prompt caption rồi chọn Tất cả → Sao chép.");}

  const Select = ({label,value,onChange,items}:{label:string;value:string;onChange:(v:string)=>void;items:string[]}) => <label><span>{label}</span><select value={value} onChange={(e)=>onChange(e.target.value)}>{items.map(i=><option key={i}>{i}</option>)}</select></label>;

  return <main>
    <header className="topbar"><div className="brand"><span className="brandMark">M1</span><span>Studio Người Mẫu</span></div><div className="secure"><span/> Không gian riêng tư</div></header>
    <section className="hero"><div><p className="eyebrow">SÁNG TẠO TIKTOK AFFILIATE</p><h1>Một người mẫu.<br/><em>Mọi phong cách.</em></h1><p className="subhead">Chọn concept, trang điểm và phụ kiện. Sản phẩm sẽ được thêm trực tiếp trong ChatGPT.</p></div><div className="modelCard"><img src="/model-01/turnaround.png" alt="Các góc nhìn Model 01"/><div><b>MODEL 01</b><span>Đã khóa nhận diện</span></div></div></section>
    <section className="workspace">
      <div className="panel controls">
        <div className="step"><span>1</span><div><b>Chọn kiểu tóc</b><small>Khuôn mặt và hình thể luôn được giữ nguyên</small></div></div>
        <div className="hairGrid">{TOC.map(([id,name,vibe],i)=><button key={id} className={toc===id?"selected":""} onClick={()=>setToc(id)}><span className="hairCrop" style={{backgroundPosition:`${(i%3)*50}% ${i<3?"0%":"100%"}`}}/><b>{id} · {name}</b><small>{vibe}</small></button>)}</div>
        <div className="step"><span>2</span><div><b>Đạo diễn concept</b><small>Đà Nẵng, nhân vật, dáng và bố cục</small></div></div>
        <div className="directionFields">
          <Select label="Nhóm sản phẩm" value={loai} onChange={setLoai} items={LOAI_SAN_PHAM}/>
          <Select label="Không gian Đà Nẵng" value={khongGian} onChange={v=>setKhongGian(v as keyof typeof KHONG_GIAN)} items={Object.keys(KHONG_GIAN)}/>
          <Select label="Hình tượng" value={nhanVat} onChange={v=>setNhanVat(v as keyof typeof NHAN_VAT)} items={Object.keys(NHAN_VAT)}/>
          <Select label="Dáng chụp" value={dang} onChange={v=>setDang(v as keyof typeof DANG)} items={Object.keys(DANG)}/>
          <Select label="Ánh mắt" value={anhMat} onChange={v=>setAnhMat(v as keyof typeof ANH_MAT)} items={Object.keys(ANH_MAT)}/>
          <Select label="Bố cục nhiếp ảnh" value={boCuc} onChange={v=>setBoCuc(v as keyof typeof BO_CUC)} items={Object.keys(BO_CUC)}/>
        </div>
        <div className="step styleStep"><span>3</span><div><b>Hoàn thiện vẻ ngoài</b><small>Trang điểm, phụ kiện và ánh sáng</small></div></div>
        <div className="directionFields">
          <Select label="Trang điểm" value={trangDiem} onChange={v=>setTrangDiem(v as keyof typeof TRANG_DIEM)} items={Object.keys(TRANG_DIEM)}/>
          <Select label="Phụ kiện" value={phuKien} onChange={v=>setPhuKien(v as keyof typeof PHU_KIEN)} items={Object.keys(PHU_KIEN)}/>
          <Select label="Ánh sáng" value={anhSang} onChange={v=>setAnhSang(v as keyof typeof ANH_SANG)} items={Object.keys(ANH_SANG)}/>
          <Select label="Độ mờ hậu cảnh" value={xoaPhong} onChange={v=>setXoaPhong(v as keyof typeof XOA_PHONG)} items={Object.keys(XOA_PHONG)}/>
          <Select label="Độ đời thường" value={doiThuong} onChange={v=>setDoiThuong(v as keyof typeof DO_DOI_THUONG)} items={Object.keys(DO_DOI_THUONG)}/>
          <Select label="Móc thị giác 1 giây đầu" value={mocThiGiac} onChange={v=>setMocThiGiac(v as keyof typeof MOC_THI_GIAC)} items={Object.keys(MOC_THI_GIAC)}/>
          <Select label="Máy ảnh & chất phim" value={mayAnh} onChange={v=>setMayAnh(v as keyof typeof MAY_ANH_CHAT_PHIM)} items={Object.keys(MAY_ANH_CHAT_PHIM)}/>
        </div>
        <div className="sceneBrief"><b>{nhanVat} · {khongGian} · {boCuc}</b><span>{doiThuong}: thêm người, xe cộ và những chi tiết đời thường có kiểm soát. {TRANG_DIEM[trangDiem]} {PHU_KIEN[phuKien]}</span></div>
        <textarea value={ghiChu} onChange={e=>setGhiChu(e.target.value)} placeholder="Yêu cầu thêm: cảm xúc, đạo cụ, chi tiết cần nhấn mạnh…" maxLength={400}/>
        <button className="generate" onClick={chiaSe} disabled={dangXuLy}>{dangXuLy?"Đang chuẩn bị…":"Chia sẻ sang ChatGPT"}<span>Không cần API key</span></button>
        {thongBao&&<p className="message" role="status" aria-live="polite">{thongBao}</p>}
      </div>
      <div className="panel resultPanel">
        <div className="resultTitle"><div><b>Chuyển sang ChatGPT</b><small>Model 01 · {toc} · ảnh dọc 9:16</small></div><span className="statusDot">{daChuanBi?"Đã chuẩn bị":"2 ảnh tham chiếu"}</span></div>
        <div className="handoff">
          <div className="handoffFiles"><span><img src="/model-01/turnaround.png" alt="Ảnh nhận diện"/><b>Nhận diện</b></span><span><img src="/model-01/hairstyles.png" alt="Bảng kiểu tóc"/><b>Kiểu tóc</b></span><span><i>＋</i><b>Thêm sản phẩm trong ChatGPT</b></span></div>
          <div className="handoffSteps"><b>Thực hiện trên điện thoại</b><span><i>1</i> Bấm “Chia sẻ sang ChatGPT”</span><span><i>2</i> Thêm ảnh sản phẩm trực tiếp trong ChatGPT</span><span><i>3</i> Dán prompt đã sao chép và gửi</span></div>
          <div className="promptPreview"><span>PROMPT ĐÃ SOẠN — NHẤN GIỮ ĐỂ SAO CHÉP</span><textarea readOnly value={prompt} aria-label="Prompt tạo ảnh bằng ChatGPT"/></div>
          <div className="continuation">
            <Select label="Ảnh tiếp theo cho AutoCut" value={anhTiepTheo} onChange={v=>setAnhTiepTheo(v as keyof typeof ANH_TIEP_THEO)} items={Object.keys(ANH_TIEP_THEO)}/>
            <Select label="Cảm xúc mới" value={camXucTiep} onChange={v=>setCamXucTiep(v as keyof typeof CAM_XUC_TIEP)} items={Object.keys(CAM_XUC_TIEP)}/>
            <Select label="Hướng người & hành động" value={huongDangTiep} onChange={v=>setHuongDangTiep(v as keyof typeof HUONG_DANG_TIEP)} items={Object.keys(HUONG_DANG_TIEP)}/>
            <Select label="Góc máy bắt buộc" value={gocMayTiep} onChange={v=>setGocMayTiep(v as keyof typeof GOC_MAY_TIEP)} items={Object.keys(GOC_MAY_TIEP)}/>
            <Select label="Chuyển động & gió" value={chuyenDongTiep} onChange={v=>setChuyenDongTiep(v as keyof typeof CHUYEN_DONG_TIEP)} items={Object.keys(CHUYEN_DONG_TIEP)}/>
            <Select label="Thay đổi hậu cảnh" value={doiCanhTiep} onChange={v=>setDoiCanhTiep(v as keyof typeof DOI_CANH_TIEP)} items={Object.keys(DOI_CANH_TIEP)}/>
            <div className="promptPreview"><span>FOLLOW-UP PROMPT — GIỮ NGUYÊN CONCEPT</span><textarea readOnly value={followUpPrompt} aria-label="Prompt tạo ảnh tiếp theo"/></div>
            <button className={`copyFollow ${daSaoChep==="follow"?"copied":""}`} onClick={copyFollowUp} disabled={daSaoChep==="follow"} aria-label={daSaoChep==="follow"?"Đã sao chép prompt ảnh tiếp theo":"Sao chép prompt ảnh tiếp theo"}><span className="copyIcon" aria-hidden="true">{daSaoChep==="follow"?"✓":"⧉"}</span><span>{daSaoChep==="follow"?"Đã sao chép — dán vào ChatGPT":"Sao chép prompt ảnh tiếp theo"}</span></button>
          </div>
          <div className="captionSection">
            <div className="captionHeading"><div><b>Gợi ý caption TikTok</b><small>8 lựa chọn tiếng Việt · CTA nhẹ · hashtag vừa đủ</small></div><span>Cuối quy trình</span></div>
            <div className="promptPreview"><span>CAPTION PROMPT — DÁN SAU KHI TẠO ẢNH</span><textarea readOnly value={captionPrompt} aria-label="Prompt gợi ý caption TikTok"/></div>
            <button className={`copyFollow ${daSaoChep==="caption"?"copied":""}`} onClick={copyCaption} disabled={daSaoChep==="caption"} aria-label={daSaoChep==="caption"?"Đã sao chép prompt caption":"Sao chép prompt gợi ý caption"}><span className="copyIcon" aria-hidden="true">{daSaoChep==="caption"?"✓":"⧉"}</span><span>{daSaoChep==="caption"?"Đã sao chép — dán vào ChatGPT":"Sao chép prompt gợi ý caption"}</span></button>
          </div>
        </div>
        <div className="actions"><button className={daSaoChep==="prompt"?"copied":""} onClick={copyOnly} disabled={daSaoChep==="prompt"}><span className="copyIcon" aria-hidden="true">{daSaoChep==="prompt"?"✓":"⧉"}</span>{daSaoChep==="prompt"?"Đã sao chép":"Chỉ sao chép prompt"}</button><a href="https://chatgpt.com/" target="_blank" rel="noreferrer">Mở ChatGPT</a></div>
        <div className="downloadRefs"><span>Nếu bị chặn chia sẻ:</span><a href="/model-01/turnaround.png" download>Tải ảnh nhận diện</a><a href="/model-01/hairstyles.png" download>Tải bảng tóc</a></div>
        <div className="checklist"><b>Kiểm tra trước khi đăng</b><span>✓ Khuôn mặt nhất quán</span><span>✓ Sản phẩm chính xác</span><span>✓ Bối cảnh có chiều sâu</span><span>Nhớ bật nhãn nội dung do AI tạo trên TikTok.</span></div>
      </div>
    </section>
    <footer>Không cần API key. Ảnh sản phẩm được thêm trực tiếp trong ChatGPT.</footer>
  </main>;
}

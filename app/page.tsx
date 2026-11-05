"use client";

import { useMemo, useState } from "react";

import {
  TOC, LOAI_SAN_PHAM, KHONG_GIAN, NHAN_VAT, BO_CUC, DANG, ANH_MAT, TRANG_DIEM, PHU_KIEN, ANH_SANG, XOA_PHONG, DO_DOI_THUONG, MOC_THI_GIAC,
  MAY_ANH_CHAT_PHIM, ANH_TIEP_THEO, CAM_XUC_TIEP, HUONG_DANG_TIEP, CHUYEN_DONG_TIEP, DOI_CANH_TIEP, GOC_MAY_TIEP,
  DEFAULTS, buildInitialPrompt, buildFollowUpPrompt, buildCaptionPrompt,
} from "./prompts";

export default function Home() {
  const [toc, setToc] = useState(DEFAULTS.toc);
  const [loai, setLoai] = useState(DEFAULTS.loai);
  const [khongGian, setKhongGian] = useState<keyof typeof KHONG_GIAN>(DEFAULTS.khongGian);
  const [nhanVat, setNhanVat] = useState<keyof typeof NHAN_VAT>(DEFAULTS.nhanVat);
  const [boCuc, setBoCuc] = useState<keyof typeof BO_CUC>(DEFAULTS.boCuc);
  const [dang, setDang] = useState<keyof typeof DANG>(DEFAULTS.dang);
  const [anhMat, setAnhMat] = useState<keyof typeof ANH_MAT>(DEFAULTS.anhMat);
  const [trangDiem, setTrangDiem] = useState<keyof typeof TRANG_DIEM>(DEFAULTS.trangDiem);
  const [phuKien, setPhuKien] = useState<keyof typeof PHU_KIEN>(DEFAULTS.phuKien);
  const [anhSang, setAnhSang] = useState<keyof typeof ANH_SANG>(DEFAULTS.anhSang);
  const [xoaPhong, setXoaPhong] = useState<keyof typeof XOA_PHONG>(DEFAULTS.xoaPhong);
  const [doiThuong, setDoiThuong] = useState<keyof typeof DO_DOI_THUONG>(DEFAULTS.doiThuong);
  const [mocThiGiac, setMocThiGiac] = useState<keyof typeof MOC_THI_GIAC>(DEFAULTS.mocThiGiac);
  const [mayAnh, setMayAnh] = useState<keyof typeof MAY_ANH_CHAT_PHIM>(DEFAULTS.mayAnh);
  const [anhTiepTheo, setAnhTiepTheo] = useState<keyof typeof ANH_TIEP_THEO>(DEFAULTS.anhTiepTheo);
  const [camXucTiep, setCamXucTiep] = useState<keyof typeof CAM_XUC_TIEP>(DEFAULTS.camXucTiep);
  const [huongDangTiep, setHuongDangTiep] = useState<keyof typeof HUONG_DANG_TIEP>(DEFAULTS.huongDangTiep);
  const [chuyenDongTiep, setChuyenDongTiep] = useState<keyof typeof CHUYEN_DONG_TIEP>(DEFAULTS.chuyenDongTiep);
  const [doiCanhTiep, setDoiCanhTiep] = useState<keyof typeof DOI_CANH_TIEP>(DEFAULTS.doiCanhTiep);
  const [gocMayTiep, setGocMayTiep] = useState<keyof typeof GOC_MAY_TIEP>(DEFAULTS.gocMayTiep);
  const [ghiChu, setGhiChu] = useState(DEFAULTS.ghiChu);
  const [daChuanBi, setDaChuanBi] = useState(false);
  const [thongBao, setThongBao] = useState("");
  const [daSaoChep, setDaSaoChep] = useState<"prompt"|"follow"|"caption"|null>(null);
  const [mucMo, setMucMo] = useState({initial:true,follow:false,caption:false});

  const prompt = useMemo(() => buildInitialPrompt({ toc, loai, khongGian, nhanVat, boCuc, dang, anhMat, trangDiem, phuKien, anhSang, xoaPhong, doiThuong, mocThiGiac, mayAnh, ghiChu }), [anhMat, anhSang, boCuc, dang, doiThuong, ghiChu, khongGian, loai, mayAnh, mocThiGiac, nhanVat, phuKien, toc, trangDiem, xoaPhong]);

  const followUpPrompt = useMemo(() => buildFollowUpPrompt({ anhTiepTheo, camXucTiep, huongDangTiep, chuyenDongTiep, doiCanhTiep, gocMayTiep, mayAnh }), [anhTiepTheo, camXucTiep, chuyenDongTiep, doiCanhTiep, gocMayTiep, huongDangTiep, mayAnh]);

  const captionPrompt = useMemo(() => buildCaptionPrompt({ loai, nhanVat, khongGian }), [khongGian, loai, nhanVat]);

  async function saoChep(text: string) { try { await navigator.clipboard.writeText(text); return true; } catch { const x=document.createElement("textarea"); x.value=text; x.readOnly=true; x.style.position="fixed"; x.style.opacity="0"; document.body.appendChild(x); x.select(); const ok=document.execCommand("copy"); x.remove(); return ok; } }

  function hienTrangThaiDaChep(loai: "prompt"|"follow"|"caption") { setDaSaoChep(loai); navigator.vibrate?.(35); window.setTimeout(()=>setDaSaoChep(current=>current===loai?null:current),2400); }
  async function copyOnly(){const ok=await saoChep(prompt);setDaChuanBi(true);if(ok)hienTrangThaiDaChep("prompt");setThongBao(ok?"Prompt đã sẵn sàng — mở ChatGPT và dán sau khi đính kèm ảnh.":"Trình duyệt chặn sao chép. Hãy nhấn giữ nội dung prompt rồi chọn Tất cả → Sao chép.");}
  async function copyFollowUp(){const ok=await saoChep(followUpPrompt);if(ok)hienTrangThaiDaChep("follow");setThongBao(ok?"Prompt ảnh tiếp theo đã sẵn sàng — dán vào đúng cuộc trò chuyện đang dùng.":"Hãy nhấn giữ prompt tiếp nối rồi chọn Tất cả → Sao chép.");}
  async function copyCaption(){const ok=await saoChep(captionPrompt);if(ok)hienTrangThaiDaChep("caption");setThongBao(ok?"Prompt gợi ý caption đã sẵn sàng — dán vào cuộc trò chuyện sau khi tạo ảnh.":"Hãy nhấn giữ prompt caption rồi chọn Tất cả → Sao chép.");}
  function doiTrangThaiMuc(muc: keyof typeof mucMo){setMucMo(current=>({...current,[muc]:!current[muc]}));}

  const Select = ({label,value,onChange,items}:{label:string;value:string;onChange:(v:string)=>void;items:string[]}) => <label><span>{label}</span><select value={value} onChange={(e)=>onChange(e.target.value)}>{items.map(i=><option key={i}>{i}</option>)}</select></label>;
  const PromptBox = ({label,value,kind,onCopy,ariaLabel}:{label:string;value:string;kind:"prompt"|"follow"|"caption";onCopy:()=>void;ariaLabel:string}) => {
    const copied=daSaoChep===kind;
    return <div className={`promptPreview ${copied?"isCopied":""}`}>
      <div className="promptHeader"><span>{label}</span><button className="inlineCopy" onClick={onCopy} disabled={copied} aria-label={copied?"Đã sao chép":ariaLabel} title={copied?"Đã sao chép":ariaLabel}><span aria-hidden="true">{copied?"✓":"⧉"}</span><b>{copied?"Đã chép":"Sao chép"}</b></button></div>
      <textarea readOnly value={value} aria-label={ariaLabel}/>
    </div>;
  };

  return <main>
    <header className="topbar"><div className="brand"><span className="brandMark">M1</span><span>Studio Người Mẫu</span></div><div className="secure"><span/> Không gian riêng tư</div></header>
    <section className="hero"><div><p className="eyebrow">SÁNG TẠO TIKTOK AFFILIATE</p><h1>Một người mẫu.<br/><em>Mọi phong cách.</em></h1><p className="subhead">Chọn concept, trang điểm và phụ kiện. Sản phẩm sẽ được thêm trực tiếp trong ChatGPT.</p></div><div className="modelCard"><img src="/model-01/turnaround.webp" alt="Các góc nhìn Model 01"/><div><b>MODEL 01</b><span>Đã khóa nhận diện</span></div></div></section>
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
      </div>
      <div className="panel resultPanel">
        <div className="resultTitle"><div><b>Quy trình nội dung</b><small>3 bước · Model 01 · ảnh dọc 9:16</small></div><span className="statusDot">{daChuanBi?"Đã bắt đầu":"Bắt đầu bước 1"}</span></div>
        <div className="workflowSections">
          <section className={`workflowSection ${mucMo.initial?"open":""}`}>
            <button className="workflowToggle" onClick={()=>doiTrangThaiMuc("initial")} aria-expanded={mucMo.initial} aria-controls="initial-content"><span className="workflowNumber">1</span><span className="workflowLabel"><b>Initial image prompt</b><small>Tạo ảnh đầu tiên và khóa concept</small></span><span className="workflowChevron" aria-hidden="true">⌄</span></button>
            {mucMo.initial&&<div className="workflowContent" id="initial-content">
              <div className="handoffFiles"><span><img src="/model-01/turnaround.webp" alt="Ảnh nhận diện"/><b>Nhận diện</b></span><span><img src="/model-01/hairstyles.webp" alt="Bảng kiểu tóc"/><b>Kiểu tóc</b></span><span><i>＋</i><b>Thêm sản phẩm trong ChatGPT</b></span></div>
              <div className="handoffSteps"><b>Thực hiện trên điện thoại</b><span><i>1</i> Sao chép prompt ngay trong khung bên dưới</span><span><i>2</i> Mở ChatGPT và thêm ảnh tham chiếu cùng ảnh sản phẩm</span><span><i>3</i> Dán prompt rồi gửi</span></div>
              <PromptBox label="PROMPT ĐÃ SOẠN" value={prompt} kind="prompt" onCopy={copyOnly} ariaLabel="Sao chép prompt tạo ảnh bằng ChatGPT"/>
              <div className="actions"><button className={daSaoChep==="prompt"?"copied":""} onClick={copyOnly} disabled={daSaoChep==="prompt"}><span className="copyIcon" aria-hidden="true">{daSaoChep==="prompt"?"✓":"⧉"}</span>{daSaoChep==="prompt"?"Đã sao chép":"Chỉ sao chép prompt"}</button><a href="https://chatgpt.com/" target="_blank" rel="noreferrer">Mở ChatGPT</a></div>
              <div className="downloadRefs"><span>Tải ảnh tham chiếu:</span><a href="/model-01/turnaround.webp" download>Ảnh nhận diện</a><a href="/model-01/hairstyles.webp" download>Bảng tóc</a></div>
            </div>}
          </section>
          <section className={`workflowSection ${mucMo.follow?"open":""}`}>
            <button className="workflowToggle" onClick={()=>doiTrangThaiMuc("follow")} aria-expanded={mucMo.follow} aria-controls="follow-content"><span className="workflowNumber">2</span><span className="workflowLabel"><b>Follow-up images prompt</b><small>Đổi góc, cảm xúc và chuyển động</small></span><span className="workflowChevron" aria-hidden="true">⌄</span></button>
            {mucMo.follow&&<div className="workflowContent continuation" id="follow-content">
            <Select label="Ảnh tiếp theo cho AutoCut" value={anhTiepTheo} onChange={v=>setAnhTiepTheo(v as keyof typeof ANH_TIEP_THEO)} items={Object.keys(ANH_TIEP_THEO)}/>
            <Select label="Cảm xúc mới" value={camXucTiep} onChange={v=>setCamXucTiep(v as keyof typeof CAM_XUC_TIEP)} items={Object.keys(CAM_XUC_TIEP)}/>
            <Select label="Hướng người & hành động" value={huongDangTiep} onChange={v=>setHuongDangTiep(v as keyof typeof HUONG_DANG_TIEP)} items={Object.keys(HUONG_DANG_TIEP)}/>
            <Select label="Góc máy bắt buộc" value={gocMayTiep} onChange={v=>setGocMayTiep(v as keyof typeof GOC_MAY_TIEP)} items={Object.keys(GOC_MAY_TIEP)}/>
            <Select label="Chuyển động & gió" value={chuyenDongTiep} onChange={v=>setChuyenDongTiep(v as keyof typeof CHUYEN_DONG_TIEP)} items={Object.keys(CHUYEN_DONG_TIEP)}/>
            <Select label="Thay đổi hậu cảnh" value={doiCanhTiep} onChange={v=>setDoiCanhTiep(v as keyof typeof DOI_CANH_TIEP)} items={Object.keys(DOI_CANH_TIEP)}/>
            <PromptBox label="FOLLOW-UP PROMPT · GIỮ NGUYÊN CONCEPT" value={followUpPrompt} kind="follow" onCopy={copyFollowUp} ariaLabel="Sao chép prompt tạo ảnh tiếp theo"/>
            <button className={`copyFollow ${daSaoChep==="follow"?"copied":""}`} onClick={copyFollowUp} disabled={daSaoChep==="follow"} aria-label={daSaoChep==="follow"?"Đã sao chép prompt ảnh tiếp theo":"Sao chép prompt ảnh tiếp theo"}><span className="copyIcon" aria-hidden="true">{daSaoChep==="follow"?"✓":"⧉"}</span><span>{daSaoChep==="follow"?"Đã sao chép — dán vào ChatGPT":"Sao chép prompt ảnh tiếp theo"}</span></button>
            </div>}
          </section>
          <section className={`workflowSection ${mucMo.caption?"open":""}`}>
            <button className="workflowToggle" onClick={()=>doiTrangThaiMuc("caption")} aria-expanded={mucMo.caption} aria-controls="caption-content"><span className="workflowNumber">3</span><span className="workflowLabel"><b>Caption &amp; hashtags</b><small>8 lựa chọn · CTA nhẹ · hashtag vừa đủ</small></span><span className="workflowChevron" aria-hidden="true">⌄</span></button>
            {mucMo.caption&&<div className="workflowContent captionSection" id="caption-content">
            <PromptBox label="CAPTION PROMPT · DÁN SAU KHI TẠO ẢNH" value={captionPrompt} kind="caption" onCopy={copyCaption} ariaLabel="Sao chép prompt gợi ý caption TikTok"/>
            <button className={`copyFollow ${daSaoChep==="caption"?"copied":""}`} onClick={copyCaption} disabled={daSaoChep==="caption"} aria-label={daSaoChep==="caption"?"Đã sao chép prompt caption":"Sao chép prompt gợi ý caption"}><span className="copyIcon" aria-hidden="true">{daSaoChep==="caption"?"✓":"⧉"}</span><span>{daSaoChep==="caption"?"Đã sao chép — dán vào ChatGPT":"Sao chép prompt gợi ý caption"}</span></button>
            </div>}
          </section>
        </div>
        {thongBao&&<p className="message" role="status" aria-live="polite">{thongBao}</p>}
        <div className="checklist"><b>Kiểm tra trước khi đăng</b><span>✓ Khuôn mặt nhất quán</span><span>✓ Sản phẩm chính xác</span><span>✓ Bối cảnh có chiều sâu</span><span>Nhớ bật nhãn nội dung do AI tạo trên TikTok.</span></div>
      </div>
    </section>
    <footer>Không cần API key. Ảnh sản phẩm được thêm trực tiếp trong ChatGPT.</footer>
  </main>;
}

import { readFileSync } from "node:fs";
import {
  TOC, LOAI_SAN_PHAM, KHONG_GIAN, NHAN_VAT, BO_CUC, DANG, ANH_MAT, TRANG_DIEM, PHU_KIEN, ANH_SANG, XOA_PHONG,
  DO_DOI_THUONG, MOC_THI_GIAC, MAY_ANH_CHAT_PHIM, ANH_TIEP_THEO, CAM_XUC_TIEP, HUONG_DANG_TIEP, CHUYEN_DONG_TIEP,
  DOI_CANH_TIEP, GOC_MAY_TIEP, MODELS, DEFAULTS, buildInitialPrompt, buildFollowUpPrompt, buildCaptionPrompt,
} from "../app/prompts.ts";

const GROUPS: Record<string, string[]> = {
  toc: TOC.map((t) => t[0]),
  loai: [...LOAI_SAN_PHAM],
  khongGian: Object.keys(KHONG_GIAN), nhanVat: Object.keys(NHAN_VAT), boCuc: Object.keys(BO_CUC),
  dang: Object.keys(DANG), anhMat: Object.keys(ANH_MAT), trangDiem: Object.keys(TRANG_DIEM),
  phuKien: Object.keys(PHU_KIEN), anhSang: Object.keys(ANH_SANG), xoaPhong: Object.keys(XOA_PHONG),
  doiThuong: Object.keys(DO_DOI_THUONG), mocThiGiac: Object.keys(MOC_THI_GIAC),
  mayAnh: Object.keys(MAY_ANH_CHAT_PHIM), anhTiepTheo: Object.keys(ANH_TIEP_THEO),
  camXucTiep: Object.keys(CAM_XUC_TIEP), huongDangTiep: Object.keys(HUONG_DANG_TIEP),
  chuyenDongTiep: Object.keys(CHUYEN_DONG_TIEP), doiCanhTiep: Object.keys(DOI_CANH_TIEP),
  gocMayTiep: Object.keys(GOC_MAY_TIEP),
  model: [...MODELS],
};
const FREE_TEXT = ["ghiChu", "productNote", "referenceBrief"];
const KINDS: Record<string, string[]> = {
  initial: ["toc", "loai", "khongGian", "nhanVat", "boCuc", "dang", "anhMat", "trangDiem", "phuKien", "anhSang", "xoaPhong", "doiThuong", "mocThiGiac", "mayAnh", "model", ...FREE_TEXT],
  followup: ["anhTiepTheo", "camXucTiep", "huongDangTiep", "chuyenDongTiep", "doiCanhTiep", "gocMayTiep", "mayAnh", "model"],
  caption: ["loai", "nhanVat", "khongGian"],
};

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

const arg = process.argv[2];
if (!arg) fail("Usage: node scripts/build-prompt.ts <input.json> | --list");
if (arg === "--list") {
  console.log(JSON.stringify({ kinds: KINDS, options: GROUPS, freeText: FREE_TEXT, defaults: DEFAULTS }, null, 2));
  process.exit(0);
}

let input: { kind?: string; options?: Record<string, unknown> };
try {
  input = JSON.parse(readFileSync(arg, "utf8"));
} catch (e) {
  fail(`Cannot read/parse ${arg}: ${(e as Error).message}`);
}
const kind = input.kind ?? "";
if (!(kind in KINDS)) fail(`Invalid kind "${kind}". Valid: ${Object.keys(KINDS).join(", ")}`);
const given = input.options ?? {};
const allowed = KINDS[kind];
for (const [key, val] of Object.entries(given)) {
  if (!allowed.includes(key)) fail(`Unknown option "${key}" for kind "${kind}". Valid options: ${allowed.join(", ")}`);
  if (typeof val !== "string") fail(`Option "${key}" must be a string.`);
  if (FREE_TEXT.includes(key)) continue;
  if (!GROUPS[key].includes(val)) fail(`Invalid value "${val}" for "${key}". Valid values:\n${GROUPS[key].map((v) => `  - ${v}`).join("\n")}`);
}
const defaults = DEFAULTS as Record<string, string>;
const opts: Record<string, string> = {};
for (const k of allowed) opts[k] = (given[k] as string | undefined) ?? defaults[k];
for (const k of ["productNote", "referenceBrief"]) if (opts[k] === undefined) delete opts[k];

// Values were validated against the option lists above.
const out =
  kind === "initial" ? buildInitialPrompt(opts as unknown as Parameters<typeof buildInitialPrompt>[0])
  : kind === "followup" ? buildFollowUpPrompt(opts as unknown as Parameters<typeof buildFollowUpPrompt>[0])
  : buildCaptionPrompt(opts as unknown as Parameters<typeof buildCaptionPrompt>[0]);
process.stdout.write(out + "\n");

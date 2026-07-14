import { execFile } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const outputDir = path.join(root, "exports");
const htmlPath = path.join(outputDir, "ho-so-gia-su-tai-nang.html");
const pdfPath = path.join(outputDir, "ho-so-gia-su-tai-nang.pdf");
const edgePath = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const response = await fetch("https://giasutainang.online/api/tutors");
if (!response.ok) throw new Error(`Không tải được danh sách gia sư (${response.status}).`);
const payload = await response.json();
const tutors = Array.isArray(payload.items) ? [...payload.items].sort((a, b) => a.code.localeCompare(b.code)) : [];
if (tutors.length === 0) throw new Error("Chưa có hồ sơ gia sư để xuất PDF.");

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const list = (value) => Array.isArray(value) && value.length ? value.join(", ") : "Đang cập nhật";
const initials = (name) => String(name).trim().split(/\s+/).slice(-2).map((part) => part[0]).join("").toUpperCase();

const cards = tutors.map((tutor) => `
  <article class="profile">
    <header>
      <div class="avatar">${escapeHtml(initials(tutor.name))}</div>
      <div class="identity"><span class="code">${escapeHtml(tutor.code)}</span><h2>${escapeHtml(tutor.name)}</h2><p>${escapeHtml(tutor.level)} · ${escapeHtml(tutor.major)}</p></div>
    </header>
    <dl>
      <div><dt>Năm sinh / giới tính</dt><dd>${escapeHtml(tutor.birthYear)} · ${escapeHtml(tutor.gender)}</dd></div>
      <div><dt>Trường / đơn vị</dt><dd>${escapeHtml(tutor.school)}</dd></div>
      <div><dt>Môn có thể dạy</dt><dd>${escapeHtml(list(tutor.subjects))}</dd></div>
      <div><dt>Lớp có thể dạy</dt><dd>${escapeHtml(list(tutor.grades))}</dd></div>
      <div><dt>Khu vực</dt><dd>${escapeHtml(list(tutor.areas))}</dd></div>
      <div><dt>Thời gian</dt><dd>${escapeHtml(list(tutor.availableTimes))}</dd></div>
      <div><dt>Kinh nghiệm</dt><dd>${escapeHtml(tutor.experience)}</dd></div>
      <div><dt>Thành tích</dt><dd>${escapeHtml(list(tutor.achievements))}</dd></div>
      <div><dt>Phong cách dạy</dt><dd>${escapeHtml(tutor.teachingStyle)}</dd></div>
      <div><dt>Học phí dự kiến</dt><dd class="salary">${escapeHtml(tutor.expectedSalary)}</dd></div>
    </dl>
  </article>`).join("");

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${tutors.length} hồ sơ gia sư - Gia Sư Tài Năng</title><style>
@page{size:A4;margin:12mm}*{box-sizing:border-box}body{margin:0;color:#14213d;font-family:"Segoe UI",Arial,sans-serif;font-size:10px;line-height:1.4}main{display:grid;grid-template-columns:1fr 1fr;gap:8mm 6mm}.cover{grid-column:1/-1;display:flex;min-height:255mm;flex-direction:column;align-items:center;justify-content:center;text-align:center;break-after:page}.cover .logo{display:flex;width:90px;height:90px;align-items:center;justify-content:center;border-radius:24px;background:#087dcc;color:white;font-size:28px;font-weight:800}.cover h1{margin:24px 0 8px;font-size:30px;color:#0b4f86}.cover p{max-width:520px;margin:4px 0;color:#52647a;font-size:13px}.profile{min-height:124mm;padding:7mm;border:1px solid #dbe7f0;border-radius:14px;background:#fff;break-inside:avoid;page-break-inside:avoid;box-shadow:0 3px 12px rgba(20,58,92,.06)}header{display:flex;align-items:center;gap:12px;padding-bottom:12px;border-bottom:2px solid #e9f4fb}.avatar{display:flex;width:52px;height:52px;flex:0 0 52px;align-items:center;justify-content:center;border-radius:15px;background:#087dcc;color:#fff;font-size:17px;font-weight:800}.identity{min-width:0}.code{display:inline-block;border-radius:10px;background:#fff2d8;padding:3px 8px;color:#a45a00;font-size:9px;font-weight:800}.identity h2{margin:5px 0 1px;color:#123a5a;font-size:16px;line-height:1.15}.identity p{margin:0;color:#527089;font-weight:600}dl{margin:12px 0 0}dl div{display:grid;grid-template-columns:35% 65%;gap:7px;padding:4px 0;border-bottom:1px solid #eef3f7}dt{color:#64798c;font-weight:600}dd{margin:0;color:#1d3850;font-weight:600;overflow-wrap:anywhere}.salary{color:#e66b00;font-weight:800}.footer-note{grid-column:1/-1;margin-top:2mm;color:#6b7f90;text-align:center;font-size:9px}
</style></head><body><main><section class="cover"><div class="logo">TN</div><h1>${tutors.length} HỒ SƠ GIA SƯ</h1><p>Gia Sư Tài Năng · Kết nối tri thức</p><p>Danh sách được xuất từ hệ thống ngày ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(new Date())}.</p><p>Thông tin lịch dạy, học phí và hồ sơ cần được trung tâm xác nhận trước khi kết nối.</p></section>${cards}<p class="footer-note">Gia Sư Tài Năng · Hotline/Zalo 0365002142 · giasutainang.online</p></main></body></html>`;

await mkdir(outputDir, { recursive: true });
await writeFile(htmlPath, html, "utf8");
await rm(pdfPath, { force: true });
await execFileAsync(edgePath, [
  "--headless", "--disable-gpu", "--no-first-run", "--no-pdf-header-footer",
  `--print-to-pdf=${pdfPath}`, new URL(`file:///${htmlPath.replaceAll("\\", "/")}`).href,
], { windowsHide: true, timeout: 120_000 });
await rm(htmlPath, { force: true });
console.log(pdfPath);

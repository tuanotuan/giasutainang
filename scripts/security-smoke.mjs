const baseUrl = (process.env.SECURITY_CHECK_URL || "https://giasutainang.online").replace(/\/$/, "");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  const secure = await fetch(`${baseUrl}/`, { redirect: "manual" });
  assert(secure.ok, `Trang chủ trả về ${secure.status}`);
  assert(secure.headers.get("strict-transport-security")?.includes("max-age="), "Thiếu HSTS");
  assert(secure.headers.get("x-frame-options") === "DENY", "Thiếu chống nhúng iframe");
  assert(secure.headers.get("x-content-type-options") === "nosniff", "Thiếu nosniff");
  assert(secure.headers.get("content-security-policy")?.includes("frame-ancestors 'none'"), "Thiếu CSP");

  if (baseUrl.startsWith("https://")) {
    const insecureUrl = baseUrl.replace(/^https:/, "http:");
    const insecure = await fetch(`${insecureUrl}/`, { redirect: "manual" });
    assert([301, 302, 307, 308].includes(insecure.status), `HTTP chưa chuyển hướng: ${insecure.status}`);
    assert(insecure.headers.get("location")?.startsWith("https://"), "HTTP không chuyển sang HTTPS");
  }

  const crossSite = await fetch(`${baseUrl}/api/admin/logout`, {
    method: "POST",
    headers: { Origin: "https://security-check.invalid", "Sec-Fetch-Site": "cross-site" },
  });
  assert(crossSite.status === 403, `Request khác nguồn chưa bị chặn: ${crossSite.status}`);

  const classes = await fetch(`${baseUrl}/api/classes`).then((response) => response.json());
  assert(Array.isArray(classes.items), "API lớp không trả danh sách hợp lệ");
  assert(classes.items.every((item) => item.address === "" && item.note === ""), "API công khai còn lộ địa chỉ hoặc lời nhắn riêng");

  const disclosure = await fetch(`${baseUrl}/.well-known/security.txt`);
  assert(disclosure.ok, "Thiếu security.txt");
  console.log(`Security smoke check passed: ${baseUrl}`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

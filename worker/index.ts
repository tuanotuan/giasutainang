import { classes as seedClasses } from "../src/data/classes";
import { posts as seedPosts } from "../src/data/posts";
import { priceItems as seedPrices } from "../src/data/prices";
import { tutors as seedTutors } from "../src/data/tutors";
import type { PriceItem, Tutor, TutorRequest } from "../src/types";

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T>(): Promise<{ results: T[] }>;
  first<T>(): Promise<T | null>;
  run(): Promise<{ success: boolean; meta?: { changes?: number } }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>;
  exec(query: string): Promise<unknown>;
}

interface AiBinding {
  run(model: string, input: { prompt: string }): Promise<{ response?: string }>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB?: D1Database;
  AI?: AiBinding;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
}

type JsonRecord = Record<string, unknown>;

const SESSION_COOKIE = "gstn_admin";
const SESSION_AGE = 60 * 60 * 12;
let setupPromise: Promise<void> | null = null;

const SCHEMA_STATEMENTS = [
  "CREATE TABLE IF NOT EXISTS app_meta (meta_key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS classes (id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, status TEXT NOT NULL DEFAULT 'open', title TEXT NOT NULL, subject TEXT NOT NULL, grade TEXT NOT NULL, student_count INTEGER NOT NULL DEFAULT 1, student_level TEXT NOT NULL, area TEXT NOT NULL, address TEXT NOT NULL, learning_mode TEXT NOT NULL, sessions_per_week INTEGER NOT NULL, duration TEXT NOT NULL, schedule TEXT NOT NULL, tutor_requirement TEXT NOT NULL, salary INTEGER NOT NULL, note TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS tutors (id TEXT PRIMARY KEY, code TEXT NOT NULL UNIQUE, name TEXT NOT NULL, birth_year INTEGER NOT NULL, gender TEXT NOT NULL, avatar TEXT NOT NULL DEFAULT '', school TEXT NOT NULL, major TEXT NOT NULL, level TEXT NOT NULL, subjects TEXT NOT NULL, grades TEXT NOT NULL, areas TEXT NOT NULL, available_times TEXT NOT NULL, experience TEXT NOT NULL, achievements TEXT NOT NULL, teaching_style TEXT NOT NULL, expected_salary TEXT NOT NULL, rating REAL NOT NULL DEFAULT 5, review_count INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, title TEXT NOT NULL, excerpt TEXT NOT NULL, category TEXT NOT NULL, thumbnail TEXT NOT NULL DEFAULT '', date TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS prices (id TEXT PRIMARY KEY, category TEXT NOT NULL, subject_or_grade TEXT NOT NULL, student_tutor_price TEXT NOT NULL DEFAULT '', teacher_tutor_price TEXT NOT NULL DEFAULT '', sessions_per_week TEXT NOT NULL, duration TEXT NOT NULL, note TEXT, sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS tutor_requests (id TEXT PRIMARY KEY, parent_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, area TEXT NOT NULL, address TEXT NOT NULL DEFAULT '', learning_mode TEXT NOT NULL, grade TEXT NOT NULL, subjects TEXT NOT NULL, student_count INTEGER NOT NULL, student_level TEXT NOT NULL, sessions_per_week INTEGER NOT NULL, schedule TEXT NOT NULL, tutor_level TEXT NOT NULL, tutor_gender TEXT NOT NULL, selected_tutor_code TEXT, budget TEXT NOT NULL, note TEXT, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS submissions (id TEXT PRIMARY KEY, type TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, reference_code TEXT, payload TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
  "CREATE INDEX IF NOT EXISTS idx_classes_status_created ON classes(status, created_at DESC)",
  "CREATE INDEX IF NOT EXISTS idx_requests_status_created ON tutor_requests(status, created_at DESC)",
  "CREATE INDEX IF NOT EXISTS idx_submissions_type_created ON submissions(type, created_at DESC)",
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    try {
      return await handleApi(request, env, url);
    } catch (error) {
      console.error("API error", error);
      return json({ error: "Hệ thống đang bận. Vui lòng thử lại." }, 500);
    }
  },
};

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;

  if (pathname === "/api/admin/login" && request.method === "POST") {
    const body = await readJson(request);
    if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) {
      return json({ error: "Chưa cấu hình mật khẩu quản trị." }, 503);
    }
    if (!(await secureEqual(String(body.password ?? ""), env.ADMIN_PASSWORD))) {
      return json({ error: "Mật khẩu không đúng." }, 401);
    }
    const token = await createSession(env.SESSION_SECRET);
    return json(
      { success: true },
      200,
      { "Set-Cookie": `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_AGE}` },
    );
  }

  if (pathname === "/api/admin/logout" && request.method === "POST") {
    return json({ success: true }, 200, {
      "Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`,
    });
  }

  if (pathname === "/api/admin/session") {
    return json({ authenticated: await isAdmin(request, env) });
  }

  if (pathname.startsWith("/api/admin/")) {
    if (!(await isAdmin(request, env))) return json({ error: "Chưa đăng nhập." }, 401);
    if (!env.DB) return json({ error: "Hệ thống lưu thông tin chưa sẵn sàng. Vui lòng thử lại sau ít phút." }, 503);

    if (pathname === "/api/admin/setup" && request.method === "POST") {
      await setupDatabase(env.DB);
      return json({ success: true });
    }
    await ensureDatabase(env.DB);
    if (pathname === "/api/admin/state" && request.method === "GET") {
      return adminState(env.DB);
    }
    if (pathname === "/api/admin/classes") return createClass(request, env.DB);
    if (pathname.startsWith("/api/admin/classes/")) {
      return mutateClass(request, env.DB, decodeURIComponent(pathname.split("/").pop() ?? ""));
    }
    if (pathname === "/api/admin/tutors") return createTutor(request, env.DB);
    if (pathname.startsWith("/api/admin/tutors/")) {
      return mutateTutor(request, env.DB, decodeURIComponent(pathname.split("/").pop() ?? ""));
    }
    if (pathname === "/api/admin/posts") return createPost(request, env.DB);
    if (pathname.startsWith("/api/admin/posts/")) {
      return mutatePost(request, env.DB, decodeURIComponent(pathname.split("/").pop() ?? ""));
    }
    if (pathname === "/api/admin/prices") return createPrice(request, env.DB);
    if (pathname.startsWith("/api/admin/prices/")) {
      return mutatePrice(request, env.DB, decodeURIComponent(pathname.split("/").pop() ?? ""));
    }
    if (pathname.startsWith("/api/admin/ai/request/") && request.method === "POST") {
      const id = decodeURIComponent(pathname.split("/").pop() ?? "");
      return createTutorSuggestion(env.DB, env.AI, id);
    }
    if (pathname.startsWith("/api/admin/ai/zalo/") && request.method === "POST") {
      const id = decodeURIComponent(pathname.split("/").pop() ?? "");
      return createZaloMessage(env.DB, env.AI, id);
    }
    if (pathname.startsWith("/api/admin/ai/class-post/") && request.method === "POST") {
      const id = decodeURIComponent(pathname.split("/").pop() ?? "");
      return createClassPost(env.DB, env.AI, id);
    }
    if (pathname.startsWith("/api/admin/ai/tutor-audit/") && request.method === "POST") {
      const id = decodeURIComponent(pathname.split("/").pop() ?? "");
      return auditTutorProfile(env.DB, env.AI, id);
    }
    if (pathname === "/api/admin/ai/roadmap" && request.method === "POST") {
      return createLearningRoadmap(request, env.AI);
    }
    if (pathname === "/api/admin/ai/report" && request.method === "GET") {
      return createOperationsReport(env.DB, env.AI);
    }
    if (pathname.startsWith("/api/admin/requests/") && request.method === "PATCH") {
      const id = decodeURIComponent(pathname.split("/").pop() ?? "");
      const body = await readJson(request);
      await env.DB.prepare("UPDATE tutor_requests SET status = ?1, updated_at = ?2 WHERE id = ?3")
        .bind(String(body.status), now(), id).run();
      return json({ success: true });
    }
    return json({ error: "Không tìm thấy mục bạn cần." }, 404);
  }

  if (!env.DB) return json({ error: "Hệ thống lưu thông tin chưa sẵn sàng. Vui lòng thử lại sau ít phút." }, 503);
  await ensureDatabase(env.DB);

  if (pathname === "/api/classes" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM classes ORDER BY created_at DESC").all<JsonRecord>();
    return json({ items: result.results.map(rowToClass) });
  }
  if (pathname.startsWith("/api/classes/") && request.method === "GET") {
    const id = decodeURIComponent(pathname.split("/").pop() ?? "");
    const row = await env.DB.prepare("SELECT * FROM classes WHERE id = ?1").bind(id).first<JsonRecord>();
    return row ? json({ item: rowToClass(row) }) : json({ error: "Không tìm thấy lớp." }, 404);
  }
  if (pathname === "/api/tutors" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM tutors ORDER BY rating DESC, created_at DESC").all<JsonRecord>();
    return json({ items: result.results.map(rowToTutor) });
  }
  if (pathname.startsWith("/api/tutors/") && request.method === "GET") {
    const id = decodeURIComponent(pathname.split("/").pop() ?? "");
    const row = await env.DB.prepare("SELECT * FROM tutors WHERE id = ?1").bind(id).first<JsonRecord>();
    return row ? json({ item: rowToTutor(row) }) : json({ error: "Không tìm thấy hồ sơ gia sư." }, 404);
  }
  if (pathname === "/api/posts" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all<JsonRecord>();
    return json({ items: result.results.map(rowToPost) });
  }
  if (pathname.startsWith("/api/posts/") && request.method === "GET") {
    const slug = decodeURIComponent(pathname.split("/").pop() ?? "");
    const row = await env.DB.prepare("SELECT * FROM posts WHERE slug = ?1").bind(slug).first<JsonRecord>();
    return row ? json({ item: rowToPost(row) }) : json({ error: "Không tìm thấy bài viết." }, 404);
  }
  if (pathname === "/api/prices" && request.method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM prices ORDER BY sort_order ASC, created_at ASC").all<JsonRecord>();
    return json({ items: result.results.map(rowToPrice) });
  }
  if (pathname === "/api/requests/find-tutor" && request.method === "POST") {
    return saveTutorRequest(request, env.DB);
  }
  if (pathname === "/api/requests/register-tutor" && request.method === "POST") {
    return saveSubmission(request, env.DB, "tutor_application");
  }
  if (pathname === "/api/requests/receive-class" && request.method === "POST") {
    return saveSubmission(request, env.DB, "class_application");
  }
  if (pathname === "/api/requests/contact" && request.method === "POST") {
    return saveSubmission(request, env.DB, "contact");
  }
  if (pathname === "/api/ai/chat" && request.method === "POST") {
    return answerPublicQuestion(request, env.DB, env.AI);
  }
  return json({ error: "Không tìm thấy mục bạn cần." }, 404);
}

async function setupDatabase(db: D1Database) {
  for (const statement of SCHEMA_STATEMENTS) {
    await db.exec(statement);
  }
  const requestColumns = await db.prepare("PRAGMA table_info(tutor_requests)").all<{ name: string }>();
  if (!requestColumns.results.some((column) => column.name === "address")) {
    await db.exec("ALTER TABLE tutor_requests ADD COLUMN address TEXT NOT NULL DEFAULT ''");
  }
  const seeded = await db.prepare("SELECT value FROM app_meta WHERE meta_key = 'seeded_at'").first<{ value: string }>();
  const stamp = now();
  const statements: D1PreparedStatement[] = [];
  if (!seeded?.value) for (const item of seedClasses) {
    statements.push(db.prepare(`INSERT OR IGNORE INTO classes
      (id,code,status,title,subject,grade,student_count,student_level,area,address,learning_mode,sessions_per_week,duration,schedule,tutor_requirement,salary,note,created_at,updated_at)
      VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19)`)
      .bind(item.id,item.code,item.status,item.title,item.subject,item.grade,item.studentCount,item.studentLevel,item.area,item.address,item.learningMode,item.sessionsPerWeek,item.duration,item.schedule,item.tutorRequirement,item.salary,item.note,item.createdAt,stamp));
  }
  if (!seeded?.value) for (const item of seedTutors) {
    statements.push(db.prepare(`INSERT OR IGNORE INTO tutors
      (id,code,name,birth_year,gender,avatar,school,major,level,subjects,grades,areas,available_times,experience,achievements,teaching_style,expected_salary,rating,review_count,created_at,updated_at)
      VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19,?20,?21)`)
      .bind(item.id,item.code,item.name,item.birthYear,item.gender,item.avatar,item.school,item.major,item.level,JSON.stringify(item.subjects),JSON.stringify(item.grades),JSON.stringify(item.areas),JSON.stringify(item.availableTimes),item.experience,JSON.stringify(item.achievements),item.teachingStyle,item.expectedSalary,item.rating,item.reviewCount,stamp,stamp));
  }
  if (!seeded?.value) for (const item of seedPosts) {
    statements.push(db.prepare(`INSERT OR IGNORE INTO posts
      (id,slug,title,excerpt,category,thumbnail,date,content,created_at,updated_at)
      VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)`)
      .bind(item.id,item.slug,item.title,item.excerpt,item.category,item.thumbnail,item.date,item.content,stamp,stamp));
  }
  const pricesSeeded = await db.prepare("SELECT value FROM app_meta WHERE meta_key = 'prices_seeded_at'").first<{ value: string }>();
  if (!pricesSeeded?.value) for (const [index, item] of seedPrices.entries()) {
    statements.push(db.prepare(`INSERT OR IGNORE INTO prices
      (id,category,subject_or_grade,student_tutor_price,teacher_tutor_price,sessions_per_week,duration,note,sort_order,created_at,updated_at)
      VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)`)
      .bind(item.id,item.category,item.subjectOrGrade,item.studentTutorPrice,item.teacherTutorPrice,item.sessionsPerWeek,item.duration,item.note ?? null,index,stamp,stamp));
  }
  const classDatesFixed = await db.prepare("SELECT value FROM app_meta WHERE meta_key = 'class_dates_fixed_v1'").first<{ value: string }>();
  if (!classDatesFixed?.value) for (const item of seedClasses.filter((entry) => Number(entry.id) >= 7 && Number(entry.id) <= 30)) {
    statements.push(db.prepare("UPDATE classes SET created_at=?1,updated_at=?2 WHERE id=?3 AND code=?4")
      .bind(item.createdAt,stamp,item.id,item.code));
  }
  for (let index = 0; index < statements.length; index += 50) {
    await db.batch(statements.slice(index, index + 50));
  }
  if (!seeded?.value) {
    await db.prepare("INSERT OR REPLACE INTO app_meta (meta_key, value, updated_at) VALUES ('seeded_at', ?1, ?2)")
      .bind(stamp, stamp).run();
  }
  if (!pricesSeeded?.value) {
    await db.prepare("INSERT OR REPLACE INTO app_meta (meta_key, value, updated_at) VALUES ('prices_seeded_at', ?1, ?2)")
      .bind(stamp, stamp).run();
  }
  if (!classDatesFixed?.value) {
    await db.prepare("INSERT OR REPLACE INTO app_meta (meta_key, value, updated_at) VALUES ('class_dates_fixed_v1', ?1, ?2)")
      .bind(stamp, stamp).run();
  }
}

async function ensureDatabase(db: D1Database) {
  if (!setupPromise) {
    setupPromise = setupDatabase(db).catch((error) => {
      setupPromise = null;
      throw error;
    });
  }
  return setupPromise;
}

async function adminState(db: D1Database) {
  try {
    const [classes, tutors, requests, posts, prices, submissions] = await Promise.all([
      db.prepare("SELECT * FROM classes ORDER BY created_at DESC").all<JsonRecord>(),
      db.prepare("SELECT * FROM tutors ORDER BY created_at DESC").all<JsonRecord>(),
      db.prepare("SELECT * FROM tutor_requests ORDER BY created_at DESC").all<JsonRecord>(),
      db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all<JsonRecord>(),
      db.prepare("SELECT * FROM prices ORDER BY sort_order ASC, created_at ASC").all<JsonRecord>(),
      db.prepare("SELECT * FROM submissions ORDER BY created_at DESC").all<JsonRecord>(),
    ]);
    return json({
      needsSetup: false,
      classes: classes.results.map(rowToClass),
      tutors: tutors.results.map(rowToTutor),
      requests: requests.results.map(rowToRequest),
      posts: posts.results.map(rowToPost),
      prices: prices.results.map(rowToPrice),
      submissions: submissions.results.map((row) => ({ ...row, payload: parseJson(row.payload, {}) })),
    });
  } catch {
    return json({ needsSetup: true, classes: [], tutors: [], requests: [], posts: [], prices: [], submissions: [] });
  }
}

async function createTutorSuggestion(db: D1Database, ai: AiBinding | undefined, requestId: string) {
  const requestRow = await db.prepare("SELECT * FROM tutor_requests WHERE id = ?1").bind(requestId).first<JsonRecord>();
  if (!requestRow) return json({ error: "Không tìm thấy yêu cầu này." }, 404);

  const tutorRows = await db.prepare("SELECT * FROM tutors ORDER BY rating DESC, created_at DESC").all<JsonRecord>();
  const tutorRequest = rowToRequest(requestRow);
  const matches = rankTutors(tutorRequest, tutorRows.results.map(rowToTutor));
  const fallbackSummary = createFallbackSummary(tutorRequest, matches.length);
  const summary = ai ? await createAiSummary(ai, tutorRequest, matches, fallbackSummary) : fallbackSummary;

  return json({
    summary,
    suggestions: matches.map(({ id, code, name, level, subjects, areas, availableTimes, expectedSalary, score, reasons }) => ({
      id, code, name, level, subjects, areas, availableTimes, expectedSalary, score, reasons,
    })),
    note: "Đây là gợi ý để tham khảo. Hãy liên hệ và xác nhận lại lịch dạy trước khi ghép lớp.",
  });
}

function rankTutors(request: ReturnType<typeof rowToRequest>, tutors: ReturnType<typeof rowToTutor>[]) {
  return tutors.map((tutor) => {
    const reasons: string[] = [];
    let score = 0;
    const sameSubjects = tutor.subjects.filter((subject) => request.subjects.some((wanted) => sameText(subject, wanted)));
    if (sameSubjects.length) {
      score += 5;
      reasons.push(`Dạy ${sameSubjects.join(", ")}`);
    }
    if (tutor.grades.some((grade) => sameText(grade, request.grade))) {
      score += 3;
      reasons.push(`Có nhận ${request.grade}`);
    }
    const locationMatches = request.learningMode === "Online"
      ? tutor.areas.some((area) => sameText(area, "Online"))
      : tutor.areas.some((area) => sameText(area, request.area));
    if (locationMatches) {
      score += 3;
      reasons.push(request.learningMode === "Online" ? "Có thể dạy trực tuyến" : `Dạy tại ${request.area}`);
    }
    if (request.tutorLevel && request.tutorLevel !== "Không yêu cầu" && sameText(tutor.level, request.tutorLevel)) {
      score += 2;
      reasons.push(`Đúng yêu cầu trình độ ${request.tutorLevel}`);
    }
    if (request.tutorGender && request.tutorGender !== "Không yêu cầu" && sameText(tutor.gender, request.tutorGender)) {
      score += 1;
      reasons.push(`Đúng yêu cầu giới tính ${request.tutorGender}`);
    }
    if (tutor.availableTimes.length) reasons.push("Có lịch dạy đã đăng ký");
    return { ...tutor, score, reasons };
  }).filter((tutor) => tutor.score > 0).sort((left, right) => right.score - left.score || right.rating - left.rating).slice(0, 5);
}

function createFallbackSummary(request: ReturnType<typeof rowToRequest>, matchCount: number) {
  const subjects = request.subjects.join(", ");
  return `Cần tìm gia sư ${subjects} cho ${request.grade}, ${request.learningMode.toLocaleLowerCase("vi")} tại ${request.area}, học ${request.sessionsPerWeek} buổi/tuần. Hệ thống tìm được ${matchCount} hồ sơ phù hợp ban đầu; cần xác nhận lại lịch học và mức phí trước khi ghép lớp.`;
}

async function createAiSummary(
  ai: AiBinding,
  request: ReturnType<typeof rowToRequest>,
  matches: ReturnType<typeof rankTutors>,
  fallbackSummary: string,
) {
  const safeRequest = {
    monHoc: request.subjects,
    lop: request.grade,
    hinhThuc: request.learningMode,
    khuVuc: request.area,
    soHocVien: request.studentCount,
    hocLuc: request.studentLevel,
    soBuoiTuan: request.sessionsPerWeek,
    lichMongMuon: request.schedule,
    trinhDoGiaSu: request.tutorLevel,
    gioiTinhGiaSu: request.tutorGender,
    nganSach: request.budget,
  };
  const safeMatches = matches.map((tutor) => ({
    ma: tutor.code,
    trinhDo: tutor.level,
    monDay: tutor.subjects,
    lopDay: tutor.grades,
    khuVucDay: tutor.areas,
    lichDaDangKy: tutor.availableTimes,
    mucPhiMongMuon: tutor.expectedSalary,
  }));
  const prompt = [
    "Bạn là trợ lý nội bộ của một trung tâm gia sư tại Việt Nam.",
    "Hãy viết tiếng Việt, tối đa 3 câu ngắn: tóm tắt nhu cầu và nêu 1-2 điều nhân viên cần xác nhận trước khi ghép lớp.",
    "Không hứa hẹn kết quả, không tự quyết định ghép lớp, không nhắc đến AI.",
    "Dữ liệu dưới đây đã loại bỏ tên, số điện thoại, email và địa chỉ chi tiết. Không suy đoán thông tin còn thiếu.",
    `Nhu cầu: ${JSON.stringify(safeRequest)}`,
    `Các hồ sơ đã được hệ thống lọc: ${JSON.stringify(safeMatches)}`,
  ].join("\n");
  try {
    const result = await ai.run("@cf/meta/llama-3.1-8b-instruct", { prompt });
    const summary = String(result.response ?? "").trim();
    return summary || fallbackSummary;
  } catch (error) {
    console.error("AI summary error", error);
    return fallbackSummary;
  }
}

async function runAiText(ai: AiBinding | undefined, prompt: string, fallback: string) {
  if (!ai) return fallback;
  try {
    const result = await ai.run("@cf/meta/llama-3.1-8b-instruct", { prompt });
    return String(result.response ?? "").trim() || fallback;
  } catch (error) {
    console.error("AI text error", error);
    return fallback;
  }
}

async function createZaloMessage(db: D1Database, ai: AiBinding | undefined, requestId: string) {
  const row = await db.prepare("SELECT * FROM tutor_requests WHERE id = ?1").bind(requestId).first<JsonRecord>();
  if (!row) return json({ error: "Không tìm thấy yêu cầu này." }, 404);
  const item = rowToRequest(row);
  const firstName = item.parentName.trim().split(/\s+/).pop() || "anh/chị";
  const fallback = `Gia Sư Tài Năng chào anh/chị ${firstName}. Trung tâm đã nhận nhu cầu tìm gia sư ${item.subjects.join(", ")} cho ${item.grade}, học ${item.learningMode.toLocaleLowerCase("vi")} tại ${item.area}, dự kiến ${item.sessionsPerWeek} buổi/tuần. Anh/chị cho trung tâm xin thời gian thuận tiện để trao đổi thêm về lịch học và mức phí nhé.`;
  const safe = {
    xungHo: `anh/chị ${firstName}`,
    monHoc: item.subjects,
    lop: item.grade,
    khuVuc: item.area,
    hinhThuc: item.learningMode,
    soBuoi: item.sessionsPerWeek,
    lich: item.schedule,
    nganSach: item.budget,
  };
  const message = await runAiText(ai, [
    "Bạn hỗ trợ trung tâm Gia Sư Tài Năng soạn tin Zalo xác nhận đã nhận yêu cầu.",
    "Viết tiếng Việt thân thiện, 3-4 câu ngắn, không emoji, không hứa đã có gia sư, kết thúc bằng câu hỏi về thời gian tiện nghe máy.",
    "Chỉ dùng dữ liệu được cung cấp, không tự thêm thông tin.",
    JSON.stringify(safe),
  ].join("\n"), fallback);
  return json({ message, phone: item.phone, zaloUrl: `https://zalo.me/${item.phone.replace(/\D/g, "")}` });
}

async function createClassPost(db: D1Database, ai: AiBinding | undefined, classId: string) {
  const row = await db.prepare("SELECT * FROM classes WHERE id = ?1").bind(classId).first<JsonRecord>();
  if (!row) return json({ error: "Không tìm thấy lớp này." }, 404);
  const item = rowToClass(row);
  const fallback = `TUYỂN GIA SƯ - ${item.code}\n\nMôn học: ${item.subject} - ${item.grade}\nHình thức: ${item.learningMode}\nKhu vực: ${item.area}\nLịch học: ${item.schedule}, ${item.sessionsPerWeek} buổi/tuần, ${item.duration}/buổi\nMức phí: ${new Intl.NumberFormat("vi-VN").format(Number(item.salary))}đ/buổi\nYêu cầu: ${item.tutorRequirement}\n\nGia sư quan tâm vui lòng liên hệ Gia Sư Tài Năng qua hotline/Zalo 0357570667 và gửi kèm mã lớp ${item.code}.`;
  const safe = {
    maLop: item.code, mon: item.subject, lop: item.grade, hinhThuc: item.learningMode,
    khuVuc: item.area, lich: item.schedule, soBuoi: item.sessionsPerWeek,
    thoiLuong: item.duration, mucPhi: item.salary, yeuCau: item.tutorRequirement, ghiChu: item.note,
  };
  const content = await runAiText(ai, [
    "Soạn bài đăng tuyển gia sư bằng tiếng Việt cho Facebook/Zalo, dễ đọc, tối đa 130 từ.",
    "Giữ nguyên mã lớp, lịch, mức phí và yêu cầu. Không nêu địa chỉ chi tiết, không hứa hẹn, không bịa thông tin.",
    "Kết bài bằng hotline/Zalo 0357570667. Có thể dùng tối đa 4 emoji phù hợp.",
    JSON.stringify(safe),
  ].join("\n"), fallback);
  return json({ content });
}

async function auditTutorProfile(db: D1Database, ai: AiBinding | undefined, tutorId: string) {
  const row = await db.prepare("SELECT * FROM tutors WHERE id = ?1").bind(tutorId).first<JsonRecord>();
  if (!row) return json({ error: "Không tìm thấy hồ sơ gia sư." }, 404);
  const tutor = rowToTutor(row);
  const issues: string[] = [];
  const strengths: string[] = [];
  if (!tutor.avatar) issues.push("Chưa có ảnh đại diện"); else strengths.push("Đã có ảnh đại diện");
  if (tutor.experience.trim().length < 60) issues.push("Kinh nghiệm còn ngắn, nên nêu số năm và đối tượng từng dạy"); else strengths.push("Kinh nghiệm được mô tả khá rõ");
  if (tutor.teachingStyle.trim().length < 45) issues.push("Phong cách giảng dạy cần cụ thể hơn"); else strengths.push("Có mô tả phong cách giảng dạy");
  if (!tutor.achievements.length) issues.push("Chưa có thành tích hoặc chứng chỉ"); else strengths.push(`Có ${tutor.achievements.length} thành tích được ghi nhận`);
  if (!tutor.availableTimes.length) issues.push("Chưa đăng ký lịch có thể dạy");
  if (!tutor.areas.length) issues.push("Chưa chọn khu vực nhận lớp");
  if (!tutor.subjects.length || !tutor.grades.length) issues.push("Môn hoặc khối lớp nhận dạy chưa đầy đủ");
  const score = Math.max(40, Math.min(100, 100 - issues.length * 10));
  const fallback = issues.length
    ? `Hồ sơ đạt ${score}/100. Nên bổ sung: ${issues.join("; ")}.`
    : "Hồ sơ đã có đủ thông tin cơ bản để tư vấn cho phụ huynh.";
  const summary = await runAiText(ai, [
    "Bạn là nhân viên kiểm duyệt hồ sơ gia sư. Viết 2 câu tiếng Việt: nhận xét điểm mạnh và đề nghị bổ sung, không suy đoán.",
    `Dữ liệu an toàn: ${JSON.stringify({ trinhDo: tutor.level, truong: tutor.school, chuyenNganh: tutor.major, mon: tutor.subjects, lop: tutor.grades, khuVuc: tutor.areas, kinhNghiem: tutor.experience, thanhTich: tutor.achievements, phongCach: tutor.teachingStyle })}`,
    `Các mục hệ thống phát hiện: ${JSON.stringify(issues)}`,
  ].join("\n"), fallback);
  return json({ score, issues, strengths, summary });
}

async function createLearningRoadmap(request: Request, ai: AiBinding | undefined) {
  const body = await readJson(request);
  const grade = String(body.grade ?? "").trim().slice(0, 50);
  const subject = String(body.subject ?? "").trim().slice(0, 50);
  const level = String(body.level ?? "").trim().slice(0, 50);
  const goal = String(body.goal ?? "").trim().slice(0, 200);
  const weeks = Math.max(2, Math.min(24, Number(body.weeks) || 8));
  if (!grade || !subject || !level || !goal) return json({ error: "Vui lòng điền đủ thông tin để tạo lộ trình." }, 400);
  const fallback = [
    `Lộ trình ${weeks} tuần cho ${subject} - ${grade}`,
    `Tuần 1-2: đánh giá kiến thức hiện tại (${level}), xác định phần còn yếu và thống nhất cách học.`,
    `Tuần 3-${Math.max(4, weeks - 2)}: củng cố kiến thức trọng tâm, luyện bài theo từng dạng và sửa lỗi sau mỗi buổi.`,
    `Tuần ${Math.max(3, weeks - 1)}-${weeks}: luyện bài tổng hợp, kiểm tra tiến bộ và điều chỉnh phần chưa đạt mục tiêu.`,
    `Theo dõi: ghi nhận kết quả mỗi tuần và trao đổi với phụ huynh sau 2 tuần. Mục tiêu: ${goal}.`,
  ].join("\n\n");
  const roadmap = await runAiText(ai, [
    "Tạo lộ trình học tiếng Việt thực tế cho trung tâm gia sư, chia 4 giai đoạn rõ ràng.",
    "Tối đa 350 từ, có mục tiêu, hoạt động, cách đo tiến bộ. Không hứa chắc điểm số và nhắc cần điều chỉnh sau buổi đánh giá đầu tiên.",
    JSON.stringify({ grade, subject, level, goal, weeks }),
  ].join("\n"), fallback);
  return json({ roadmap });
}

async function createOperationsReport(db: D1Database, ai: AiBinding | undefined) {
  const [classRows, tutorRows, requestRows] = await Promise.all([
    db.prepare("SELECT * FROM classes").all<JsonRecord>(),
    db.prepare("SELECT * FROM tutors").all<JsonRecord>(),
    db.prepare("SELECT * FROM tutor_requests").all<JsonRecord>(),
  ]);
  const classes = classRows.results.map(rowToClass);
  const tutors = tutorRows.results.map(rowToTutor);
  const requests = requestRows.results.map(rowToRequest);
  const countTop = (values: string[]) => Object.entries(values.reduce<Record<string, number>>((acc, value) => {
    if (value) acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
  const metrics = {
    totalClasses: classes.length,
    openClasses: classes.filter((item) => item.status !== "assigned").length,
    assignedClasses: classes.filter((item) => item.status === "assigned").length,
    tutors: tutors.length,
    newRequests: requests.filter((item) => item.status === "new").length,
    matchedRequests: requests.filter((item) => item.status === "matched").length,
    topSubjects: countTop(requests.flatMap((item) => item.subjects)),
    topAreas: countTop(requests.map((item) => item.area)),
    tutorSubjects: countTop(tutors.flatMap((item) => item.subjects)),
  };
  const fallback = `Hiện có ${metrics.openClasses} lớp chưa giao, ${metrics.newRequests} yêu cầu mới và ${metrics.tutors} hồ sơ gia sư. ${metrics.topSubjects[0] ? `Nhu cầu nổi bật là ${metrics.topSubjects[0].name}.` : "Chưa đủ yêu cầu để xác định môn nổi bật."} Nên ưu tiên liên hệ yêu cầu mới và rà soát các lớp chưa giao.`;
  const summary = await runAiText(ai, [
    "Bạn là trợ lý vận hành trung tâm gia sư. Từ số liệu tổng hợp, viết 3-5 câu tiếng Việt nêu điểm đáng chú ý và 2 việc nên ưu tiên.",
    "Không suy đoán doanh thu, không bịa xu hướng khi dữ liệu ít.", JSON.stringify(metrics),
  ].join("\n"), fallback);
  return json({ metrics, summary, generatedAt: now() });
}

async function answerPublicQuestion(request: Request, db: D1Database, ai: AiBinding | undefined) {
  const body = await readJson(request);
  const question = String(body.question ?? "").trim().slice(0, 300);
  if (question.length < 3) return json({ error: "Bạn hãy nhập câu hỏi rõ hơn một chút." }, 400);
  const normalized = question.toLocaleLowerCase("vi");
  const direct = normalized.includes("số điện thoại") || normalized.includes("hotline") || normalized.includes("zalo")
    ? "Bạn có thể gọi hoặc nhắn Zalo Gia Sư Tài Năng qua số 0357570667. Trung tâm hỗ trợ từ 06:00 đến 22:00 hằng ngày."
    : normalized.includes("địa chỉ")
      ? "Gia Sư Tài Năng tại 135/1 Nguyễn Hữu Cảnh, TP. Hồ Chí Minh. Trung tâm cũng tư vấn học trực tuyến trên toàn quốc."
      : normalized.includes("đăng ký") || normalized.includes("tìm gia sư")
        ? "Bạn vào mục “Tìm gia sư”, điền nhu cầu học tập và số điện thoại. Trung tâm sẽ liên hệ để xác nhận lịch, ngân sách và gửi hồ sơ phù hợp."
        : "";
  if (direct) return json({ answer: direct, suggestions: ["Học phí khoảng bao nhiêu?", "Quy trình tìm gia sư thế nào?", "Có dạy online không?"] });
  const priceRows = await db.prepare("SELECT subject_or_grade, student_tutor_price, teacher_tutor_price, sessions_per_week, duration FROM prices ORDER BY sort_order LIMIT 12").all<JsonRecord>();
  const context = priceRows.results.map((row) => ({
    nhom: row.subject_or_grade, sinhVien: row.student_tutor_price, giaoVien: row.teacher_tutor_price,
    soBuoi: row.sessions_per_week, thoiLuong: row.duration,
  }));
  const fallback = "Mức học phí và cách sắp xếp gia sư phụ thuộc môn học, khối lớp, hình thức và lịch học. Bạn có thể để lại nhu cầu tại mục “Tìm gia sư” hoặc gọi/Zalo 0357570667 để được tư vấn chính xác.";
  const answer = await runAiText(ai, [
    "Bạn là trợ lý hỏi đáp của Gia Sư Tài Năng. Trả lời tiếng Việt thân thiện trong tối đa 4 câu.",
    "Chỉ trả lời về tìm gia sư, đăng ký làm gia sư, học phí, lịch học, học online và quy trình của trung tâm.",
    "Nếu ngoài phạm vi hoặc thiếu dữ liệu, hướng người dùng gọi/Zalo 0357570667. Không yêu cầu hay lặp lại dữ liệu cá nhân, không hứa kết quả học tập.",
    "Thông tin cố định: hỗ trợ 06:00-22:00 hằng ngày; tư vấn miễn phí; dạy tại nhà chủ yếu TP.HCM; học online toàn quốc.",
    `Bảng giá tham khảo: ${JSON.stringify(context)}`,
    `Câu hỏi: ${question}`,
  ].join("\n"), fallback);
  return json({ answer, suggestions: ["Học phí khoảng bao nhiêu?", "Quy trình tìm gia sư thế nào?", "Có dạy online không?"] });
}

function sameText(left: string, right: string) {
  return left.trim().toLocaleLowerCase("vi") === right.trim().toLocaleLowerCase("vi");
}

async function createClass(request: Request, db: D1Database) {
  if (request.method !== "POST") return json({ error: "Thao tác không được hỗ trợ." }, 405);
  const body = await readJson(request);
  const id = String(body.id || crypto.randomUUID());
  const stamp = now();
  await db.prepare(`INSERT INTO classes
    (id,code,status,title,subject,grade,student_count,student_level,area,address,learning_mode,sessions_per_week,duration,schedule,tutor_requirement,salary,note,created_at,updated_at)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19)`)
    .bind(id,String(body.code),String(body.status || "open"),String(body.title),String(body.subject),String(body.grade),number(body.studentCount,1),String(body.studentLevel),String(body.area),String(body.address),String(body.learningMode),number(body.sessionsPerWeek,2),String(body.duration),String(body.schedule),String(body.tutorRequirement),number(body.salary,0),String(body.note || ""),stamp,stamp).run();
  return json({ success: true, id }, 201);
}

async function mutateClass(request: Request, db: D1Database, id: string) {
  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM classes WHERE id = ?1").bind(id).run();
    return json({ success: true });
  }
  if (request.method !== "PUT") return json({ error: "Thao tác không được hỗ trợ." }, 405);
  const body = await readJson(request);
  await db.prepare(`UPDATE classes SET code=?1,status=?2,title=?3,subject=?4,grade=?5,student_count=?6,
    student_level=?7,area=?8,address=?9,learning_mode=?10,sessions_per_week=?11,duration=?12,
    schedule=?13,tutor_requirement=?14,salary=?15,note=?16,updated_at=?17 WHERE id=?18`)
    .bind(String(body.code),String(body.status),String(body.title),String(body.subject),String(body.grade),number(body.studentCount,1),String(body.studentLevel),String(body.area),String(body.address),String(body.learningMode),number(body.sessionsPerWeek,2),String(body.duration),String(body.schedule),String(body.tutorRequirement),number(body.salary,0),String(body.note || ""),now(),id).run();
  return json({ success: true });
}

async function createTutor(request: Request, db: D1Database) {
  if (request.method !== "POST") return json({ error: "Thao tác không được hỗ trợ." }, 405);
  const body = await readJson(request);
  const id = String(body.id || crypto.randomUUID());
  const stamp = now();
  await db.prepare(`INSERT INTO tutors
    (id,code,name,birth_year,gender,avatar,school,major,level,subjects,grades,areas,available_times,experience,achievements,teaching_style,expected_salary,rating,review_count,created_at,updated_at)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19,?20,?21)`)
    .bind(id,String(body.code),String(body.name),number(body.birthYear,2000),String(body.gender),String(body.avatar||""),String(body.school),String(body.major),String(body.level),JSON.stringify(body.subjects||[]),JSON.stringify(body.grades||[]),JSON.stringify(body.areas||[]),JSON.stringify(body.availableTimes||[]),String(body.experience||""),JSON.stringify(body.achievements||[]),String(body.teachingStyle||""),String(body.expectedSalary||""),number(body.rating,5),number(body.reviewCount,0),stamp,stamp).run();
  return json({ success: true, id }, 201);
}

async function mutateTutor(request: Request, db: D1Database, id: string) {
  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM tutors WHERE id=?1").bind(id).run();
    return json({ success: true });
  }
  if (request.method !== "PUT") return json({ error: "Thao tác không được hỗ trợ." }, 405);
  const body = await readJson(request);
  await db.prepare(`UPDATE tutors SET code=?1,name=?2,birth_year=?3,gender=?4,avatar=?5,school=?6,major=?7,
    level=?8,subjects=?9,grades=?10,areas=?11,available_times=?12,experience=?13,achievements=?14,
    teaching_style=?15,expected_salary=?16,rating=?17,review_count=?18,updated_at=?19 WHERE id=?20`)
    .bind(String(body.code),String(body.name),number(body.birthYear,2000),String(body.gender),String(body.avatar||""),String(body.school),String(body.major),String(body.level),JSON.stringify(body.subjects||[]),JSON.stringify(body.grades||[]),JSON.stringify(body.areas||[]),JSON.stringify(body.availableTimes||[]),String(body.experience||""),JSON.stringify(body.achievements||[]),String(body.teachingStyle||""),String(body.expectedSalary||""),number(body.rating,5),number(body.reviewCount,0),now(),id).run();
  return json({ success: true });
}

async function createPost(request: Request, db: D1Database) {
  if (request.method !== "POST") return json({ error: "Thao tác không được hỗ trợ." }, 405);
  const body = await readJson(request);
  const id = String(body.id || crypto.randomUUID());
  const stamp = now();
  await db.prepare(`INSERT INTO posts (id,slug,title,excerpt,category,thumbnail,date,content,created_at,updated_at)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)`)
    .bind(id,String(body.slug),String(body.title),String(body.excerpt||""),String(body.category),String(body.thumbnail||""),String(body.date),String(body.content||""),stamp,stamp).run();
  return json({ success: true, id }, 201);
}

async function mutatePost(request: Request, db: D1Database, id: string) {
  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM posts WHERE id=?1").bind(id).run();
    return json({ success: true });
  }
  if (request.method !== "PUT") return json({ error: "Thao tác không được hỗ trợ." }, 405);
  const body = await readJson(request);
  await db.prepare(`UPDATE posts SET slug=?1,title=?2,excerpt=?3,category=?4,thumbnail=?5,date=?6,content=?7,updated_at=?8 WHERE id=?9`)
    .bind(String(body.slug),String(body.title),String(body.excerpt||""),String(body.category),String(body.thumbnail||""),String(body.date),String(body.content||""),now(),id).run();
  return json({ success: true });
}

async function createPrice(request: Request, db: D1Database) {
  if (request.method !== "POST") return json({ error: "Thao tác không được hỗ trợ." }, 405);
  const body = await readJson(request);
  const id = String(body.id || crypto.randomUUID());
  const stamp = now();
  const orderRow = await db.prepare("SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM prices").first<{ next_order: number }>();
  await db.prepare(`INSERT INTO prices
    (id,category,subject_or_grade,student_tutor_price,teacher_tutor_price,sessions_per_week,duration,note,sort_order,created_at,updated_at)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11)`)
    .bind(id,String(body.category),String(body.subjectOrGrade),String(body.studentTutorPrice||""),String(body.teacherTutorPrice||""),String(body.sessionsPerWeek),String(body.duration),optional(body.note),number(orderRow?.next_order,0),stamp,stamp).run();
  return json({ success: true, id }, 201);
}

async function mutatePrice(request: Request, db: D1Database, id: string) {
  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM prices WHERE id=?1").bind(id).run();
    return json({ success: true });
  }
  if (request.method !== "PUT") return json({ error: "Thao tác không được hỗ trợ." }, 405);
  const body = await readJson(request);
  await db.prepare(`UPDATE prices SET category=?1,subject_or_grade=?2,student_tutor_price=?3,teacher_tutor_price=?4,
    sessions_per_week=?5,duration=?6,note=?7,updated_at=?8 WHERE id=?9`)
    .bind(String(body.category),String(body.subjectOrGrade),String(body.studentTutorPrice||""),String(body.teacherTutorPrice||""),String(body.sessionsPerWeek),String(body.duration),optional(body.note),now(),id).run();
  return json({ success: true });
}

async function saveTutorRequest(request: Request, db: D1Database) {
  const body = await readJson(request);
  const id = crypto.randomUUID();
  const stamp = now();
  await db.prepare(`INSERT INTO tutor_requests
    (id,parent_name,phone,email,area,address,learning_mode,grade,subjects,student_count,student_level,sessions_per_week,schedule,tutor_level,tutor_gender,selected_tutor_code,budget,note,status,created_at,updated_at)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,'new',?19,?20)`)
    .bind(id,String(body.parentName),String(body.phone),optional(body.email),String(body.area),String(body.address||""),String(body.learningMode),String(body.grade),JSON.stringify(body.subjects || [body.subject]),number(body.studentCount,1),String(body.studentLevel),number(body.sessionsPerWeek,2),String(body.schedule),String(body.tutorLevel),String(body.tutorGender),optional(body.selectedTutorCode),String(body.budget),optional(body.note),stamp,stamp).run();
  return json({ success: true, id }, 201);
}

async function saveSubmission(request: Request, db: D1Database, type: string) {
  const body = await readJson(request);
  const id = crypto.randomUUID();
  const stamp = now();
  await db.prepare(`INSERT INTO submissions (id,type,name,phone,email,reference_code,payload,status,created_at,updated_at)
    VALUES (?1,?2,?3,?4,?5,?6,?7,'new',?8,?9)`)
    .bind(id,type,String(body.fullName || body.name || ""),String(body.phone || ""),optional(body.email),optional(body.classCode),JSON.stringify(body),stamp,stamp).run();
  return json({ success: true, id }, 201);
}

function rowToClass(row: JsonRecord) {
  return {
    id: row.id, code: row.code, status: row.status, title: row.title, subject: row.subject,
    grade: row.grade, studentCount: row.student_count, studentLevel: row.student_level,
    area: row.area, address: row.address, learningMode: row.learning_mode,
    sessionsPerWeek: row.sessions_per_week, duration: row.duration, schedule: row.schedule,
    tutorRequirement: row.tutor_requirement, salary: row.salary, note: row.note, createdAt: row.created_at,
  };
}

function rowToTutor(row: JsonRecord): Tutor {
  return {
    id: text(row.id), code: text(row.code), name: text(row.name), birthYear: number(row.birth_year, 2000), gender: text(row.gender) as Tutor["gender"],
    avatar: text(row.avatar), school: text(row.school), major: text(row.major), level: text(row.level) as Tutor["level"],
    subjects: stringList(row.subjects), grades: stringList(row.grades), areas: stringList(row.areas),
    availableTimes: stringList(row.available_times), experience: text(row.experience),
    achievements: stringList(row.achievements), teachingStyle: text(row.teaching_style),
    expectedSalary: text(row.expected_salary), rating: number(row.rating, 5), reviewCount: number(row.review_count, 0),
  };
}

function rowToPost(row: JsonRecord) {
  return { id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt, category: row.category, thumbnail: row.thumbnail, date: row.date, content: row.content };
}

function rowToPrice(row: JsonRecord): PriceItem {
  return {
    id: text(row.id), category: text(row.category), subjectOrGrade: text(row.subject_or_grade),
    studentTutorPrice: text(row.student_tutor_price), teacherTutorPrice: text(row.teacher_tutor_price),
    sessionsPerWeek: text(row.sessions_per_week), duration: text(row.duration), note: textOrUndefined(row.note),
  };
}

function rowToRequest(row: JsonRecord): TutorRequest {
  return {
    id: text(row.id), parentName: text(row.parent_name), phone: text(row.phone), email: textOrUndefined(row.email),
    area: text(row.area), address: textOrUndefined(row.address), learningMode: text(row.learning_mode) as TutorRequest["learningMode"], grade: text(row.grade),
    subjects: stringList(row.subjects), studentCount: number(row.student_count, 1), studentLevel: text(row.student_level),
    sessionsPerWeek: number(row.sessions_per_week, 1), schedule: text(row.schedule), tutorLevel: text(row.tutor_level),
    tutorGender: text(row.tutor_gender), selectedTutorCode: textOrUndefined(row.selected_tutor_code), budget: text(row.budget),
    note: textOrUndefined(row.note), status: text(row.status) as TutorRequest["status"], createdAt: text(row.created_at),
  };
}

async function isAdmin(request: Request, env: Env) {
  if (!env.SESSION_SECRET) return false;
  const cookie = request.headers.get("Cookie") ?? "";
  const token = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  return token ? verifySession(token, env.SESSION_SECRET) : false;
}

async function createSession(secret: string) {
  const payload = base64Url(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_AGE }));
  return `${payload}.${await sign(payload, secret)}`;
}

async function verifySession(token: string, secret: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !(await secureEqual(signature, await sign(payload, secret)))) return false;
  try {
    const data = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))) as { exp: number };
    return data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return base64Url(signature);
}

async function secureEqual(left: string, right: string) {
  const [a, b] = await Promise.all([crypto.subtle.digest("SHA-256", new TextEncoder().encode(left)), crypto.subtle.digest("SHA-256", new TextEncoder().encode(right))]);
  const aa = new Uint8Array(a);
  const bb = new Uint8Array(b);
  let diff = 0;
  for (let index = 0; index < aa.length; index++) diff |= aa[index] ^ bb[index];
  return diff === 0;
}

function base64Url(value: string | ArrayBuffer) {
  const bytes = typeof value === "string" ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function readJson(request: Request): Promise<JsonRecord> {
  const body: unknown = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid JSON body");
  return body as JsonRecord;
}

function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function parseJson<T>(value: unknown, fallback: T): T {
  try { return typeof value === "string" ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}

function stringList(value: unknown) {
  return parseJson<unknown[]>(value, []).filter((item): item is string => typeof item === "string");
}

function text(value: unknown) {
  return typeof value === "string" ? value : String(value ?? "");
}

function textOrUndefined(value: unknown) {
  const result = text(value).trim();
  return result || undefined;
}

function optional(value: unknown) {
  const text = String(value ?? "").trim();
  return text || null;
}

function number(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function now() {
  return new Date().toISOString();
}

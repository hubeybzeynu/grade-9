// Telegram bot — handles /start, identifies users, shows a menu, and serves
// students / textbooks / mid / final / report card data on demand.
// Polled every minute via pg_cron -> telegram-poll function.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";
const ADMIN_CHAT_ID = "6218343992";

const tgHeaders = (lovableKey: string, tgKey: string) => ({
  Authorization: `Bearer ${lovableKey}`,
  "X-Connection-Api-Key": tgKey,
  "Content-Type": "application/json",
});

async function tgCall(method: string, body: Record<string, unknown>, lovableKey: string, tgKey: string) {
  const res = await fetch(`${GATEWAY_URL}/${method}`, {
    method: "POST",
    headers: tgHeaders(lovableKey, tgKey),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) console.error("telegram", method, res.status, data);
  return data;
}

const mainKeyboard = {
  keyboard: [
    [{ text: "👥 Students" }, { text: "📚 Textbooks" }],
    [{ text: "📝 Mid Exam" }, { text: "🎓 Final Exam" }],
    [{ text: "📋 Report Card" }, { text: "🏛️ Ministry" }],
    [{ text: "ℹ️ Help" }],
  ],
  resize_keyboard: true,
};

const TEXTBOOK_BASE =
  "https://raw.githubusercontent.com/hubeybzeynu/grade-9-sts/main/public/textbooks/";

const TEXTBOOKS: Array<{ name: string; file: string }> = [
  { name: "English", file: "english.pdf" },
  { name: "Mathematics", file: "mathematics.pdf" },
  { name: "Physics", file: "physics.pdf" },
  { name: "Chemistry", file: "chemistry.pdf" },
  { name: "Biology", file: "biology.pdf" },
  { name: "Geography", file: "geography.pdf" },
  { name: "History", file: "history.pdf" },
  { name: "Civics", file: "civics.pdf" },
  { name: "ICT", file: "ict.pdf" },
];

async function handleMessage(
  msg: any,
  supabase: ReturnType<typeof createClient>,
  lovableKey: string,
  tgKey: string,
) {
  const chatId = msg.chat.id;
  const text: string = (msg.text || "").trim();
  const from = msg.from || {};
  const fullName = [from.first_name, from.last_name].filter(Boolean).join(" ");

  // Notify admin of new user on /start
  if (text.startsWith("/start")) {
    const welcome = [
      `👋 Welcome, *${fullName || from.username || "Student"}*!`,
      "",
      "I'm the *Grade 9 St. Theresa* assistant bot.",
      "Use the menu below to view:",
      "• 👥 Students",
      "• 📚 Textbooks (PDF download)",
      "• 📝 Mid / 🎓 Final Exam results",
      "• 📋 Report Cards",
      "• 🏛️ Ministry results",
      "",
      "_Tap a button to get started._",
    ].join("\n");

    await tgCall("sendMessage", {
      chat_id: chatId,
      text: welcome,
      parse_mode: "Markdown",
      reply_markup: mainKeyboard,
    }, lovableKey, tgKey);

    // Notify admin (only once per chat)
    if (String(chatId) !== ADMIN_CHAT_ID) {
      await tgCall("sendMessage", {
        chat_id: ADMIN_CHAT_ID,
        text: [
          "🆕 *New bot user*",
          `👤 ${fullName || "—"}`,
          `🔗 @${from.username || "—"}`,
          `🆔 \`${from.id}\``,
          `🕐 ${new Date().toLocaleString()}`,
        ].join("\n"),
        parse_mode: "Markdown",
      }, lovableKey, tgKey);
    }
    return;
  }

  if (text === "ℹ️ Help" || text === "/help") {
    await tgCall("sendMessage", {
      chat_id: chatId,
      text: "Use the menu buttons below to browse the portal data. Send /start to reset.",
      reply_markup: mainKeyboard,
    }, lovableKey, tgKey);
    return;
  }

  if (text === "👥 Students") {
    const { data, error } = await supabase
      .from("students").select("id,name,english_name").order("id").limit(120);
    if (error) {
      await tgCall("sendMessage", { chat_id: chatId, text: "Failed to load students." }, lovableKey, tgKey);
      return;
    }
    const lines = (data || []).map((s: any) => `• #${s.id} — ${s.english_name || s.name}`);
    const chunks: string[] = [];
    let buf = "👥 *Students*\n";
    for (const l of lines) {
      if (buf.length + l.length > 3500) { chunks.push(buf); buf = ""; }
      buf += l + "\n";
    }
    if (buf) chunks.push(buf);
    for (const c of chunks) {
      await tgCall("sendMessage", { chat_id: chatId, text: c, parse_mode: "Markdown" }, lovableKey, tgKey);
    }
    return;
  }

  if (text === "📚 Textbooks") {
    const buttons = TEXTBOOKS.map((b) => [{ text: `📖 ${b.name}`, callback_data: `book:${b.file}` }]);
    await tgCall("sendMessage", {
      chat_id: chatId,
      text: "📚 *Choose a textbook:*",
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons },
    }, lovableKey, tgKey);
    return;
  }

  if (text === "📝 Mid Exam" || text === "🎓 Final Exam") {
    const type = text === "📝 Mid Exam" ? "mid" : "final";
    await tgCall("sendMessage", {
      chat_id: chatId,
      text: `Send your *student ID number* to view your ${type === "mid" ? "Mid" : "Final"} exam result.\n\nReply with: \`/${type} <id>\` (e.g. \`/${type} 12\`)`,
      parse_mode: "Markdown",
    }, lovableKey, tgKey);
    return;
  }

  if (text === "📋 Report Card") {
    await tgCall("sendMessage", {
      chat_id: chatId,
      text: "Send your report card request:\n\n`/report <student_id>`",
      parse_mode: "Markdown",
    }, lovableKey, tgKey);
    return;
  }

  if (text === "🏛️ Ministry") {
    await tgCall("sendMessage", {
      chat_id: chatId,
      text: "Ministry results: open the app's *Ministry Results* page for the live link.",
      parse_mode: "Markdown",
    }, lovableKey, tgKey);
    return;
  }

  // /mid <id>, /final <id>, /report <id>
  const cmd = text.match(/^\/(mid|final|report)\s+(\S+)/i);
  if (cmd) {
    const kind = cmd[1].toLowerCase();
    const sid = cmd[2];
    const { data, error } = await supabase
      .from("report_cards")
      .select("*")
      .eq("student_id", sid)
      .maybeSingle();
    if (error || !data) {
      await tgCall("sendMessage", {
        chat_id: chatId,
        text: `No record found for student ID *${sid}*.`,
        parse_mode: "Markdown",
      }, lovableKey, tgKey);
      return;
    }
    const subjects = (data.subjects || {}) as Record<string, any>;
    const lines = [
      kind === "report" ? "📋 *Report Card*" : kind === "mid" ? "📝 *Mid Exam*" : "🎓 *Final Exam*",
      `👤 ${data.student_name || "—"}  (ID ${data.student_id})`,
      data.grade ? `🎓 Grade: ${data.grade}` : "",
      "",
      "*Subjects:*",
    ];
    for (const [name, scores] of Object.entries(subjects)) {
      let val: string;
      if (kind === "mid") val = String((scores as any)?.mid ?? (scores as any)?.midterm ?? "—");
      else if (kind === "final") val = String((scores as any)?.final ?? (scores as any)?.total ?? "—");
      else val = JSON.stringify(scores);
      lines.push(`• ${name}: ${val}`);
    }
    await tgCall("sendMessage", {
      chat_id: chatId,
      text: lines.filter(Boolean).join("\n"),
      parse_mode: "Markdown",
    }, lovableKey, tgKey);
    return;
  }

  // Default echo with menu
  await tgCall("sendMessage", {
    chat_id: chatId,
    text: "Tap a menu button below 👇",
    reply_markup: mainKeyboard,
  }, lovableKey, tgKey);
}

async function handleCallback(
  cb: any,
  lovableKey: string,
  tgKey: string,
) {
  const chatId = cb.message.chat.id;
  const data: string = cb.data || "";
  if (data.startsWith("book:")) {
    const file = data.slice(5);
    const url = `${TEXTBOOK_BASE}${file}`;
    await tgCall("sendDocument", { chat_id: chatId, document: url, caption: `📖 ${file}` }, lovableKey, tgKey);
  }
  await tgCall("answerCallbackQuery", { callback_query_id: cb.id }, lovableKey, tgKey);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Read offset
    const { data: state } = await supabase
      .from("telegram_bot_state").select("update_offset").eq("id", 1).maybeSingle();
    let offset = state?.update_offset ?? 0;

    const startTime = Date.now();
    const MAX_RUNTIME_MS = 50_000;
    let processed = 0;

    while (Date.now() - startTime < MAX_RUNTIME_MS) {
      const remaining = MAX_RUNTIME_MS - (Date.now() - startTime);
      const timeout = Math.min(40, Math.max(1, Math.floor(remaining / 1000) - 5));
      if (timeout < 1) break;

      const upd = await fetch(`${GATEWAY_URL}/getUpdates`, {
        method: "POST",
        headers: tgHeaders(LOVABLE_API_KEY, TELEGRAM_API_KEY),
        body: JSON.stringify({
          offset,
          timeout,
          allowed_updates: ["message", "callback_query"],
        }),
      });
      const updJson = await upd.json();
      if (!upd.ok) {
        console.error("getUpdates failed", upd.status, updJson);
        break;
      }
      const updates: any[] = updJson.result || [];
      if (!updates.length) continue;

      for (const u of updates) {
        try {
          if (u.message) await handleMessage(u.message, supabase, LOVABLE_API_KEY, TELEGRAM_API_KEY);
          if (u.callback_query) await handleCallback(u.callback_query, LOVABLE_API_KEY, TELEGRAM_API_KEY);
        } catch (err) {
          console.error("update handler error", err);
        }
        offset = Math.max(offset, u.update_id + 1);
      }
      processed += updates.length;
      await supabase.from("telegram_bot_state")
        .update({ update_offset: offset, updated_at: new Date().toISOString() })
        .eq("id", 1);
    }

    return new Response(JSON.stringify({ ok: true, processed, offset }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("telegram-bot error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

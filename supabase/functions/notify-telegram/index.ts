const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

interface NotifyPayload {
  type: "login" | "rating";
  user?: {
    email?: string;
    name?: string;
    id?: string;
    avatar?: string;
  };
  rating?: number;
  message?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY not configured");

    const ADMIN_CHAT_ID = "6218343992";

    const body = (await req.json()) as NotifyPayload;

    let text = "";
    if (body.type === "login") {
      const u = body.user || {};
      text = [
        "🟢 *New Login*",
        "",
        `👤 *Name:* ${u.name || "—"}`,
        `📧 *Email:* ${u.email || "—"}`,
        `🆔 *User ID:* \`${u.id || "—"}\``,
        `🕐 ${new Date().toLocaleString()}`,
      ].join("\n");
    } else if (body.type === "rating") {
      const u = body.user || {};
      const stars = "⭐".repeat(body.rating || 0) + "☆".repeat(5 - (body.rating || 0));
      text = [
        "📝 *New App Rating*",
        "",
        `${stars}  (${body.rating}/5)`,
        "",
        `👤 *From:* ${u.name || "—"}`,
        `📧 *Email:* ${u.email || "—"}`,
        body.message ? `\n💬 *Message:*\n${body.message}` : "",
        `\n🕐 ${new Date().toLocaleString()}`,
      ].join("\n");
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tgRes = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text,
        parse_mode: "Markdown",
      }),
    });

    const data = await tgRes.json();
    if (!tgRes.ok) {
      console.error("Telegram error:", tgRes.status, data);
      return new Response(JSON.stringify({ success: false, error: data }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-telegram error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

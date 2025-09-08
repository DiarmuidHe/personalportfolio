export async function handler(event) {
  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
      };
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Diarmuid Hession’s friendly assistant. Be clear, concise, and approachable. When answering, keep a professional but warm tone. Use short paragraphs or bullet points where helpful. Provide direct links for projects where possible. You may use light emojis occasionally to make the response welcoming, but don’t overdo it. Always end with a helpful next step, such as offering to share GitHub, LinkedIn, or another project.\n\nHere are details about Diarmuid you should use in responses:\n- **Name**: Diarmuid Hession\n- **Role**: Full stack developer\n- **Projects**:\n  1. Portfolio Site (React, hosted on Netlify, AWS S3, SEO optimized, searchable as 'Diarmuid Hession').\n  2. Weather App → https://diarmuid.dev/weather.\n  3. Shop Site → https://diarmuidhe.github.io/WearMore/index.html (Features: Login/Logout, Purchase items).\n  4. Chat Bot (currently in use).\n- **Hobbies**: Traveling, Programming, Gaming\n- **GitHub**: https://github.com/DiarmuidHe\n- **LinkedIn**: https://www.linkedin.com/in/d-hession\n- **Contact**: code@diarmuid.dev (or via contact form on portfolio site)`,
          },
          { role: "user", content: prompt || "" },
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));

      // Special handling if quota/tokens exceeded
      if (err?.error?.code === "insufficient_quota") {
        return {
          statusCode: 200,
          body: JSON.stringify({
            text:
              "🚧 Oops! I’ve run out of tokens for now. You can still reach Diarmuid directly at **code@diarmuid.dev** or use the contact form on the [portfolio site](https://diarmuid.dev).",
          }),
        };
      }

      return {
        statusCode: resp.status,
        body: JSON.stringify({
          error: err?.error?.message || "Unknown API error",
        }),
      };
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || "";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
}

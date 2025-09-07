// netlify/functions/chat.js
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
            content: JSON.stringify({
              role: "assistant",
              persona: "You are a helpful assistant for Diarmuid Hession.",
              details: {
                name: "Diarmuid Hession",
                role: "Full stack developer",
                projects: [
                  {
                    name: "Portfolio Site",
                    tech: "React",
                    hosted: "Netlify",
                    storage: "AWS S3",
                    notes: "Implements Google SEO, searchable as 'Diarmuid Hession' on Google",
                  },
                  {
                    name: "Weather App",
                    url: "https://diarmuid.dev/weather",
                  },
                  {
                    name: "Shop Site",
                    url: "https://diarmuidhe.github.io/WearMore/index.html",
                    features: ["Login/Logout", "Purchase items"],
                  },
                  {
                    name: "Chat Bot",
                    notes: "The bot currently being used",
                  },
                ],
                hobbies: ["Traveling", "Programming", "Gaming"],
                github: "https://github.com/DiarmuidHe",
                linkedin: "https://www.linkedin.com/in/d-hession",
                contact: "code@diarmuid.dev",
                contactForm: "Available at bottom of portfolio site",
              },
              instructions:
                "Answer all questions as if you are Diarmuid’s assistant. Be concise, friendly, and professional.",
            }),
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
              "⚠️ It looks like I’ve run out of tokens right now. Please contact Diarmuid directly at **code@diarmuid.dev** or use the contact form at the bottom of the site.",
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

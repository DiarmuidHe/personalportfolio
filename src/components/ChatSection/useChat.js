// Shared chat state for the floating assistant and the full-page /chat view.
// - Conversation persists for the browser session, so it follows you between the two views.
// - Common questions are answered instantly on the client (free).
// - Only open-ended questions hit the paid API, with a per-browser daily cap as a cost guard.
import { useCallback, useEffect, useRef, useState } from "react";
import { matchIntent, localAnswer, followUpsFor } from "./chatKnowledge";
import { PROFILE } from "../../data/profile";

const STORAGE_KEY = "dh-chat-v1";
const USAGE_KEY = "dh-chat-usage";
export const MAX_INPUT = 400;
const DAILY_AI_LIMIT = 25;
const HISTORY_SENT = 6; // messages of context sent to the API

let nextId = Date.now();
const makeId = () => `m${nextId++}`;

function safeGet(storage, key, fallback) {
  try {
    const raw = window[storage].getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(storage, key, value) {
  try {
    window[storage].setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode etc.) - chat still works, just isn't persisted */
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function aiCallsToday() {
  const u = safeGet("localStorage", USAGE_KEY, null);
  return u && u.day === todayKey() ? u.count : 0;
}

function recordAiCall() {
  safeSet("localStorage", USAGE_KEY, { day: todayKey(), count: aiCallsToday() + 1 });
}

export function useChat() {
  const [messages, setMessages] = useState(() => safeGet("sessionStorage", STORAGE_KEY, []));
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    // Error bubbles are transient, don't restore them on the next visit
    safeSet(
      "sessionStorage",
      STORAGE_KEY,
      messages.filter((m) => !m.error).slice(-40)
    );
  }, [messages]);

  const askedSoFar = useCallback(
    (extra) => [...messages.filter((m) => m.role === "user").map((m) => m.content), extra],
    [messages]
  );

  const reply = useCallback((content, extra = {}) => {
    setMessages((prev) => [...prev, { id: makeId(), role: "assistant", content, ...extra }]);
  }, []);

  const callApi = useCallback(
    async (history, question) => {
      if (aiCallsToday() >= DAILY_AI_LIMIT) {
        reply(
          `I've hit my daily question limit, sorry! You can still reach Diarmuid directly at **${PROFILE.email}**, or via the [contact form](/#contact).`,
          { suggestions: followUpsFor("contact", askedSoFar(question)) }
        );
        return;
      }

      const payload = history
        .filter((m) => !m.error)
        .slice(-HISTORY_SENT)
        .map(({ role, content }) => ({ role, content: content.slice(0, 800) }));

      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.text) {
        const err = new Error(data?.error || `Request failed (${res.status})`);
        err.userMessage = data?.userMessage;
        throw err;
      }
      if (!data.cached) recordAiCall();
      reply(data.text, { suggestions: followUpsFor(null, askedSoFar(question)) });
    },
    [reply, askedSoFar]
  );

  const send = useCallback(
    async (raw, base = messages) => {
      const text = (raw || "").trim().slice(0, MAX_INPUT);
      if (!text || busy.current) return;
      busy.current = true;
      setLoading(true);

      const userMsg = { id: makeId(), role: "user", content: text };
      // Drop any previous error bubble so a new question starts clean
      const history = [...base.filter((m) => !m.error), userMsg];
      setMessages(history);

      try {
        const intent = matchIntent(text);
        if (intent) {
          // Short pause so instant answers still feel conversational
          await new Promise((r) => setTimeout(r, 350));
          reply(localAnswer(intent), { suggestions: followUpsFor(intent, askedSoFar(text)) });
        } else {
          await callApi(history, text);
        }
      } catch (err) {
        console.error(err);
        reply(err.userMessage || "Sorry, I couldn't get an answer just now.", { error: true, retry: text });
      } finally {
        busy.current = false;
        setLoading(false);
      }
    },
    [messages, reply, callApi, askedSoFar]
  );

  const retry = useCallback(() => {
    const failed = [...messages].reverse().find((m) => m.error);
    if (!failed) return;
    // Remove the failed exchange, then ask again
    const idx = messages.findIndex((m) => m.id === failed.id);
    send(failed.retry, messages.slice(0, Math.max(0, idx - 1)));
  }, [messages, send]);

  const clear = useCallback(() => setMessages([]), []);

  return { messages, loading, send, retry, clear };
}

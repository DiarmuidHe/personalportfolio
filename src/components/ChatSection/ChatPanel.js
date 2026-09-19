// The chat UI itself, shared by the floating overlay and the full-page /chat route.
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaRedoAlt, FaTrashAlt } from "react-icons/fa";
import ChatMarkdown from "./ChatMarkdown";
import { WELCOME_PROMPTS } from "./chatKnowledge";
import { MAX_INPUT } from "./useChat";

const ChatPanel = forwardRef(function ChatPanel({ chat, headerActions, onNavigate, variant = "overlay" }, inputRef) {
  const { messages, loading, send, retry, clear } = chat;
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);
  const localInputRef = useRef(null);
  const textareaRef = inputRef || localInputRef;

  // Keep the newest message in view
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Auto-grow the textarea up to its CSS max-height
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft, textareaRef]);

  const submit = (text) => {
    if (!text.trim() || loading) return;
    send(text);
    setDraft("");
  };

  const onKeyDown = (e) => {
    // Enter sends, Shift+Enter adds a new line
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(draft);
    }
  };

  const last = messages[messages.length - 1];
  const showSuggestions = !loading && last?.role === "assistant" && !last.error && last.suggestions?.length;
  const nearLimit = draft.length > MAX_INPUT * 0.8;

  return (
    <div className={`chat-container chat-${variant}`}>
      <div className="chat-header">
        <div className="d-flex align-items-center gap-2 min-w-0">
          <div className="min-w-0">
            <h2 className="chat-title">Ask about Diarmuid</h2>
          </div>
        </div>
        <div className="d-flex gap-1">
          {messages.length > 0 && (
            <button type="button" onClick={clear} className="chat-icon-btn" aria-label="Clear conversation" title="Clear conversation">
              <FaTrashAlt aria-hidden="true" />
            </button>
          )}
          {headerActions}
        </div>
      </div>

      <div className="chat-messages" ref={scrollRef} aria-live="polite" aria-busy={loading}>
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="chat-bubble chat-answer">
              <p className="mb-0">
                Hi, I'm the assistant on Diarmuid's site. Ask me about his <strong>experience</strong>,{" "}
                <strong>projects</strong>, <strong>skills</strong> or how to <strong>get in touch</strong>.
              </p>
            </div>
            <Suggestions items={WELCOME_PROMPTS} onPick={submit} />
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              className={`chat-bubble ${m.role === "user" ? "chat-bubble-user" : "chat-answer"} ${m.error ? "chat-bubble-error" : ""}`}
              initial={{ opacity: 0, y: 10, x: m.role === "user" ? 12 : -12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              {m.role === "user" ? m.content : <ChatMarkdown text={m.content} onNavigate={onNavigate} />}
              {m.error && (
                <button type="button" className="chat-retry" onClick={retry}>
                  <FaRedoAlt aria-hidden="true" /> Try again
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="chat-bubble chat-typing" role="status" aria-label="Assistant is typing">
            <span /><span /><span />
          </div>
        )}

        {showSuggestions && <Suggestions items={last.suggestions} onPick={submit} label="Suggested follow-ups" />}
      </div>

      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
      >
        <label htmlFor={`chat-input-${variant}`} className="sr-only">Your question about Diarmuid</label>
        <div className="chat-input-wrap">
          <textarea
            id={`chat-input-${variant}`}
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_INPUT))}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={MAX_INPUT}
            className="chat-input"
            placeholder="Ask about his experience, projects…"
            aria-describedby={`chat-hint-${variant}`}
          />
          {nearLimit && (
            <span className="chat-counter" aria-live="polite">
              {draft.length}/{MAX_INPUT}
            </span>
          )}
        </div>
        <button type="submit" className="chat-send-btn" disabled={loading || !draft.trim()} aria-label="Send">
          <FaPaperPlane aria-hidden="true" />
        </button>
      </form>
      <p className="chat-hint" id={`chat-hint-${variant}`}>
        Answers are about Diarmuid only · AI can make mistakes
      </p>
    </div>
  );
});

function Suggestions({ items, onPick, label = "Suggested questions" }) {
  return (
    <div className="chat-prompts" role="group" aria-label={label}>
      {items.map((sp, idx) => (
        <motion.button
          type="button"
          key={sp}
          className="chat-prompt-btn"
          onClick={() => onPick(sp)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + idx * 0.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sp}
        </motion.button>
      ))}
    </div>
  );
}

export default ChatPanel;

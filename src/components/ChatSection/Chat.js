// components/ChatSection/Chat.js
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaExpandAlt, FaCommentDots } from "react-icons/fa";
import ChatPanel from "./ChatPanel";
import { useChat } from "./useChat";
import { CHAT_ASK_EVENT } from "./chatEvents";
import "./Chat.css";

export default function ChatOverlay() {
  const chat = useChat();
  const { send } = chat;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);

  const close = () => {
    setIsChatOpen(false);
    toggleRef.current?.focus();
  };

  // Focus the input when opened, close with Escape
  useEffect(() => {
    if (!isChatOpen) return;
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250);
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsChatOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [isChatOpen]);

  // Other sections (e.g. the Experience timeline) can open the chat with a question
  useEffect(() => {
    const onAsk = (e) => {
      setIsChatOpen(true);
      if (e.detail?.text) send(e.detail.text);
    };
    window.addEventListener(CHAT_ASK_EVENT, onAsk);
    return () => window.removeEventListener(CHAT_ASK_EVENT, onAsk);
  }, [send]);

  // On phones the panel covers the page, so close it after following an in-page link
  const onNavigate = () => {
    if (window.matchMedia("(max-width: 576px)").matches) setIsChatOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        ref={toggleRef}
        onClick={() => setIsChatOpen((o) => !o)}
        className={`chat-toggle-btn ${isChatOpen ? "is-open" : ""}`}
        aria-label={isChatOpen ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={isChatOpen}
        aria-controls="chat-dialog"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isChatOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="chat-toggle-close"
            >
              <FaTimes aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              className="chat-toggle-icon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <FaCommentDots aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            id="chat-dialog"
            className="chat-overlay"
            role="dialog"
            aria-label="Chat assistant"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            style={{ transformOrigin: "bottom right" }}
          >
            <ChatPanel
              ref={inputRef}
              chat={chat}
              onNavigate={onNavigate}
              headerActions={
                <>
                  <Link to="/chat" className="chat-icon-btn" aria-label="Open chat in full page" title="Full screen">
                    <FaExpandAlt aria-hidden="true" />
                  </Link>
                  <button type="button" onClick={close} className="chat-icon-btn" aria-label="Close chat" title="Close">
                    <FaTimes aria-hidden="true" />
                  </button>
                </>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

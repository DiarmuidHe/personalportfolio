// components/FullPageChat/FullPageChat.js
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import ChatPanel from "../ChatSection/ChatPanel";
import { useChat } from "../ChatSection/useChat";
import "../ChatSection/Chat.css";
import "./FullPageChat.css";

export default function FullPageChat() {
  // Same session-persisted conversation as the floating chat, so it carries over
  const chat = useChat();
  const inputRef = useRef(null);

  useEffect(() => {
    document.title = "Chat with Diarmuid's assistant";
    inputRef.current?.focus();
  }, []);

  return (
    <motion.main
      className="FullPageChat-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="FullPageChat-frame">
        <ChatPanel
          ref={inputRef}
          chat={chat}
          variant="page"
          headerActions={
            <a href="/" className="chat-icon-btn chat-back-btn" aria-label="Back to portfolio" title="Back to portfolio">
              <FaArrowLeft aria-hidden="true" />
              <span className="d-none d-sm-inline">Portfolio</span>
            </a>
          }
        />
      </div>
    </motion.main>
  );
}

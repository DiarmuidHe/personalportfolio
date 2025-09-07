// components/ChatSection/Chat.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../JsonFolders/portfolio.json";
import "./Chat.css";

export default function ChatOverlay() {
  const images = data.images;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleChat = () => setIsChatOpen((prev) => !prev);

  async function ask(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setAnswer(data.text);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  const samplePrompts = [
    "Tell me about your projects",
    "What skills do you have?",
    "What hobbies do you enjoy?",
    "Who built this site?",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="chat-toggle-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={images.buttons.chat_stars}
          alt="chat icon"
          className="chat-toggle-icon"
        />
      </motion.button>

      {/* Chat Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="chat-overlay"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chat-container">
              {/* Header */}
              <div className="chat-header">
                <h5>Chat Assistant</h5>
                <button onClick={toggleChat} className="chat-close-btn">
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {!answer && !error && !loading && (
                  <div className="chat-welcome">
                    👋 Hi! You can ask me questions about Diarmuid Hession.
                    <div className="chat-prompts">
                      {samplePrompts.map((sp, idx) => (
                        <motion.button
                          key={idx}
                          className="chat-prompt-btn"
                          onClick={() => setPrompt(sp)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {sp}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
                {loading && <p className="chat-loading">Thinking...</p>}
                {error && <p className="chat-error">{error}</p>}
                <AnimatePresence>
                  {answer && (
                    <motion.div
                      className="chat-answer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <form onSubmit={ask} className="chat-form">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={1}
                  className="chat-input"
                  placeholder="Ask me anything..."
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={loading || !prompt.trim()}
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

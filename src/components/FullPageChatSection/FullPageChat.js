// components/FullPageChat/FullPageChat.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../JsonFolders/portfolio.json";
import "./FullPageChat.css";

export default function FullPageChat() {
  const images = data.images;

  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <AnimatePresence>
      <motion.div
        className="FullPageChat-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="FullPageChat-container">
          {/* Header */}
          <div className="FullPageChat-header">
            <h3>Chat Assistant</h3>
          </div>

          {/* Messages */}
          <div className="FullPageChat-messages">
            {!answer && !error && !loading && (
              <div className="FullPageChat-welcome">
                👋 Hi! You can ask me questions about Diarmuid Hession.
                <div className="FullPageChat-prompts">
                  {samplePrompts.map((sp, idx) => (
                    <motion.button
                      key={idx}
                      className="FullPageChat-prompt-btn"
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
            {loading && <p className="FullPageChat-loading">Thinking...</p>}
            {error && <p className="FullPageChat-error">{error}</p>}
            <AnimatePresence>
              {answer && (
                <motion.div
                  className="FullPageChat-answer"
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
          <form onSubmit={ask} className="FullPageChat-form">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={1}
              className="FullPageChat-input"
              placeholder="Ask me anything..."
            />
            <button
              type="submit"
              className="FullPageChat-send-btn"
              disabled={loading || !prompt.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// components/ChatSection/Chat.js
import React, { useState } from "react";
import data from "../../JsonFolders/portfolio.json";

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
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const res = await fetch("/api/chat", {
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

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="position-fixed bottom-0 end-0 p-3 btn btn-primary rounded-5 me-2 mb-2 d-flex align-items-center gap-2 z-50"
      >
        Chat
        <img
          src={images.buttons.chat_stars}
          className="chatBtn"
          alt="chat icon"
          style={{ width: "24px", height: "24px" }}
        />
      </button>

      {/* Full Screen Overlay Chat */}
      {isChatOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-white d-flex justify-content-center align-items-center"
          style={{ zIndex: 1040 }}
        >
          <div
            className="border rounded-4 shadow-lg p-4 bg-white"
            style={{ width: "90%", maxWidth: "500px" }}
          >
            <h2 className="mb-3">Chat Support</h2>

            {/* Mini Chat Form */}
            <form onSubmit={ask}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="form-control mb-2"
                placeholder="Type your question..."
              />
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading || !prompt.trim()}
              >
                {loading ? "Thinking..." : "Ask"}
              </button>
            </form>

            {error && <p className="text-danger mt-2">{error}</p>}
            {answer && (
              <pre
                className="mt-3 p-2 bg-light border rounded"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {answer}
              </pre>
            )}

            <button
              onClick={toggleChat}
              className="btn btn-danger w-100 mt-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

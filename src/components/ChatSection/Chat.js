// components/ChatSection/Chat.js
import React, { useState } from 'react';


export default function ChatOverlay() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        onClick={toggleChat}
        className="position-fixed bottom-0 end-0 p-3 btn btn-primary rounded-5 me-2 mb-2 d-flex align-items-center gap-2 z-50"
      >
        Chat
        <img 
          src="/chatstars.png"
          className="chatBtn"
          alt="chat icon"
          style={{ width: '24px', height: '24px' }}
        />
      </button>

      {/* Full Screen Overlay Chat */}
      {isChatOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-white d-flex justify-content-center align-items-center z-40" style={{ zIndex: 1040 }}>
          <div className="border rounded-4 shadow-lg p-4 bg-white" style={{ width: '90%', maxWidth: '500px' }}>
            <h2 className="mb-3">Chat Support</h2>
            <p>This is the chat window.</p>
            <button
              onClick={toggleChat}
              className="btn btn-danger mt-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

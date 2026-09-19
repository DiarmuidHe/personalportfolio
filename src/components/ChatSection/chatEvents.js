// Lets any part of the site open the floating chat with a question pre-asked,
// e.g. the "Ask about this role" buttons on the Experience timeline.
export const CHAT_ASK_EVENT = "chat:ask";

export function askChat(text) {
  window.dispatchEvent(new CustomEvent(CHAT_ASK_EVENT, { detail: { text } }));
}

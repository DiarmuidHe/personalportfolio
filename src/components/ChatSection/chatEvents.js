// Lets any part of the site open the floating chat with a question pre-asked,
// e.g. the "Ask about this role" buttons on the Experience timeline.
export const CHAT_ASK_EVENT = "chat:ask";

export function askChat(text) {
  window.dispatchEvent(new CustomEvent(CHAT_ASK_EVENT, { detail: { text } }));
}

// Lets chat answers open routes such as /projects/aabci without importing the router
// here (keeps this folder testable). App listens and hands the path to React Router.
export const CHAT_NAVIGATE_EVENT = "chat:navigate";

export function navigateTo(path) {
  window.dispatchEvent(new CustomEvent(CHAT_NAVIGATE_EVENT, { detail: { path } }));
}

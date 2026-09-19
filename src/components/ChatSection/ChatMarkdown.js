// Tiny, safe Markdown renderer for chat answers: paragraphs, bullet/numbered lists,
// **bold**, [links](url), bare URLs and emails. Builds React elements, never raw HTML.
import React from "react";
import { navigateTo } from "./chatEvents";

const OWN_SITE = /^https?:\/\/(www\.)?diarmuid\.dev/i;

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)]+[^\s).,!?])|([\w.+-]+@[\w-]+\.[\w.]+\w)/g;

function safeHref(url) {
  if (/^(https?:|mailto:)/i.test(url)) return url;
  if (url.startsWith("/") || url.startsWith("#")) return url;
  return null;
}

// Links back into this site are handled in place instead of reloading the page:
// same-page anchors (#experience, /#contact) scroll smoothly, and routes such as
// /projects/aabci open through the router so the chat can drive the page.
function handleInternalClick(e, href, onNavigate) {
  const path = href.replace(OWN_SITE, "") || "/";
  const hash = path.startsWith("#") ? path : path.startsWith("/#") ? path.slice(1) : null;
  const target = hash && document.getElementById(hash.slice(1));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    onNavigate?.();
  } else if (!hash && path.startsWith("/projects/")) {
    e.preventDefault();
    navigateTo(path);
    onNavigate?.();
  }
}

function Link({ href, children, onNavigate }) {
  const safe = safeHref(href);
  if (!safe) return <>{children}</>;
  const external = /^https?:/i.test(safe) && !OWN_SITE.test(safe);
  return (
    <a
      href={safe}
      className="chat-link"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={external ? undefined : (e) => handleInternalClick(e, safe, onNavigate)}
    >
      {children}
    </a>
  );
}

function renderInline(text, onNavigate, keyPrefix = "") {
  const out = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}${i++}`;
    if (m[1]) out.push(<strong key={key}>{renderInline(m[1], onNavigate, `${key}-`)}</strong>);
    else if (m[2]) out.push(<Link key={key} href={m[3]} onNavigate={onNavigate}>{m[2]}</Link>);
    else if (m[4]) out.push(<Link key={key} href={m[4]} onNavigate={onNavigate}>{m[4].replace(/^https?:\/\//, "")}</Link>);
    else if (m[5]) out.push(<Link key={key} href={`mailto:${m[5]}`} onNavigate={onNavigate}>{m[5]}</Link>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function ChatMarkdown({ text, onNavigate }) {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks = [];
  let para = [];
  let list = null;

  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      flushPara();
      const type = bullet ? "ul" : "ol";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
    } else if (!line) {
      flushPara();
      flushList();
    } else {
      flushList();
      // Strip heading markers, the chat bubble is too small for real headings
      para.push(line.replace(/^#{1,6}\s+/, ""));
    }
  }
  flushPara();
  flushList();

  return (
    <div className="chat-md">
      {blocks.map((b, i) => {
        if (b.type === "p") return <p key={i}>{renderInline(b.text, onNavigate, `${i}-`)}</p>;
        const Tag = b.type;
        return (
          <Tag key={i}>
            {b.items.map((item, j) => (
              <li key={j}>{renderInline(item, onNavigate, `${i}-${j}-`)}</li>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}

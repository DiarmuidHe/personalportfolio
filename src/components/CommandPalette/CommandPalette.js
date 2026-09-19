// Ctrl/Cmd + K opens a small launcher for jumping around the site.
// Hidden until asked for, so it adds nothing to the page for people who never use it.
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowRight, FaCommentDots, FaCopy, FaEnvelope, FaExternalLinkAlt, FaFileAlt,
  FaFolderOpen, FaGithub, FaHashtag, FaLinkedin, FaSearch,
} from "react-icons/fa";
import { PROFILE, PROJECTS } from "../../data/profile";
import { askChat } from "../ChatSection/chatEvents";
import "./CommandPalette.css";

export const PALETTE_OPEN_EVENT = "palette:open";

const SECTIONS = [
  ["Home", "Home"],
  ["about", "About"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["contact", "Contact"],
];

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const openerRef = useRef(null);

  const actions = useMemo(
    () => [
      ...SECTIONS.map(([id, label]) => ({
        group: "Go to",
        label,
        icon: FaHashtag,
        run: () => scrollToSection(id),
      })),
      ...PROJECTS.filter((p) => p.slug).map((p) => ({
        group: "Projects",
        label: p.title,
        icon: FaFolderOpen,
        run: () => navigate(`/projects/${p.slug}`),
      })),
      { group: "Other", label: "View CV", icon: FaFileAlt, run: () => navigate("/cv") },
      { group: "Other", label: "Ask the chat assistant", icon: FaCommentDots, run: () => askChat() },
      {
        group: "Other",
        label: "Copy email address",
        hint: PROFILE.email,
        icon: FaCopy,
        keepOpen: true,
        run: () => {
          if (!navigator.clipboard) {
            window.location.href = `mailto:${PROFILE.email}`;
            return;
          }
          navigator.clipboard.writeText(PROFILE.email).then(() => {
            setCopied(true);
            setTimeout(() => setOpen(false), 700);
          });
        },
      },
      { group: "Other", label: "Send an email", icon: FaEnvelope, run: () => (window.location.href = `mailto:${PROFILE.email}`) },
      { group: "Other", label: "GitHub", icon: FaGithub, external: true, run: () => window.open(PROFILE.links.github, "_blank", "noopener") },
      { group: "Other", label: "LinkedIn", icon: FaLinkedin, external: true, run: () => window.open(PROFILE.links.linkedin, "_blank", "noopener") },
    ],
    [navigate]
  );

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return actions;
    return actions.filter((a) => {
      const hay = `${a.label} ${a.group} ${a.hint || ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [actions, query]);

  // Global shortcut, plus an event so a visible button elsewhere can open it too
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      setQuery("");
      setActive(0);
      setCopied(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      openerRef.current?.focus?.({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row visible while arrowing through the list
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runAction = (a) => {
    if (!a) return;
    if (!a.keepOpen) {
      // Give focus back first so a section scroll isn't undone by the focus restore
      openerRef.current = null;
      setOpen(false);
    }
    a.run();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAction(results[active]);
    } else if (e.key === "Escape") {
      e.stopPropagation();
      setOpen(false);
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cp-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            className="cp-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Jump to"
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="cp-search">
              <FaSearch aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section or project…"
                aria-label="Search"
                role="combobox"
                aria-expanded="true"
                aria-controls="cp-list"
                aria-activedescendant={results[active] ? `cp-item-${active}` : undefined}
                autoComplete="off"
                spellCheck="false"
              />
              <kbd className="cp-kbd">Esc</kbd>
            </div>

            <ul className="cp-list" id="cp-list" role="listbox" ref={listRef}>
              {results.length === 0 && <li className="cp-empty">No matches for “{query}”</li>}
              {results.map((a, i) => {
                const header = a.group !== lastGroup ? a.group : null;
                lastGroup = a.group;
                const Icon = a.icon;
                const isCopied = copied && a.label === "Copy email address";
                return [
                  header && (
                    <li key={`h-${header}`} className="cp-group" role="presentation">
                      {header}
                    </li>
                  ),
                  <li
                    key={a.label}
                    id={`cp-item-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={i === active}
                    className={`cp-item ${i === active ? "is-active" : ""}`}
                    onMouseMove={() => i !== active && setActive(i)}
                    onClick={() => runAction(a)}
                  >
                    <Icon className="cp-icon" aria-hidden="true" />
                    <span className="cp-label">{isCopied ? "Copied to clipboard" : a.label}</span>
                    {a.hint && !isCopied && <span className="cp-hint">{a.hint}</span>}
                    {a.external ? (
                      <FaExternalLinkAlt className="cp-go" aria-hidden="true" />
                    ) : (
                      <FaArrowRight className="cp-go" aria-hidden="true" />
                    )}
                  </li>,
                ];
              })}
            </ul>

            <div className="cp-footer" aria-hidden="true">
              <span><kbd className="cp-kbd">↑</kbd> <kbd className="cp-kbd">↓</kbd> to move</span>
              <span><kbd className="cp-kbd">Enter</kbd> to open</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

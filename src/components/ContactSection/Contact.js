"use client";
import { Element } from "react-scroll";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaEnvelope, FaGithub, FaLinkedin, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import SectionHeading from "../SectionHeading/SectionHeading";

import "./Contact.css";

const CHANNELS = [
  { icon: FaEnvelope, label: "Email", value: "code@diarmuid.dev", href: "mailto:code@diarmuid.dev" },
  { icon: FaLinkedin, label: "LinkedIn", value: "in/d-hession", href: "https://www.linkedin.com/in/d-hession" },
  { icon: FaGithub, label: "GitHub", value: "DiarmuidHe", href: "https://github.com/DiarmuidHe" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [notification, setNotification] = useState(null);

  // After a successful send the button says "Sent" for a moment, then resets
  useEffect(() => {
    if (!sent) return;
    const id = setTimeout(() => setSent(false), 3000);
    return () => clearTimeout(id);
  }, [sent]);

  // Auto-hide the toast 5s after it appears
  useEffect(() => {
    if (!notification) return;
    const id = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(id);
  }, [notification]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    emailjs
      .send(
        "service_PortfolioWebsite",
        "template_yi90298",
        formData,
        "Xve_WZi_W9ZM1YQXP"
      )
      .then(() => {
        setNotification({ type: "success", message: "Message sent! I'll get back to you soon." });
        setSent(true);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("Email error:", error);
        setNotification({
          type: "error",
          message: "Failed to send message. Please try again.",
        });
      })
      .finally(() => setSending(false));
  };

  return (
    <Element name="contact" id="contact">
      <section className="section contact" aria-labelledby="contact-title">
        <div className="container">
          <SectionHeading title="Contact" id="contact-title" />

          <div className="row g-4 g-lg-5">
            {/* Intro + direct channels */}
            <motion.div
              className="col-lg-5"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <h3 className="contact-lead">Have a project in mind or just want to say hi?</h3>
              <p className="contact-sub">
                My inbox is always open. Send a message using the form or reach me directly on
                any of the channels below.
              </p>

              <ul className="contact-channels">
                {CHANNELS.map(({ icon: Icon, label, value, href }) => (
                  <motion.li key={label} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300 }}>
                    <a
                      href={href}
                      className="contact-channel"
                      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <span className="contact-channel-icon" aria-hidden="true"><Icon /></span>
                      <span>
                        <span className="contact-channel-label">{label}</span>
                        <span className="contact-channel-value">{value}</span>
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Form */}
            <motion.div
              className="col-lg-7"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Your name"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <label htmlFor="name">Name</label>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control contact-textarea"
                        id="message"
                        name="message"
                        placeholder="Your message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                      <label htmlFor="message">Message</label>
                    </div>
                  </div>

                  <div className="col-12 d-flex justify-content-end">
                    <motion.button
                      type="submit"
                      className={`btn-brand contact-submit ${sent ? "is-sent" : ""}`}
                      disabled={sending || sent}
                      whileHover={sending || sent ? undefined : { y: -3 }}
                      whileTap={sending || sent ? undefined : { scale: 0.96 }}
                    >
                      {sending ? (
                        <>
                          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                          Sending…
                        </>
                      ) : sent ? (
                        <>
                          {/* The plane takes off, the tick lands where it was */}
                          <motion.span
                            className="send-flight"
                            aria-hidden="true"
                            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                            animate={{ x: 90, y: -60, opacity: 0, rotate: -12 }}
                            transition={{ duration: 0.7, ease: [0.5, 0, 0.75, 0] }}
                          >
                            <FaPaperPlane />
                          </motion.span>
                          <motion.span
                            className="d-inline-flex"
                            aria-hidden="true"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.45, type: "spring", stiffness: 400, damping: 18 }}
                          >
                            <FaCheckCircle />
                          </motion.span>
                          Sent
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="send-icon" aria-hidden="true" />
                          Send message
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Notification Toast */}
        <div aria-live="polite" role="status">
          <AnimatePresence>
            {notification && (
              <motion.div
                key="toast"
                initial={{ y: -40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -40, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={`toast-message ${notification.type}`}
              >
                {notification.type === "success" ? (
                  <FaCheckCircle aria-hidden="true" />
                ) : (
                  <FaExclamationCircle aria-hidden="true" />
                )}
                <span className="flex-grow-1">{notification.message}</span>
                <button
                  className="toast-close"
                  onClick={() => setNotification(null)}
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Element>
  );
};

export default ContactSection;

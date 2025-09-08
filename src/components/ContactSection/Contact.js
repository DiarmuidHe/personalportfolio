"use client";
import { Element } from "react-scroll";
import { useRef, useState } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import data from "../../JsonFolders/portfolio.json";

import "./Contact.css";

const ContactSection = () => {
  const images = data.images;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_PortfolioWebsite",
        "template_yi90298",
        formData,
        "Xve_WZi_W9ZM1YQXP"
      )
      .then((result) => {
        console.log("Email sent:", result.text);
        setNotification({ type: "success", message: "Message sent successfully!" });
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("Email error:", error);
        setNotification({
          type: "error",
          message: "Failed to send message. Please try again.",
        });
      });

    // Auto-hide after 4s
    setTimeout(() => setNotification(null), 4000);
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: false });

  return (
    <Element name="contact" id="contact">
      <main style={{ overflowX: "hidden" }}>
        <div style={{ minHeight: "70vh", paddingTop: "70px", position: "relative" }}>
          <div className="container">
            {/* Title Animation */}
            <motion.div
              ref={ref}
              initial={{ x: -200, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="fw-bold page-title">Contact</h1>
            </motion.div>

            {/* Form */}
            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <form onSubmit={handleSubmit} className="mx-auto">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-4"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-4"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control rounded-4"
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  className="btn rounded-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    className="me-2"
                    src={images.buttons.send}
                    height="25em"
                    alt="simple aeroplane send icon"
                  />
                  Send
                </motion.button>
              </form>
            </motion.div>

            {/* Notification Toast */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  key="toast"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`toast-message ${notification.type}`}
                >
                  <span>{notification.message}</span>
                  <button
                    className="toast-close"
                    onClick={() => setNotification(null)}
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </Element>
  );
};

export default ContactSection;

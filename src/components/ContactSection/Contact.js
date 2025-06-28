"use client";
import { Element } from "react-scroll";
import { useRef } from "react";
import { useInView } from "framer-motion";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import emailjs from '@emailjs/browser';


  
const ContactSection = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  emailjs.send(
    'service_PortfolioWebsite',
    'template_yi90298',
    formData,
    'Xve_WZi_W9ZM1YQXP'
  )
  .then((result) => {
      console.log('Email sent:', result.text);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
  })
  .catch((error) => {
      console.error('Email error:', error);
      alert('Failed to send message. Please try again.');
  });
};
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: false });

  return (
    <Element name="contact" id="contact">
      <main style={{ overflowX: "hidden" }}>
        <div style={{ height: "95vh", paddingTop: "70px"  ,position: "relative"}}>
          <div className="container">
            
            <motion.div
              ref={ref}
              initial={{ x: -200, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="fw-bold page-title">Contact</h1>
            </motion.div>
            <motion.div
              className=" mt-5"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <form onSubmit={handleSubmit} className="mx-auto">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input 
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea 
                    className="form-control"
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
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>


          </div>
        </div>
      </main>
    </Element>
  );
};

export default ContactSection;




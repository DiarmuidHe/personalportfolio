"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import data from "../../JsonFolders/portfolio.json"
import SectionHeading from "../SectionHeading/SectionHeading";

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import { A11y, Autoplay, EffectCoverflow, Keyboard, Navigation } from 'swiper/modules';

import './Achievement.css';

const AchievementsSection = () => {
  const images = data.images;

  return (
    <section className="section tech" aria-labelledby="tech-title">
      <div className="container">
        <SectionHeading title="Tools & Technologies" id="tech-title" center />

        <motion.div
          className="tech-slider"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Swiper
            loop={true}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            keyboard={{ enabled: true }}
            autoplay={{
              delay: 2200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 120,
              modifier: 1,
              slideShadows: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1.6, spaceBetween: 12 },
              576: { slidesPerView: 2.5, spaceBetween: 16 },
              992: { slidesPerView: 4, spaceBetween: 20 },
              1200: { slidesPerView: 5, spaceBetween: 20 },
            }}
            navigation={{
              nextEl: ".tech-next",
              prevEl: ".tech-prev",
            }}
            a11y={{ prevSlideMessage: "Previous technology", nextSlideMessage: "Next technology" }}
            modules={[A11y, Autoplay, EffectCoverflow, Keyboard, Navigation]}
            className="tech-swiper"
          >
            {images.languages.map((lang) => (
              <SwiperSlide key={lang.alt} className="tech-slide">
                <a
                  href={lang.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tech-card"
                  aria-label={`${lang.alt} (opens in a new tab)`}
                >
                  <span className="tech-logo">
                    <img src={lang.src} alt="" loading="lazy" />
                  </span>
                  <span className="tech-name">{lang.alt}</span>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>

          <button type="button" className="tech-nav tech-prev" aria-label="Previous technology">
            <FaChevronLeft aria-hidden="true" />
          </button>
          <button type="button" className="tech-nav tech-next" aria-label="Next technology">
            <FaChevronRight aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;

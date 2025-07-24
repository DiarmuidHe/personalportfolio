"use client";

import { Element } from "react-scroll";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import data from "../../JsonFolders/portfolio.json"

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules';

import './Achievement.css';

const AchievementsSection = () => {
  const images = data.images
  
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: false });

  return (
    <Element name="achievements" id="achievements">
      <main style={{ minHeight: '100vh', paddingTop: '70px', overflowX: "hidden" }}>
        <div className="container" style={{ position: "relative" }}>
          {/* Title with animation */}
          <motion.div
            ref={ref}
            initial={{ x: -200, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -200, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="fw-bold page-title">Achievements</h1>
          </motion.div>

              <Swiper
                loop={true} 
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                breakpoints={{
                    0: { slidesPerView: 1.2, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 30 }
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                modules={[Autoplay, EffectCoverflow, Navigation]}
                className="mySwiper"
              >
              {images.languages.map((langUrl, index) => (
                <SwiperSlide>
                  <img key={index} src={langUrl} alt={`Language ${index}`}  />
                </SwiperSlide>
                
              ))}
          </Swiper>
          <div className="swiper-button-prev">&lt;</div>
          <div className="swiper-button-next">&gt;</div>
        </div>
      </main>
    </Element>
  );
};

export default AchievementsSection;

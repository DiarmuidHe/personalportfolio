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
  const images = data.images;
  
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px", once: false });

  // Access the languages array correctly - it's nested one level deeper
  

  return (

      <main style={{ overflowX: "hidden" }}>
        
          <div className="container" style={{ position: "relative" }}>
            
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
                1024: { slidesPerView: 4, spaceBetween: 10 }
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Autoplay, EffectCoverflow, Navigation]}
            className="mySwiper"
          >
            {images.languages.map((lang, index) => (
              <SwiperSlide key={index}>
                <a href={lang.link} target="_blank" rel="noopener noreferrer">
                  <img className="swiperImage" src={lang.src} alt={lang.alt}/>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="swiper-button-prev">&lt;</div>
          <div className="swiper-button-next">&gt;</div>
        </div>
      </main>

  );
};

export default AchievementsSection;
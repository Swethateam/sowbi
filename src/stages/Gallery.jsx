
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
} from "lucide-react";

import "../styles/global.css";
import "./Gallery.css";

const photos = [
  { id: 1, src: "/images/5th.jpeg" },
  { id: 2, src: "/images/3rd.jpeg" },
  { id: 3, src: "/images/4th.jpeg" },
  { id: 4, src: "/images/6th.jpeg" },
  { id: 5, src: "/images/7th.jpeg" },
  { id: 6, src: "/images/8th.jpeg" },
  { id: 7, src: "/images/9th.jpeg" },
  { id: 8, src: "/images/10th.jpeg" },
  { id: 9, src: "/images/finalimage.jpeg" },
];

const ANGLE = 360 / photos.length;

export default function GalleryStage({ onNext }) {
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState(null);
  const [expandedPhoto, setExpandedPhoto] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const lastWheelTime = useRef(0);

  // Rotate cylinder one photo at a time
  const rotateGallery = (direction) => {
    setSelected(null);
    setRotation((prev) => prev + direction * ANGLE);
  };

  // Bring the touched photo to the front center
  const selectPhoto = (index) => {
    if (selected === index) {
      setExpandedPhoto(photos[index]);
      return;
    }

    setRotation((prev) => {
      const currentIndex =
        ((Math.round(-prev / ANGLE) % photos.length) +
          photos.length) %
        photos.length;

      let difference = index - currentIndex;

      // Choose the shortest rotation
      if (difference > photos.length / 2) {
        difference -= photos.length;
      }

      if (difference < -photos.length / 2) {
        difference += photos.length;
      }

      return prev - difference * ANGLE;
    });

    setSelected(index);
  };

  // Mouse wheel
  const handleWheel = (event) => {
    event.preventDefault();

    const now = Date.now();

    if (now - lastWheelTime.current < 450) return;

    if (Math.abs(event.deltaY) > 5) {
      lastWheelTime.current = now;
      rotateGallery(event.deltaY > 0 ? -1 : 1);
    }
  };

  // Mobile swipe
  const handleTouchStart = (event) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    const difference =
      event.changedTouches[0].clientX - touchStart;

    if (Math.abs(difference) > 35) {
      rotateGallery(difference < 0 ? -1 : 1);
    }
  };

  return (
    <main className="gallery-world">

      {/* BACKGROUND */}
      <div className="gallery-background" />
      <div className="gallery-vignette" />
      <div className="gallery-grid-bg" />
      <div className="gallery-red-glow" />

      <div className="gallery-particles">
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 37 + 9) % 100}%`,
              top: `${(index * 53 + 7) % 100}%`,
              animationDelay: `${(index % 7) * 0.6}s`,
              animationDuration: `${3 + (index % 5)}s`,
            }}
          />
        ))}
      </div>

      {/* TOP BAR */}
      <header className="gallery-topbar">
        <div className="gallery-brand">
          <Zap size={15} />
          <span>LEVEL 21 / MEMORY ARCHIVE</span>
        </div>

        <div className="gallery-online">
          <i />
          SYSTEM ONLINE
        </div>
      </header>

      {/* HEADING */}
      <motion.header
        className="gallery-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p className="gallery-eyebrow">
          THE JOURNEY SO FAR
        </p>

        <h1>
          OUR <span>MEMORIES</span>
        </h1>

        <p className="gallery-subtitle">
          Every moment. Every memory. One unforgettable bond.
        </p>
      </motion.header>

      {/* 3D CYLINDER */}
      <section
        className="gallery-scene"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="gallery-floor-glow" />

        <div
          className="gallery-cylinder"
          style={{
            transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
          }}
        >
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              className={`gallery-photo ${
                selected === index ? "photo-selected" : ""
              }`}
              style={{
                transform: `
                  translate(-50%, -50%)
                  rotateY(${index * ANGLE}deg)
                  translateZ(var(--cylinder-radius))
                `,
              }}
              onClick={() => selectPhoto(index)}
              aria-label={`Select memory ${index + 1}`}
            >
              <div className="gallery-photo-inner">
                <img
                  src={photo.src}
                  alt={`Memory ${index + 1}`}
                  draggable="false"
                  onError={(event) => {
                    event.currentTarget.classList.add("image-error");
                    console.error(
                      "Image not found:",
                      event.currentTarget.src
                    );
                  }}
                />

                <div className="gallery-photo-shade" />

                <span className="gallery-photo-number">
                  MEMORY / 0{index + 1}
                </span>

                <span className="gallery-photo-corner">
                  ✦
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="gallery-ring gallery-ring-one" />
        <div className="gallery-ring gallery-ring-two" />
      </section>

      {/* CONTROLS */}
      <div className="gallery-controls">
        <button
          type="button"
          onClick={() => rotateGallery(1)}
          aria-label="Previous photo"
        >
          <ChevronLeft size={21} />
        </button>

        <p>
          {selected !== null
            ? `MEMORY 0${selected + 1} SELECTED`
            : "SWIPE / SCROLL TO EXPLORE"}
        </p>

        <button
          type="button"
          onClick={() => rotateGallery(-1)}
          aria-label="Next photo"
        >
          <ChevronRight size={21} />
        </button>
      </div>

      {/* CAPTION */}
      <AnimatePresence mode="wait">
        <motion.p
          className="gallery-caption"
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {selected !== null
            ? "A MEMORY THAT STAYS FOREVER."
            : "NINE MOMENTS. ONE UNBREAKABLE BOND."}
        </motion.p>
      </AnimatePresence>

      {/* NEXT */}
      <button
        type="button"
        className="gallery-next"
        onClick={() => onNext?.()}
      >
        NEXT SURPRISE
        <ChevronRight size={17} />
      </button>

      {/* FOOTER */}
      <div className="gallery-footer">
        <span>THE AWAKENING</span>
        <span>EST. 2005</span>
      </div>

      {/* EXPANDED PHOTO */}
      <AnimatePresence>
        {expandedPhoto && (
          <motion.div
            className="gallery-expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedPhoto(null)}
          >
            <button
              type="button"
              className="gallery-expanded-close"
              onClick={() => setExpandedPhoto(null)}
              aria-label="Close photo"
            >
              <X size={23} />
            </button>

            <motion.img
              src={expandedPhoto.src}
              alt="Selected memory"
              initial={{ scale: 0.75 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(event) => event.stopPropagation()}
            />

            <p>MEMORY UNLOCKED</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Play, Sparkles, ArrowRight } from "lucide-react";
import "./VideoMessage.css";

const hearts = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 100}%`,
  delay: `${(i % 6) * 1.2}s`,
  duration: `${9 + (i % 5) * 2}s`,
  size: `${14 + (i % 4) * 9}px`,
}));

const butterflies = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  left: `${(i * 23 + 8) % 95}%`,
  top: `${12 + (i * 13) % 75}%`,
  delay: `${i * 1.5}s`,
  duration: `${8 + (i % 3) * 2}s`,
}));

function VideoMessage({ onNext, onVideoStart, onVideoEnd }) {
  const [videoStarted, setVideoStarted] = useState(false);

  return (
    <main className="love-video-page">

      {/* Background */}
      <div className="love-bg-gradient" />
      <div className="love-bg-glow glow-one" />
      <div className="love-bg-glow glow-two" />
      <div className="love-bg-glow glow-three" />

      {/* Floating Hearts */}
      <div className="floating-hearts">
        {hearts.map((heart) => (
          <Heart
            key={heart.id}
            className="floating-heart"
            style={{
              left: heart.left,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
              width: heart.size,
              height: heart.size,
            }}
          />
        ))}
      </div>

      {/* Floating Butterflies */}
      <div className="butterfly-layer">
        {butterflies.map((butterfly) => (
          <div
            key={butterfly.id}
            className="butterfly"
            style={{
              left: butterfly.left,
              top: butterfly.top,
              animationDelay: butterfly.delay,
              animationDuration: butterfly.duration,
            }}
          >
            <span>🦋</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <section className="love-video-content">

        <motion.div
          className="love-top-label"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Sparkles size={15} />
          A MESSAGE FROM YOUR SISTER
          <Sparkles size={15} />
        </motion.div>

        <motion.div
          className="love-heading"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="love-small-heading">A LITTLE SOMETHING</p>

          <h1>
            Made With <span>Love</span>
          </h1>

          <p className="love-description">
            Some feelings are too special for words...
            So here's a little message just for you.
          </p>
        </motion.div>

        {/* 3D Video Frame */}
        <motion.div
          className="video-3d-scene"
          initial={{ opacity: 0, y: 70, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <div className="video-glow" />

          <div className="video-glass-frame">

            <div className="video-frame-top">
              <span>♡ SPECIAL MOMENT ♡</span>
              <span className="video-live-dot" />
            </div>

            <div className="video-screen">
              <video
                className="sister-video"
                src="/videos/video.mp4"
                controls
                playsInline
                preload="metadata"
                onPlay={() => {
                  setVideoStarted(true);
                  onVideoStart?.();
                }}
                onEnded={() => {
                  setVideoStarted(false);
                  onVideoEnd?.();
                }}
              />

              {!videoStarted && (
                <div className="video-screen-caption">
                  <Heart size={19} fill="currentColor" />
                  <span>A message made with love</span>
                </div>
              )}
            </div>

            <div className="video-frame-bottom">
              <span>FOREVER YOUR SISTER</span>
              <Heart size={17} fill="currentColor" />
            </div>

          </div>
        </motion.div>

        <motion.div
          className="love-bottom-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span>♡</span>
          No matter what, I'll always be there for you.
          <span>♡</span>
        </motion.div>

        {/* Next Button */}
        <motion.button
          className="love-next-button"
          onClick={onNext}
          whileHover={{ scale: 1.07, y: -4 }}
          whileTap={{ scale: 0.94 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Heart size={17} fill="currentColor" />
          NEXT
          <ArrowRight size={19} />
        </motion.button>

        <p className="love-next-caption">
          A little more love is waiting for you...
        </p>

      </section>
    </main>
  );
}

export default VideoMessage;

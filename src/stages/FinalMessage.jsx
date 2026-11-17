
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./FinalMessage.css";

const hearts = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  delay: (i % 8) * 0.7,
  duration: 8 + (i % 6) * 2,
  size: 14 + (i % 5) * 7,
}));

const butterflies = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${(i * 23 + 8) % 90}%`,
  delay: i * 1.8,
  duration: 12 + (i % 4) * 3,
}));

export default function FinalMessage() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="final-page">
      <div className="final-glow" />

      {/* Floating hearts */}
      <div className="final-hearts">
        {hearts.map((heart) => (
          <motion.span
            key={heart.id}
            className="floating-heart"
            style={{
              left: heart.left,
              fontSize: heart.size,
            }}
            initial={{ y: "110vh", opacity: 0, rotate: -20 }}
            animate={{
              y: "-15vh",
              opacity: [0, 0.8, 0.8, 0],
              rotate: [0, 20, -20, 10],
              x: [0, 25, -20, 15],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            ♥
          </motion.span>
        ))}
      </div>

      {/* Floating butterflies */}
      <div className="final-butterflies">
        {butterflies.map((butterfly) => (
          <motion.span
            key={butterfly.id}
            className="floating-butterfly"
            style={{ left: butterfly.left }}
            initial={{ y: "110vh", opacity: 0, rotate: -15 }}
            animate={{
              y: "-20vh",
              x: [0, 35, -25, 20, 0],
              rotate: [-15, 15, -10, 20, -15],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: butterfly.duration,
              delay: butterfly.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            🦋
          </motion.span>
        ))}
      </div>

      {/* Final birthday content */}
      <section className="final-content">
        <motion.div
          className="final-top-label"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          ✦ A SPECIAL DAY FOR A SPECIAL PERSON ✦
        </motion.div>

        <motion.div
          className="final-photo-frame"
          initial={{ opacity: 0, scale: 0.8, y: 35 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <div className="final-photo-inner">
            <img
              src="/images/finalimage.jpeg"
              alt="Birthday memory"
            />
          </div>
          <span className="photo-heart">♥</span>
        </motion.div>

        {showMessage && (
          <motion.div
            className="final-message"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="final-small-title">TODAY IS ALL ABOUT YOU</p>

            <h1>
              Happy Birthday,
              <span> Brother!</span>
            </h1>

            <div className="final-divider">
              <span>♥</span>
            </div>

            <p className="final-paragraph">
              No matter how much we fight, tease each other, or annoy one
              another, you'll always have a special place in my heart.
              I wish you a life filled with endless happiness, good health,
              success, and beautiful memories. Keep smiling, keep chasing
              your dreams, and never stop being the amazing person you are.
              May every day bring you a reason to smile and every year take
              you closer to everything you've wished for. Always stay happy
              and be blessed. Lots of love, little brother! ❤️
            </p>

            <motion.div
              className="final-signature"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              WITH LOVE, YOUR SISTER
              <span>♡</span>
            </motion.div>
          </motion.div>
        )}
      </section>

      <div className="final-bottom-text">
        MADE WITH LOVE · JUST FOR YOU
      </div>
    </main>
  );
}

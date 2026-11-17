
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Crosshair, Zap } from "lucide-react";
import "./BirthdayCard.css";

const sparks = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: `${(i * 29 + 7) % 100}%`,
  top: `${(i * 37 + 11) % 100}%`,
  delay: `${(i % 8) * 0.4}s`,
  duration: `${3 + (i % 5)}s`,
}));

function BirthdayCard({ onNext }) {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value += 1;
      setSpeed(value);

      if (value >= 21) {
        clearInterval(interval);
      }
    }, 65);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="level-birthday">

      {/* Background */}
      <div className="birthday-bg" />
      <div className="birthday-red-overlay" />
      <div className="birthday-smoke smoke-left" />
      <div className="birthday-smoke smoke-right" />

      {/* Existing bike image */}
      <div className="birthday-bike-background" />

      {/* Laser effects */}
      <div className="birthday-laser laser-one" />
      <div className="birthday-laser laser-two" />

      {/* Sparks */}
      <div className="birthday-sparks">
        {sparks.map((spark) => (
          <span
            key={spark.id}
            className="birthday-spark"
            style={{
              left: spark.left,
              top: spark.top,
              animationDelay: spark.delay,
              animationDuration: spark.duration,
            }}
          />
        ))}
      </div>

      {/* HUD */}
      <div className="birthday-hud">
        <span><Crosshair size={13} /> SYSTEM ONLINE</span>
        <span>MISSION 021</span>
      </div>

      <section className="birthday-main-content">

        {/* Top label */}
        <motion.div
          className="birthday-top-label"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Zap size={15} />
          SPECIAL BIRTHDAY TRANSMISSION
        </motion.div>

        {/* Speedometer */}
        <motion.div
          className="birthday-speedometer"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="speedometer-ring">
            <span className="speed-label">LEVEL</span>
            <strong>{String(speed).padStart(2, "0")}</strong>
            <span className="speed-unit">UNLOCKED</span>
          </div>
        </motion.div>

        {/* Birthday title */}
        <motion.div
          className="birthday-heading"
          initial={{ opacity: 0, scale: 0.65, rotateX: 35 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <p className="birthday-eyebrow">
            TODAY IS YOUR DAY
          </p>

          <h1>
            HAPPY
            <span>BIRTHDAY</span>
          </h1>

          <div className="birthday-title-underline" />
        </motion.div>

        {/* Name */}
        <motion.div
          className="birthday-name-block"
          initial={{ opacity: 0, y: 70, rotateX: 45 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: 1,
            duration: 1,
            type: "spring",
          }}
        >
          <div className="birthday-name-glow" />

          <div className="birthday-kutta">
            KUTTA
          </div>

          <div className="birthday-by">
            BY SEEMATTI
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          className="birthday-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ANOTHER YEAR. ANOTHER LEVEL.
        </motion.div>

        {/* Bottom status */}
        <motion.div
          className="birthday-status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
        >
          <span className="status-dot" />
          PLAYER 21 IS READY FOR THE NEXT MISSION
        </motion.div>

        {/* Next */}
        <motion.button
          className="birthday-next-btn"
          onClick={onNext}
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.94 }}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          CONTINUE
          <ArrowRight size={19} />
        </motion.button>

      </section>

      <div className="birthday-bottom-hud">
        <span>LEVEL 21</span>
        <span>THE AWAKENING</span>
        <span>EST. 2005</span>
      </div>

    </main>
  );
}

export default BirthdayCard;

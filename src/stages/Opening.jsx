
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Opening.css";

function Opening({ onUnlock }) {
  const sceneRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    const bodyTouch = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      timelineRef.current = tl;

      // 1. BLACK SCREEN - RED SIGNAL
      tl.to(".red-signal", {
        opacity: 1,
        scale: 1.5,
        duration: 1.2,
        ease: "power2.out",
      });

      tl.to(".red-signal", {
        scale: 2.5,
        duration: 0.5,
        repeat: 1,
        yoyo: true,
      });

      tl.to(".red-beam", {
        opacity: 1,
        scaleX: 1,
        duration: 0.5,
      });

      // 2. BIKE REVEAL
      tl.to(".bike-scene", {
        opacity: 1,
        duration: 0.3,
      });

      tl.fromTo(
        ".bike-image",
        { x: "100%", scale: 1.3, opacity: 0 },
        {
          x: "0%",
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: "power4.out",
        }
      );

      tl.to(".bike-image", {
        scale: 1.12,
        duration: 1.1,
        ease: "power1.inOut",
      });

      tl.to(".bike-light", {
        opacity: 1,
        duration: 0.15,
        repeat: 3,
        yoyo: true,
      }, "-=0.8");

      // 3. ANIME EYE REVEAL
      tl.to(".bike-scene", {
        opacity: 0,
        duration: 0.25,
      });

      tl.to(".eye-scene", {
        opacity: 1,
        duration: 0.2,
      });

      tl.fromTo(
        ".eye-image",
        { scale: 1.7, opacity: 0, filter: "brightness(0.2) blur(12px)" },
        {
          scale: 1,
          opacity: 1,
          filter: "brightness(1) blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        }
      );

      tl.to(".eye-image", {
        scale: 1.12,
        duration: 0.7,
        ease: "power1.inOut",
      });

      tl.to(".eye-glow", {
        opacity: 1,
        duration: 0.2,
        repeat: 2,
        yoyo: true,
      });

      // 4. SPEEDOMETER 00 TO 21
      tl.to(".eye-scene", {
        opacity: 0,
        duration: 0.25,
      });

      tl.to(".speed-scene", {
        opacity: 1,
        duration: 0.2,
      });

      const counter = { value: 0 };

      tl.to(counter, {
        value: 21,
        duration: 2,
        snap: { value: 1 },
        ease: "power2.inOut",
        onUpdate: () => {
          const number = document.querySelector(".speed-number");
          if (number) {
            number.textContent = String(
              Math.round(counter.value)
            ).padStart(2, "0");
          }
        },
      });

      tl.to(".speed-number", {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });

      // 5. IMPACT + GLASS SHATTER
      tl.to(".impact-flash", {
        opacity: 1,
        duration: 0.08,
      });

      tl.to(".impact-flash", {
        opacity: 0,
        duration: 0.4,
      });

      tl.to(".speed-scene", {
        opacity: 0,
        duration: 0.15,
      });

      tl.to(".shatter-layer", {
        opacity: 1,
        duration: 0.1,
      });

      tl.fromTo(
        ".shard",
        { x: 0, y: 0, rotation: 0, opacity: 0, scale: 0.2 },
        {
          x: (i) => (i % 2 === 0 ? 170 : -170),
          y: (i) => (i % 3 === 0 ? 190 : -190),
          rotation: (i) => i * 40,
          opacity: 1,
          scale: 1.5,
          duration: 0.8,
          stagger: 0.025,
          ease: "power3.out",
        }
      );

      // 6. FINAL TITLE
      tl.to(".final-scene", {
        opacity: 1,
        duration: 0.3,
      });

      tl.fromTo(
        ".final-title",
        { y: 60, scale: 0.7, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.7)",
        }
      );

      tl.fromTo(
        ".final-subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      );

      tl.fromTo(
        ".start-button",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.2"
      );
    }, sceneRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = bodyOverflow;
      document.body.style.touchAction = bodyTouch;
    };
  }, []);

  const replayOpening = () => {
    timelineRef.current?.restart();
  };

  return (
    <main className="opening-container" ref={sceneRef}>
      <div className="cinema-grain" />
      <div className="vignette" />

      {/* RED SIGNAL */}
      <section className="signal-scene">
        <div className="red-signal" />
        <div className="red-beam" />
        <p className="signal-text">GIFT INITIALIZING</p>
      </section>

      {/* BIKE SCENE */}
      <section className="bike-scene">
        <div className="bike-light" />

        <img
          className="bike-image"
          src="/images/bike.png"
          alt="Cinematic superbike"
          draggable="false"
        />

        <div className="bike-overlay" />
        <p className="scene-label">THE MACHINE AWAKENS</p>
      </section>

      {/* ANIME EYE */}
      <section className="eye-scene">
        <img
          className="eye-image"
          src="/images/anime-eye.png"
          alt="Anime eye with glowing red iris"
          draggable="false"
        />

        <div className="eye-glow" />
        <p className="eye-label">AWAKEN YOUR POWER</p>
      </section>

      {/* SPEEDOMETER */}
      <section className="speed-scene">
        <div className="speed-ring">
          <div className="speed-inner">
            <p className="speed-heading">SYSTEM OVERDRIVE</p>
            <span className="speed-number">00</span>
            <span className="speed-level">LEVEL</span>
            <div className="speed-line" />
            <p className="speed-caption">LIMIT BREAKING</p>
          </div>
        </div>
      </section>

      {/* GLASS SHATTER */}
      <div className="shatter-layer">
        {Array.from({ length: 20 }, (_, i) => (
          <span className="shard" key={i} />
        ))}
      </div>

      <div className="impact-flash" />

      {/* FINAL SCREEN */}
      <section className="final-scene">
        <p className="final-eyebrow">A NEW ERA BEGINS</p>

        <h1 className="final-title">
          LEVEL <span>21</span>
          <strong>UNLOCKED</strong>
        </h1>

        <div className="final-divider" />

        <p className="final-subtitle">
          YOUR NEXT CHAPTER STARTS NOW
        </p>

      <button
  className="start-button"
  onClick={onUnlock}
>
  GIFT UNLOCK
</button>
      </section>

      <p className="corner-mark">MEMORA / 21</p>
      <p className="bottom-mark">THE AWAKENING EXPERIENCE</p>
    </main>
  );
}

export default Opening;

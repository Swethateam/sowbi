import { useState, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  Trophy,
  RotateCcw,
  Lock,
} from "lucide-react";
import "./MiniGame.css";

const TOTAL_GIFTS = 10;
const TARGET_GIFTS = 9;

function RacingBike() {
  const { scene } = useGLTF("/models/sport-motorcycle.glb");

  const bike = scene.clone();

  return (
    <group
      position={[0, -0.8, 0]}
      rotation={[0, Math.PI / 2, 0]}
      scale={1.2}
    >
      <primitive object={bike} />
    </group>
  );
}
function BikeScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.1, 5.8], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[3, 5, 5]} intensity={2.5} />
      <directionalLight position={[-3, 2, -3]} intensity={1.5} />
      <pointLight position={[0, 2, 2]} color="#ff1744" intensity={2} />

      <Suspense fallback={null}>
        <RacingBike />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/racing-bike.glb");

export default function MiniGame({ onNext }) {
  const [gameStatus, setGameStatus] = useState("ready");
  const [lane, setLane] = useState(1);
  const [objects, setObjects] = useState([]);
  const [collected, setCollected] = useState(0);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(90);
  const [soundOn, setSoundOn] = useState(true);

  const gameRef = useRef({});
  const soundRef = useRef(true);
  const engineRef = useRef(null);
  const collectRef = useRef(null);
  const crashRef = useRef(null);
  const unlockRef = useRef(null);

  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    engineRef.current = new Audio("/audio/bike-engine.mp3");
    collectRef.current = new Audio("/audio/gift-collect.mp3");
    crashRef.current = new Audio("/audio/bike-crash.mp3");
    unlockRef.current = new Audio("/audio/key-unlock.mp3");

    if (engineRef.current) {
      engineRef.current.loop = true;
      engineRef.current.volume = 0.35;
    }

    return () => {
      [
        engineRef.current,
        collectRef.current,
        crashRef.current,
        unlockRef.current,
      ].forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, []);

  const playSound = useCallback((ref) => {
    if (!soundRef.current || !ref.current) return;

    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  }, []);

  const stopEngine = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.pause();
      engineRef.current.currentTime = 0;
    }
  }, []);

  const startGame = () => {
    stopEngine();

    gameRef.current = {
      lane: 1,
      objects: [],
      collected: 0,
      score: 0,
      distance: 0,
      spawnedGifts: 0,
      tick: 0,
      lastTime: 0,
      giftTimer: 0,
      obstacleTimer: 0,
      obstaclesSpawned: 0,
      finished: false,
    };

    setLane(1);
    setObjects([]);
    setCollected(0);
    setScore(0);
    setDistance(0);
    setSpeed(90);
    setGameStatus("playing");

    if (soundRef.current && engineRef.current) {
      engineRef.current.currentTime = 0;
      engineRef.current.play().catch(() => {});
    }
  };

  const moveBike = useCallback((direction) => {
    if (gameStatus !== "playing") return;

    const game = gameRef.current;
    const nextLane = Math.max(0, Math.min(2, game.lane + direction));

    game.lane = nextLane;
    setLane(nextLane);
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    let animationFrame;
    let lastRender = 0;

    const updateGame = (time) => {
      const game = gameRef.current;

      if (!game.lastTime) game.lastTime = time;

      const delta = Math.min((time - game.lastTime) / 1000, 0.05);
      game.lastTime = time;

      game.tick += delta;
      game.distance += delta * 12;
      game.score += delta * 8;

      // Gift spawning: 10 gifts total, spaced comfortably.
      game.giftTimer += delta;

      if (
        game.giftTimer >= 1.45 &&
        game.spawnedGifts < TOTAL_GIFTS
      ) {
        game.giftTimer = 0;
        game.spawnedGifts += 1;

        game.objects.push({
          id: `${game.spawnedGifts}-gift`,
          type: "gift",
          lane: Math.floor(Math.random() * 3),
          y: -8,
        });
      }

      // Only a few obstacles, with plenty of time to react.
      game.obstacleTimer += delta;

      if (
        game.obstacleTimer >= 5 &&
        game.obstaclesSpawned < 3 &&
        game.spawnedGifts >= 3
      ) {
        game.obstacleTimer = 0;
        game.obstaclesSpawned += 1;

        game.objects.push({
          id: `obstacle-${game.obstaclesSpawned}`,
          type: "obstacle",
          lane: Math.floor(Math.random() * 3),
          y: -8,
        });
      }

      let crashed = false;
      const remaining = [];

      game.objects.forEach((item) => {
        const nextY = item.y + delta * 31;

        // Generous gift collection area:
        // adjacent lane also counts as a light touch.
        if (
          item.type === "gift" &&
          nextY >= 70 &&
          nextY <= 101 &&
          Math.abs(item.lane - game.lane) <= 1
        ) {
          game.collected += 1;
          game.score += 100;
          playSound(collectRef);
          return;
        }

        // Obstacles only cause a crash on a very close hit.
        if (
          item.type === "obstacle" &&
          nextY >= 82 &&
          nextY <= 94 &&
          item.lane === game.lane
        ) {
          crashed = true;
          return;
        }

        if (nextY <= 105) {
          remaining.push({ ...item, y: nextY });
        }
      });

      game.objects = remaining;

      if (crashed && !game.finished) {
        game.finished = true;
        stopEngine();
        playSound(crashRef);
        setGameStatus("crashed");
        return;
      }

      if (game.collected >= TARGET_GIFTS && !game.finished) {
        game.finished = true;
        stopEngine();
        playSound(unlockRef);
        setGameStatus("won");
        return;
      }

      const allGiftsPassed =
        game.spawnedGifts === TOTAL_GIFTS &&
        !game.objects.some((item) => item.type === "gift");

      if (allGiftsPassed && !game.finished) {
        game.finished = true;
        stopEngine();
        setGameStatus("finished");
        return;
      }

      // Update React UI around 30 times per second.
      if (time - lastRender >= 33) {
        lastRender = time;
        setObjects([...game.objects]);
        setCollected(game.collected);
        setScore(Math.floor(game.score));
        setDistance(Math.floor(game.distance));
        setSpeed(Math.min(160, 90 + Math.floor(game.distance / 15)));
      }

      animationFrame = requestAnimationFrame(updateGame);
    };

    animationFrame = requestAnimationFrame(updateGame);

    return () => cancelAnimationFrame(animationFrame);
  }, [gameStatus, playSound, stopEngine]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        moveBike(-1);
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        moveBike(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveBike]);

  const unlockGift = () => {
    stopEngine();
    onNext?.();
  };

  return (
    <main className="mission-game">
      <header className="race-topbar">
        <div>
          <span className="race-eyebrow">LEVEL 21 / MISSION 06</span>
          <h1>GIFT <span>RUSH</span></h1>
        </div>

        <div className="race-top-actions">
          <button
            className="sound-toggle"
            onClick={() => setSoundOn((value) => !value)}
          >
            {soundOn ? "SOUND ON" : "SOUND OFF"}
          </button>
          <span className="race-live">● LIVE RACE</span>
        </div>
      </header>

      <section className="race-hud">
        <div className="hud-box">
          <span>SPEED</span>
          <strong>{speed}<small> KM/H</small></strong>
        </div>

        <div className="hud-box">
          <span>DISTANCE</span>
          <strong>{distance}<small> M</small></strong>
        </div>

        <div className="hud-box">
          <span>SCORE</span>
          <strong>{score}</strong>
        </div>

        <div className="hud-box gift-hud">
          <span>GIFTS</span>
          <strong>{collected}<small> / 9</small></strong>
        </div>
      </section>

      <section className="race-track">
        <div className="track-road">
          <div className="road-line road-line-one" />
          <div className="road-line road-line-two" />

          <div className="track-side track-side-left" />
          <div className="track-side track-side-right" />

          {objects.map((item) => (
            <div
              key={item.id}
              className={`race-object ${item.type}`}
              style={{
                left: `${16.67 + item.lane * 33.33}%`,
                top: `${item.y}%`,
              }}
            >
              {item.type === "gift" ? (
                <div className="gift-box">🎁</div>
              ) : (
                <div className="road-barrier">⚠</div>
              )}
            </div>
          ))}

          <div
            className="race-player"
            style={{ left: `${16.67 + lane * 33.33}%` }}
          >
            <div className="race-bike-shadow" />
            <div className="race-bike-3d">
              <BikeScene />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {gameStatus === "ready" && (
            <motion.div
              className="race-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mission-panel">
                <span className="mission-tag">MISSION 06</span>
                <h2>THE GIFT <span>RUSH</span></h2>
                <p>
                  Collect any 9 gifts out of 10.
                  Just get close to a gift to collect it!
                </p>

                <div className="mission-rule">
                  <span>←</span> MOVE LEFT
                  <span>→</span> MOVE RIGHT
                </div>

                <button className="race-main-button" onClick={startGame}>
                  START ENGINE <Zap size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {gameStatus === "won" && (
            <motion.div
              className="race-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mission-panel result-panel">
                <Trophy size={48} className="result-trophy" />
                <span className="mission-tag">MISSION COMPLETE</span>
                <h2>GIFT KEY <span>ACQUIRED!</span></h2>
                <p>YOU COLLECTED YOUR GIFT KEY!</p>
                <div className="key-visual">🔑</div>
                <button className="race-main-button" onClick={unlockGift}>
                  <Lock size={17} /> UNLOCK GIFT
                </button>
              </div>
            </motion.div>
          )}

          {gameStatus === "crashed" && (
            <motion.div
              className="race-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mission-panel result-panel">
                <span className="mission-tag">RACE INTERRUPTED</span>
                <h2>BIKE <span>CRASHED!</span></h2>
                <p>Try again. You are getting closer!</p>
                <button className="race-main-button" onClick={startGame}>
                  <RotateCcw size={18} /> RETRY RACE
                </button>
              </div>
            </motion.div>
          )}

          {gameStatus === "finished" && (
            <motion.div
              className="race-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mission-panel result-panel">
                <span className="mission-tag">ALMOST THERE!</span>
                <h2>ONE MORE <span>RACE</span></h2>
                <p>
                  You collected {collected} gifts.
                  Collect 9 gifts to unlock your key.
                </p>
                <button className="race-main-button" onClick={startGame}>
                  <RotateCcw size={18} /> TRY AGAIN
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="race-bottom">
        <div className="gift-progress">
          <div className="progress-heading">
            <span>GIFT COLLECTION</span>
            <strong>{collected} / 9</strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, (collected / 9) * 100)}%`,
              }}
            />
          </div>

          <span className="progress-hint">
            COLLECT 9 GIFTS TO UNLOCK YOUR FINAL GIFT
          </span>
        </div>

        <div className="race-controls">
          <button
            className="control-button"
            onClick={() => moveBike(-1)}
            disabled={gameStatus !== "playing"}
            aria-label="Move bike left"
          >
            <ArrowLeft />
          </button>

          <span>STEER</span>

          <button
            className="control-button"
            onClick={() => moveBike(1)}
            disabled={gameStatus !== "playing"}
            aria-label="Move bike right"
          >
            <ArrowRight />
          </button>
        </div>
      </footer>
    </main>
  );
}
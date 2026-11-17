
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ImagePlus,
  ArrowRight,
  CheckCircle2,
  Crosshair,
  ScanLine,
  ShieldCheck,
  RotateCcw,
  X,
  RefreshCw,
} from "lucide-react";
import "./GiftFinder.css";

const TOTAL_GIFTS = 14;

function GiftFinder({ onNext }) {
  const [giftNumber, setGiftNumber] = useState(1);
  const [step, setStep] = useState("find");
  const [photo, setPhoto] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [streamReady, setStreamReady] = useState(false);

  const cameraInput = useRef(null);
  const galleryInput = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Keep the page fixed and stop mobile overscroll.
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const oldOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = oldOverflow;
      document.body.style.overscrollBehavior = oldOverscroll;
      stopCamera();
      if (photo) URL.revokeObjectURL(photo);
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStreamReady(false);
  };

  const openCamera = async () => {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera is not available. Open this page using localhost or HTTPS and try again."
      );
      setCameraOpen(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);

      // Wait for the camera dialog to render before attaching the stream.
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });

      setStreamReady(true);
    } catch (error) {
      let message = "Unable to open camera. Please check camera permission.";

      if (error.name === "NotAllowedError") {
        message = "Camera permission denied. Allow camera access in your browser settings.";
      } else if (error.name === "NotFoundError") {
        message = "No camera was found on this device.";
      } else if (error.name === "NotReadableError") {
        message = "Camera is being used by another application. Close it and try again.";
      }

      setCameraError(message);
      setCameraOpen(true);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const imageUrl = URL.createObjectURL(blob);

      setPhoto((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return imageUrl;
      });

      stopCamera();
      setCameraOpen(false);
      setStep("preview");
    }, "image/jpeg", 0.9);
  };

  const closeCamera = () => {
    stopCamera();
    setCameraOpen(false);
    setCameraError("");
  };

  const handleGalleryPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPhoto((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return imageUrl;
    });

    setStep("preview");
  };

  const removePhoto = () => {
    if (photo) URL.revokeObjectURL(photo);
    setPhoto(null);
    setStep("upload");

    if (galleryInput.current) galleryInput.current.value = "";
  };

  const collectGift = () => {
    if (!photo) return;
    setStep("success");
  };

  const nextMission = () => {
    if (giftNumber === TOTAL_GIFTS) {
      onNext?.();
      return;
    }

    if (photo) URL.revokeObjectURL(photo);

    setPhoto(null);
    setGiftNumber((number) => number + 1);
    setStep("find");

    if (galleryInput.current) galleryInput.current.value = "";
  };

  const progress = (giftNumber / TOTAL_GIFTS) * 100;

  return (
    <main className="gift-mission-page">
      <div className="gift-mission-bg" />
      <div className="gift-mission-grid" />
      <div className="gift-mission-glow gift-glow-one" />
      <div className="gift-mission-glow gift-glow-two" />

      <header className="gift-mission-top">
        <div className="mission-brand">
          <Crosshair size={19} />
          <span>LEVEL 21 <b>/</b> GIFT HUNT</span>
        </div>

        <div className="mission-count">
          MISSION <strong>{String(giftNumber).padStart(2, "0")}</strong>
          <span>/ 14</span>
        </div>
      </header>

      <div className="mission-progress">
        <div
          className="mission-progress-fill"
          style={{
            width: `${step === "success" ? progress : ((giftNumber - 1) / TOTAL_GIFTS) * 100}%`,
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === "find" && (
          <motion.section
            key={`find-${giftNumber}`}
            className="mission-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mission-eyebrow">
              <span className="mission-dot" />
              NEW OBJECTIVE
            </div>

            <div className="mission-number">
              {String(giftNumber).padStart(2, "0")}
            </div>

            <h1>
              FIND YOUR
              <span>GIFT {String(giftNumber).padStart(2, "0")}</span>
            </h1>

            <p className="mission-description">
              Find the physical gift marked with number{" "}
              <strong>{String(giftNumber).padStart(2, "0")}</strong>.
              Your next surprise is waiting.
            </p>

            <div className="mission-instruction">
              <ScanLine size={20} />
              <span>SEARCH. FIND. COLLECT.</span>
            </div>

            <button
              className="mission-primary-button"
              onClick={() => setStep("upload")}
            >
              OK, LET'S FIND IT <ArrowRight size={19} />
            </button>
          </motion.section>
        )}

        {step === "upload" && (
          <motion.section
            key={`upload-${giftNumber}`}
            className="mission-content upload-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <div className="mission-eyebrow">
              <span className="mission-dot" />
              OBJECTIVE IN PROGRESS
            </div>

            <div className="upload-icon-ring">
              <Camera size={43} strokeWidth={1.4} />
            </div>

            <h1>
              UPLOAD YOUR
              <span>GIFT PHOTO</span>
            </h1>

            <p className="mission-description">
              Found Gift {String(giftNumber).padStart(2, "0")}?
              Take a photo of it to continue.
            </p>

            <div className="upload-actions">
              <button
                className="mission-primary-button"
                onClick={openCamera}
              >
                <Camera size={20} /> OPEN CAMERA
              </button>

              <button
                className="mission-secondary-button"
                onClick={() => galleryInput.current?.click()}
              >
                <ImagePlus size={20} /> CHOOSE FROM GALLERY
              </button>
            </div>

            <input
              ref={galleryInput}
              className="mission-file-input"
              type="file"
              accept="image/*"
              onChange={handleGalleryPhoto}
            />

            <div className="upload-note">
              <ShieldCheck size={15} />
              PHOTO REQUIRED TO CONTINUE
            </div>
          </motion.section>
        )}

        {step === "preview" && photo && (
          <motion.section
            key={`preview-${giftNumber}`}
            className="mission-content preview-content"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <div className="mission-eyebrow">
              <span className="mission-dot" />
              PHOTO RECEIVED
            </div>

            <h1>
              CONFIRM YOUR
              <span>GIFT {String(giftNumber).padStart(2, "0")}</span>
            </h1>

            <div className="photo-preview-frame">
              <img src={photo} alt="Your gift photo preview" />
              <div className="photo-frame-label">PHOTO PREVIEW</div>
            </div>

            <p className="mission-description">
              Your photo is ready. Confirm to collect this gift.
            </p>

            <div className="preview-actions">
              <button
                className="mission-secondary-button"
                onClick={removePhoto}
              >
                <RotateCcw size={17} /> RETAKE
              </button>

              <button
                className="mission-primary-button"
                onClick={collectGift}
              >
                COLLECT GIFT <ArrowRight size={19} />
              </button>
            </div>
          </motion.section>
        )}

        {step === "success" && (
          <motion.section
            key={`success-${giftNumber}`}
            className="mission-content success-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="success-icon">
              <CheckCircle2 size={62} />
            </div>

            <div className="mission-eyebrow success-eyebrow">
              MISSION COMPLETED
            </div>

            <h1>
              GIFT
              <span>COLLECTED!</span>
            </h1>

            <p className="mission-description">
              GIFT {String(giftNumber).padStart(2, "0")} SUCCESSFULLY COLLECTED.
              {giftNumber === TOTAL_GIFTS
                ? " You found all 14 gifts!"
                : " Your next mission is ready."}
            </p>

            <div className="collected-stamp">
              <CheckCircle2 size={17} />
              GIFT {String(giftNumber).padStart(2, "0")} — COLLECTED
            </div>

            <div className="success-progress">
              <span>
                GIFTS COLLECTED
                <strong>{giftNumber} / {TOTAL_GIFTS}</strong>
              </span>
              <div className="success-progress-track">
                <div style={{ width: `${progress}%` }} />
              </div>
            </div>

            <button
              className="mission-primary-button"
              onClick={nextMission}
            >
              {giftNumber === TOTAL_GIFTS
                ? "GO TO FINAL MESSAGE"
                : "NEXT MISSION"}
              <ArrowRight size={19} />
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="mission-footer">
        <span>MISSION CONTROL</span>
        <span>14 GIFTS. ONE BIG SURPRISE.</span>
      </footer>

      {/* LIVE CAMERA MODAL */}
      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            className="camera-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="camera-modal-card">
              <div className="camera-modal-header">
                <span><Camera size={18} /> LIVE CAMERA</span>
                <button onClick={closeCamera} aria-label="Close camera">
                  <X size={22} />
                </button>
              </div>

              {cameraError ? (
                <div className="camera-error">
                  <Camera size={38} />
                  <p>{cameraError}</p>
                  <button
                    className="mission-secondary-button"
                    onClick={() => {
                      closeCamera();
                      openCamera();
                    }}
                  >
                    <RefreshCw size={17} /> TRY AGAIN
                  </button>
                </div>
              ) : (
                <>
                  <div className="live-camera-frame">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                    />
                    {!streamReady && (
                      <div className="camera-loading">
                        Starting camera...
                      </div>
                    )}
                    <div className="camera-corner camera-corner-tl" />
                    <div className="camera-corner camera-corner-tr" />
                    <div className="camera-corner camera-corner-bl" />
                    <div className="camera-corner camera-corner-br" />
                  </div>

                  <button
                    className="camera-capture-button"
                    onClick={capturePhoto}
                    disabled={!streamReady}
                  >
                    <span />
                    TAKE PHOTO
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default GiftFinder;


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
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);

  const galleryInput = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const photoRef = useRef(null);

  // Keep this page fixed while it is active.
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const oldOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = oldOverflow;
      document.body.style.overscrollBehavior = oldOverscroll;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (photoRef.current) {
        URL.revokeObjectURL(photoRef.current);
        photoRef.current = null;
      }
    };
  }, []);

  // Attach the stream only after the camera modal and video element exist.
  useEffect(() => {
    if (!cameraOpen || !cameraStream || !videoRef.current) return;

    const video = videoRef.current;
    video.srcObject = cameraStream;

    const handleReady = async () => {
      try {
        await video.play();

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          setCameraReady(true);
        }
      } catch {
        setCameraError("Unable to start video preview. Please try again.");
      }
    };

    video.addEventListener("loadedmetadata", handleReady);

    if (video.readyState >= 1) {
      handleReady();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleReady);
      video.pause();
      video.srcObject = null;
    };
  }, [cameraOpen, cameraStream]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraStream(null);
    setCameraReady(false);
  };

  const setNewPhoto = (imageUrl) => {
    if (photoRef.current) {
      URL.revokeObjectURL(photoRef.current);
    }

    photoRef.current = imageUrl;
    setPhoto(imageUrl);
  };

  const openCamera = async () => {
    setCameraError("");
    setCameraReady(false);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera is unavailable. Open this website using HTTPS or localhost."
      );
      setCameraOpen(true);
      return;
    }

    try {
      // Request permission and open the camera.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraStream(stream);
      setCameraOpen(true);
    } catch (error) {
      let message = "Unable to open camera. Please check camera permission.";

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        message = "Camera permission denied. Allow camera access in browser settings.";
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        message = "No camera was found on this device.";
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        message = "Camera is being used by another application. Close it and try again.";
      } else if (error.name === "SecurityError") {
        message = "Camera requires a secure HTTPS connection or localhost.";
      }

      setCameraError(message);
      setCameraOpen(true);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError("Camera is not ready yet. Please wait a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Unable to capture photo. Please try again.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Photo capture failed. Please try again.");
          return;
        }

        const imageUrl = URL.createObjectURL(blob);

        setNewPhoto(imageUrl);
        stopCamera();
        setCameraOpen(false);
        setCameraError("");
        setStep("preview");
      },
      "image/jpeg",
      0.92
    );
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

    setNewPhoto(URL.createObjectURL(file));
    setStep("preview");
  };

  const removePhoto = () => {
    if (photoRef.current) {
      URL.revokeObjectURL(photoRef.current);
      photoRef.current = null;
    }

    setPhoto(null);
    setStep("upload");

    if (galleryInput.current) {
      galleryInput.current.value = "";
    }
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

    if (photoRef.current) {
      URL.revokeObjectURL(photoRef.current);
      photoRef.current = null;
    }

    setPhoto(null);
    setGiftNumber((number) => number + 1);
    setStep("find");

    if (galleryInput.current) {
      galleryInput.current.value = "";
    }
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
            width: `${
              step === "success"
                ? progress
                : ((giftNumber - 1) / TOTAL_GIFTS) * 100
            }%`,
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
                type="button"
                className="mission-primary-button"
                onClick={openCamera}
              >
                <Camera size={20} /> OPEN CAMERA
              </button>

              <button
                type="button"
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
                type="button"
                className="mission-secondary-button"
                onClick={removePhoto}
              >
                <RotateCcw size={17} /> RETAKE
              </button>

              <button
                type="button"
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
              type="button"
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

      {/* CAMERA MODAL */}
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
                <span>
                  <Camera size={18} /> LIVE CAMERA
                </span>

                <button
                  type="button"
                  onClick={closeCamera}
                  aria-label="Close camera"
                >
                  <X size={22} />
                </button>
              </div>

              {cameraError ? (
                <div className="camera-error">
                  <Camera size={38} />
                  <p>{cameraError}</p>

                  <button
                    type="button"
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

                    {!cameraReady && (
                      <div className="camera-loading">
                        <div className="camera-spinner" />
                        <span>STARTING CAMERA...</span>
                      </div>
                    )}

                    <div className="camera-corner camera-corner-tl" />
                    <div className="camera-corner camera-corner-tr" />
                    <div className="camera-corner camera-corner-bl" />
                    <div className="camera-corner camera-corner-br" />
                  </div>

                  <button
                    type="button"
                    className="camera-capture-button"
                    onClick={capturePhoto}
                    disabled={!cameraReady}
                  >
                    <span className="camera-shutter-icon" />
                    {cameraReady ? "TAKE PHOTO" : "STARTING CAMERA..."}
                  </button>

                  <p className="camera-help-text">
                    Position your gift inside the frame and capture
                  </p>
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

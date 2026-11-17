
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import "./Password.css";

function Password({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");

  const correctPassword = "LOVE21";

  const handleUnlock = (e) => {
    e.preventDefault();

    if (password.trim().toUpperCase() === correctPassword) {
      setStatus("success");

      setTimeout(() => {
        onSuccess();
      }, 1200);

    } else {
      setStatus("error");

      setTimeout(() => {
        setStatus("idle");
      }, 1200);
    }
  };

  return (
    <main className="password-container">
      <div className="password-background" />
      <div className="password-grid" />
      <div className="password-vignette" />

      <div className="password-red-light" />

      <motion.div
        className="mechanical-ring ring-one"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="mechanical-ring ring-two"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <div className="scanner-line" />

      <div className="password-content">
        <motion.div
          className="access-header"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="access-top-label">GIFT SECURITY SYSTEM</span>
          <h1>SECRET <span>ACCESS</span></h1>
          <p>RECEIVER IDENTITY VERIFICATION</p>
        </motion.div>

        <motion.div
          className="access-card"
          initial={{ opacity: 0, scale: 0.85, y: 35 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="card-top-line" />

          <div className="lock-icon">
            <LockKeyhole size={30} />
          </div>

          <p className="card-eyebrow">RESTRICTED AREA</p>
          <h2>UNLOCK YOUR <span>GIFT</span></h2>
          <p className="card-description">
            Only the chosen one knows the secret.
          </p>

          <form onSubmit={handleUnlock}>
            <label htmlFor="secret-password">
              ENTER SECRET PASSWORD
            </label>

            <div className={`password-input-wrapper ${status}`}>
              <input
                id="secret-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter access code"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setStatus("idle");
                }}
                autoComplete="off"
              />

              <button
                type="button"
                className="password-eye-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {status === "error" && (
                <motion.p
                  className="access-error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ACCESS DENIED — INVALID CODE
                </motion.p>
              )}

              {status === "success" && (
                <motion.p
                  className="access-success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ShieldCheck size={17} />
                  ACCESS GRANTED
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="access-button"
              whileTap={{ scale: 0.96 }}
              disabled={status === "success"}
            >
              {status === "success" ? "ACCESS GRANTED" : "INITIATE ACCESS"}
              <span> →</span>
            </motion.button>
          </form>

          <div className="card-footer">
            <span>ENCRYPTION: ACTIVE</span>
            <span>LEVEL 21</span>
          </div>
        </motion.div>

        <motion.p
          className="password-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.2 }}
        >
          UNAUTHORIZED ACCESS IS PROHIBITED
        </motion.p>
      </div>

      <div className="password-corner">MEMORA / 21</div>
    </main>
  );
}

export default Password;

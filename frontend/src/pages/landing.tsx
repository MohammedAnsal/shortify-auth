import { motion, AnimatePresence } from "framer-motion";
import { FaLink } from "react-icons/fa";
import { useEffect, useState } from "react";

// Gradient background with a soft white overlay
const themeGradient =
  "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 40%, #06beb6 100%, #3b82f6 100%)";

const flipWords = [
  "Short & Sweet!",
  "Shareable!",
  "Secure!",
  "Fast!",
  "Free!",
];

export const Landing = () => {
  const [flipIndex, setFlipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipIndex((prev) => (prev + 1) % flipWords.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: themeGradient,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#222",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 0.08, x: 0 }}
            transition={{ delay: i * 0.15, duration: 1.5, type: "spring" }}
            style={{
              position: "absolute",
              top: `${i * 12.5}%`,
              left: 0,
              width: "100%",
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, #06beb6 50%, transparent 100%)",
            }}
          />
        ))}
      </div>

      {/* Glassy animated container */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.3 }}
        style={{
          background: "rgba(255,255,255,0.85)",
          borderRadius: "2rem",
          padding: "3rem 2.5rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          textAlign: "center",
          maxWidth: 420,
          width: "90vw",
          zIndex: 1,
          backdropFilter: "blur(8px)",
        }}
      >
        <motion.div
          initial={{ rotate: -20, scale: 0.7 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <FaLink size={60} style={{ verticalAlign: "middle", color: "#06beb6" }} />
        </motion.div>
        <motion.h1
          initial={false}
          animate={{ color: "#222" }}
          style={{
            fontSize: "2.1rem",
            fontWeight: 900,
            margin: 0,
            letterSpacing: "-1px",
            minHeight: "3.2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "none",
          }}
        >
          Make Your Links&nbsp;
          <span style={{ display: "inline-block", minWidth: 120 }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={flipIndex}
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: "inline-block",
                  background:
                    "linear-gradient(90deg, #06beb6 0%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: 900,
                }}
              >
                {flipWords[flipIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          style={{
            fontSize: "1.1rem",
            margin: "1.2rem 0 2.2rem",
            color: "#222",
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          Transform long, messy URLs into short, beautiful links.<br />
          Fast, secure, and always free.{" "}
          <span style={{ color: "#06beb6", fontWeight: 700 }}>
            Start shortening now!
          </span>
        </motion.p>
        <motion.a
          href="/auth/signIn"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "inline-block",
            padding: "1rem 2.5rem",
            fontSize: "1.15rem",
            fontWeight: 700,
            borderRadius: "999px",
            background: "linear-gradient(90deg, #3b82f6 0%, #06beb6 100%)",
            color: "#fff",
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            transition: "background 0.2s",
            border: "none",
            outline: "none",
          }}
        >
          Get Started
        </motion.a>
      </motion.div>
      {/* Responsive tweaks */}
      <style>
        {`
          @media (max-width: 600px) {
            div[style*="max-width: 420px"] {
              padding: 2rem 1rem !important;
              max-width: 98vw !important;
            }
            h1 {
              font-size: 1.2rem !important;
              min-height: 2.2rem !important;
            }
            p {
              font-size: 0.98rem !important;
            }
            .flip-text {
              min-width: 80px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

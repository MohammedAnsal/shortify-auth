import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLink, FaRegCopy, FaPowerOff, FaHistory } from "react-icons/fa";
import { short_Url, userLogout } from "../../../services/api/url";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slice/userSlice";
import { useForm } from "react-hook-form";
import { urlSchema } from "../../../utils/validations/url";
import { zodResolver } from "@hookform/resolvers/zod";

const themeGradient =
  "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 40%, #06beb6 100%, #3b82f6 100%)";
const flipWords = ["Short & Sweet!", "Shareable!", "Secure!", "Fast!", "Free!"];

type UrlForm = { url: string };

const UrlShort: React.FC = () => {
  const [flipIndex, setFlipIndex] = useState(0);
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(
      () => setFlipIndex((p) => (p + 1) % flipWords.length),
      1800
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (shortUrl) {
      const timer = setTimeout(() => {
        setShortUrl("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [shortUrl]);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(urlSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: UrlForm) => {
    setShortUrl("");
    setCopied(false);
    try {
      const response = await short_Url(data.url);
      if (response.status) {
        setShortUrl(response.shortUrl);
        toast.success(response.message);
        setTimeout(() => reset(), 3000);
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch {
      toast.error("Failed to shorten URL");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleLogout = async () => {
    try {
      const response = await userLogout();
      if (response) {
        toast.success(response.message);
        localStorage.removeItem("access-token");
        dispatch(logout());
        navigate("/");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden"
      style={{ background: themeGradient }}
    >
      {/* Animated lines */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 0.08, x: 0 }}
            transition={{ delay: i * 0.15, duration: 1.5, type: "spring" }}
            className="absolute w-full"
            style={{
              top: `${i * 12.5}%`,
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, #06beb6 50%, transparent 100%)",
            }}
          />
        ))}
      </div>

      {/* Glass container */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.3 }}
        className="relative z-10 bg-white/85 rounded-3xl shadow-2xl text-center max-w-md w-[90vw] px-6 py-10 backdrop-blur"
      >
        {/* Top buttons */}
        <div className="absolute top-4 left-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/url/history")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-teal-500 text-white font-semibold shadow hover:shadow-lg transition-all"
          >
            <FaHistory /> History
          </motion.button>
        </div>

        <div className="absolute top-4 right-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow hover:shadow-lg transition-all"
          >
            <FaPowerOff />
          </motion.button>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ rotate: -20, scale: 0.7 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
          className="mb-6 flex justify-center"
        >
          <FaLink size={48} className="text-teal-400" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 flex flex-col items-center">
          Shorten Your Link&nbsp;
          <span className="inline-block min-w-[120px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={flipIndex}
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: -90, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent font-extrabold"
              >
                {flipWords[flipIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <p className="text-base sm:text-lg font-medium text-gray-700 my-5">
          Paste your long URL below and get a short, shareable link instantly!
        </p>

        {/* ✅ Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row items-stretch mt-10 gap-3 w-full max-w-md mx-auto mb-4"
        >
          <div className="flex flex-col flex-1">
            <div className="flex items-center bg-white rounded-xl shadow px-3 py-2 border-2 border-transparent focus-within:border-blue-400 transition">
              <FaLink className="text-blue-400 text-lg mr-2" />
              <input
                type="url"
                placeholder="Paste your long URL here..."
                {...register("url")}
                onChange={(e) => {
                  register("url").onChange(e);
                  trigger("url");
                }}
                disabled={isSubmitting}
                className="flex-1 bg-transparent outline-none text-base sm:text-lg font-medium text-gray-800 placeholder-gray-400"
              />
            </div>
            {/* ✅ Error message below input */}
            {errors.url && (
              <span className="text-red-500 text-sm mt-1">
                {errors.url.message}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSubmitting}
            className="flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-teal-400 shadow transition-all min-w-[120px] h-[48px] sm:h-auto"
          >
            {isSubmitting ? "Shortening..." : "Shorten"}
          </motion.button>
        </form>

        {/* ✅ Short URL box */}
        <AnimatePresence>
          {shortUrl && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="mt-6 bg-gradient-to-r from-indigo-100 via-white to-teal-100 rounded-2xl shadow-lg px-6 py-5 flex flex-col items-center w-full max-w-md mx-auto"
            >
              <span className="font-bold text-teal-500 text-base mb-2">
                Your Short URL
              </span>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-bold underline text-lg break-all mb-3"
              >
                {shortUrl}
              </a>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold shadow transition"
              >
                <FaRegCopy />
                {copied ? "Copied!" : "Copy"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UrlShort;

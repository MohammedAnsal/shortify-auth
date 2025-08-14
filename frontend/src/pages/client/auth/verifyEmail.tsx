import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "sonner";
import {
  verifyEmail as verifyEmailApi,
  resendVerificationEmail as resendVerificationEmailApi,
} from "../../../services/api/auth";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const themeGradient =
    "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 40%, #06beb6 100%, #3b82f6 100%)";

  useEffect(() => {
    if (!email || !token) {
      setVerificationStatus("error");
      setMessage("Invalid verification link. Please check your email.");
      return;
    }
    setVerificationStatus("idle");
    setMessage("Click the button below to verify your email address");
  }, [email, token]);

  const verifyEmail = async () => {
    try {
      setVerificationStatus("verifying");
      setMessage("Verifying your email...");

      const data = await verifyEmailApi(email!, token!);

      if (data && data.status) {
        setVerificationStatus("success");
        setMessage(data.message || "Email verified successfully!");

        setTimeout(() => {
          navigate("/auth/signIn");
        }, 3000);
      } else {
        setVerificationStatus("error");
        setMessage(data?.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      setMessage("Verification failed. Please try again.");
    }
  };

  const handleGoToLogin = () => {
    navigate("/auth/signIn");
  };

  const handleResendEmail = async () => {
    try {
      setVerificationStatus("verifying");
      setMessage("Sending verification email...");

      const data = await resendVerificationEmailApi(email!);

      if (data && data.status) {
        setVerificationStatus("idle");
        setMessage(
          "Verification email sent successfully! Please check your inbox."
        );
        toast.success("Verification email sent successfully!");
      } else {
        setVerificationStatus("error");
        setMessage(
          data?.message ||
            "Failed to send verification email. Please try again."
        );
        toast.error(data?.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Resend email error:", error);
      setVerificationStatus("error");
      setMessage("Failed to send verification email. Please try again.");
      toast.error("Failed to send verification email");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden"
      style={{ background: themeGradient }}
    >
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

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-white/20 p-8"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ rotate: -20, scale: 0.7 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
              className="mb-4 flex justify-center"
            >
              {verificationStatus === "idle" && (
                <FaEnvelope size={48} className="text-teal-400" />
              )}
              {verificationStatus === "verifying" && (
                <FaEnvelope size={48} className="text-teal-400" />
              )}
              {verificationStatus === "success" && (
                <FaCheckCircle size={48} className="text-green-500" />
              )}
              {verificationStatus === "error" && (
                <FaExclamationTriangle size={48} className="text-red-500" />
              )}
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {verificationStatus === "idle" && "Verify Your Email"}
              {verificationStatus === "verifying" && "Verifying Email..."}
              {verificationStatus === "success" && "Email Verified!"}
              {verificationStatus === "error" && "Verification Failed"}
            </h1>

            <p className="text-gray-600 text-sm">
              {verificationStatus === "idle" &&
                "Click the button below to verify your email address"}
              {verificationStatus === "verifying" &&
                "Please wait while we verify your email address"}
              {verificationStatus === "success" &&
                "Your email has been successfully verified"}
              {verificationStatus === "error" &&
                "There was an issue verifying your email"}
            </p>
          </div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <div
              className={`p-4 rounded-lg text-center ${
                verificationStatus === "idle"
                  ? "bg-blue-50 text-blue-700"
                  : verificationStatus === "verifying"
                  ? "bg-blue-50 text-blue-700"
                  : verificationStatus === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          </motion.div>

          {verificationStatus === "verifying" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mb-6"
            >
              <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-3"
          >
            {verificationStatus === "idle" && (
              <button
                onClick={verifyEmail}
                className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Verify Email
              </button>
            )}

            {verificationStatus === "success" && (
              <button
                onClick={handleGoToLogin}
                className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Go to Login
              </button>
            )}

            {verificationStatus === "error" && (
              <>
                <button
                  onClick={handleGoToLogin}
                  className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Go to Login
                </button>

                <button
                  onClick={handleResendEmail}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
                >
                  Resend Verification Email
                </button>
              </>
            )}
          </motion.div>

          {email && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-500">
                Email: <span className="font-mono text-gray-700">{email}</span>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;

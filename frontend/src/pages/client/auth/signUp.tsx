import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signUpSchema,
  type FormValues,
} from "../../../utils/validations/signUp";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogle } from "../../../hooks/useGoogle";
import { signUp } from "../../../services/api/auth";
import type { AxiosError } from "axios";

export const SignUp = () => {
  const { handleGoogleSuccess, handleGoogleError } = useGoogle();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    Object.values(errors).forEach((error) => {
      toast.error(error?.message);
    });
  }, [errors]);

  const onSubmit = async (data: FormValues) => {
    setLoading(false);
    try {
      const response = await signUp(data);
      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      console.error("Signup error:", err.message);
      toast.error(
        err.response?.data?.message || err.message || "Sign up failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
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
      {/* Subtle animated background blob */}
      <motion.div
        initial={{ scale: 1, x: -100, y: -80, opacity: 0.18 }}
        animate={{
          scale: [1, 1.15, 1],
          x: [-100, 60, -100],
          y: [-80, 40, -80],
          opacity: [0.18, 0.22, 0.18],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "0%",
          left: "0%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle at 30% 30%, #06beb6 0%, #3b82f6 80%, transparent 100%)",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

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
          padding: "2.5rem 2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          textAlign: "center",
          maxWidth: 400,
          width: "90vw",
          zIndex: 1,
          backdropFilter: "blur(8px)",
        }}
      >
        <h1
          style={{
            fontSize: "1.7rem",
            fontWeight: 900,
            margin: 0,
            letterSpacing: "-1px",
            marginBottom: "1.5rem",
            color: "#222",
          }}
        >
          Sign Up
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "0.5rem",
          }}
        >
          <input
            type="text"
            {...register("fullName")}
            placeholder="Full Name"
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "0.7rem",
              border: "1px solid #e0e7ff",
              fontSize: "1rem",
              outline: "none",
              background: "rgba(255,255,255,0.7)",
            }}
          />
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "0.7rem",
              border: "1px solid #e0e7ff",
              fontSize: "1rem",
              outline: "none",
              background: "rgba(255,255,255,0.7)",
            }}
          />
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            required
            style={{
              padding: "0.8rem 1rem",
              borderRadius: "0.7rem",
              border: "1px solid #e0e7ff",
              fontSize: "1rem",
              outline: "none",
              background: "rgba(255,255,255,0.7)",
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: "0.5rem",
              padding: "0.9rem 0",
              borderRadius: "999px",
              border: "none",
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "linear-gradient(90deg, #3b82f6 0%, #06beb6 100%)",
              color: "var(--color-white)",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              transition: "background 0.2s",
            }}
          >
            Create Account
          </button>
        </form>
        {/* Divider */}
        <div
          style={{
            margin: "1.5rem 0 1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#e0e7ff" }} />
          <span
            style={{
              margin: "0 1rem",
              color: "#888",
              fontWeight: 500,
              fontSize: "0.95rem",
            }}
          >
            or
          </span>
          <div style={{ flex: 1, height: 1, background: "#e0e7ff" }} />
        </div>
        {/* Google Sign Up Button */}
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            size="large"
            text="signup_with"
            theme="filled_black"
            width={50}
          />
        </div>
      </motion.div>
      {/* Responsive tweaks */}
      <style>
        {`
          @media (max-width: 600px) {
            div[style*="max-width: 400px"] {
              padding: 1.5rem 0.5rem !important;
              max-width: 98vw !important;
            }
            h1 {
              font-size: 1.1rem !important;
              min-height: 2rem !important;
            }
            form input, form button {
              font-size: 0.98rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

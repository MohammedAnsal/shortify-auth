import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const themeGradient = "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 40%, #06beb6 100%, #3b82f6 100%)";

  useEffect(() => {
    if (!email || !token) {
      setVerificationStatus('error');
      setMessage('Invalid verification link. Please check your email.');
      return;
    }

    verifyEmail();
  }, [email, token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7002'}/auth/verify-email?email=${email}&token=${token}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.status) {
        setVerificationStatus('success');
        setMessage(data.message || 'Email verified successfully!');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/auth/signIn');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setMessage('Verification failed. Please try again.');
    }
  };

  const handleGoToLogin = () => {
    navigate('/auth/signIn');
  };

  const handleResendEmail = () => {
    // You can implement resend email functionality here
    toast.info('Resend email functionality can be implemented here');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden"
      style={{ background: themeGradient }}
    >
      {/* Animated background lines */}
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
              background: "linear-gradient(90deg, transparent 0%, #06beb6 50%, transparent 100%)",
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
              {verificationStatus === 'verifying' && (
                <FaEnvelope size={48} className="text-teal-400" />
              )}
              {verificationStatus === 'success' && (
                <FaCheckCircle size={48} className="text-green-500" />
              )}
              {verificationStatus === 'error' && (
                <FaExclamationTriangle size={48} className="text-red-500" />
              )}
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {verificationStatus === 'verifying' && 'Verifying Email...'}
              {verificationStatus === 'success' && 'Email Verified!'}
              {verificationStatus === 'error' && 'Verification Failed'}
            </h1>
            
            <p className="text-gray-600 text-sm">
              {verificationStatus === 'verifying' && 'Please wait while we verify your email address'}
              {verificationStatus === 'success' && 'Your email has been successfully verified'}
              {verificationStatus === 'error' && 'There was an issue verifying your email'}
            </p>
          </div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6"
          >
            <div className={`p-4 rounded-lg text-center ${
              verificationStatus === 'verifying' ? 'bg-blue-50 text-blue-700' :
              verificationStatus === 'success' ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
            }`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          </motion.div>

          {/* Loading Animation for Verifying */}
          {verificationStatus === 'verifying' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mb-6"
            >
              <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-3"
          >
            {verificationStatus === 'success' && (
              <button
                onClick={handleGoToLogin}
                className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Go to Login
              </button>
            )}

            {verificationStatus === 'error' && (
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

          {/* Email Display */}
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

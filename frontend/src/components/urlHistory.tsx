import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLink, FaRegCopy, FaRegClock, FaRegEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "sonner";
import { getAllUrls } from "../services/api/url";

interface UrlHistoryItem {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  visitCount: number;
  expiresAt: string;
}

export const UrlHistory = () => {
  const [urls, setUrls] = useState<UrlHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const themeGradient =
    "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 40%, #06beb6 100%, #3b82f6 100%)";

  // Fetch user URLs on component mount and page change
  useEffect(() => {
    fetchUserUrls(currentPage);
  }, [currentPage]);

  const fetchUserUrls = async (page: number) => {
    try {
      setLoading(true);
      const response = await getAllUrls(page, 5);

      if (response.status) {
        setUrls(response.urls);
        setTotal(response.total);
        setTotalPages(response.totalPages);
        setCurrentPage(response.currentPage);
      } else {
        toast.error(response.message || "Failed to fetch URLs");
      }
    } catch (error: any) {
      console.error("Error fetching URLs:", error);
      toast.error("Failed to fetch URLs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (shortUrl: string, id: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden"
        style={{ background: themeGradient }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <h2 className="text-lg font-bold text-gray-700">Loading your URLs...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-sans relative overflow-hidden"
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
              background:
                "linear-gradient(90deg, transparent 0%, #06beb6 50%, transparent 100%)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-6"
        >
          <motion.div
            initial={{ rotate: -20, scale: 0.7 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.3 }}
            className="mb-3 flex justify-center"
          >
            <FaLink size={32} className="text-teal-400" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            Your URL History
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            All your shortened URLs in one place
          </p>
        </motion.div>

        {/* Total URL Count - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6 flex justify-center"
        >
          <div className="bg-white/85 backdrop-blur rounded-xl p-4 text-center shadow-lg border border-white/20 max-w-xs">
            <div className="text-3xl font-bold text-teal-500 mb-1">{total}</div>
            <div className="text-gray-600 font-medium text-sm">Total URLs</div>
          </div>
        </motion.div>

        {/* URL List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto mb-6"
        >
          <AnimatePresence>
            {urls.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-4xl mb-2">🔗</div>
                <h3 className="text-lg font-bold text-gray-600 mb-1">No URLs Created Yet</h3>
                <p className="text-gray-500 text-sm">Start by creating your first shortened URL!</p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {urls.map((url) => (
                  <motion.div
                    key={url._id}
                    variants={itemVariants}
                    layout
                    className="bg-white/85 backdrop-blur rounded-lg shadow-sm border border-white/20 overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        {/* URL Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                              <FaLink className="text-white text-xs" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-800 text-xs truncate">
                                {url.originalUrl}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <div className="flex items-center gap-1">
                                  <FaRegClock className="text-xs" />
                                  <span>{formatDate(url.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaRegEye className="text-xs" />
                                  <span>{url.visitCount} clicks</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Short URL */}
                          <div className="ml-8">
                            <div className="bg-gray-50 rounded-md p-2 flex items-center justify-between">
                              <span className="font-mono text-blue-600 text-xs break-all">
                                {url.shortUrl}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCopy(url.shortUrl, url._id)}
                                className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded text-xs font-medium transition-all hover:shadow-sm"
                              >
                                <FaRegCopy className="text-xs" />
                                {copiedId === url._id ? "Copied!" : "Copy"}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex justify-center items-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 bg-white/85 backdrop-blur rounded-lg shadow-md border border-white/20 text-gray-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              <FaChevronLeft className="text-xs" />
              Previous
            </motion.button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg font-medium text-sm transition-all ${
                    currentPage === page
                      ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg"
                      : "bg-white/85 backdrop-blur text-gray-700 hover:shadow-md"
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-white/85 backdrop-blur rounded-lg shadow-md border border-white/20 text-gray-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              Next
              <FaChevronRight className="text-xs" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UrlHistory;

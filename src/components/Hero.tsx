import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    floating: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden pt-14 sm:pt-16 lg:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-70"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-70"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-12 lg:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-xs sm:text-sm font-medium text-blue-700 mb-6 sm:mb-8"
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-yellow-500 fill-current" />
            <span className="hidden sm:inline">Trusted by 10,000+ organizations worldwide</span>
            <span className="sm:hidden">Trusted by 10,000+ organizations</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2 sm:px-0"
          >
            <span className="block">Create Polls That</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Actually Matter
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Gather real insights with beautiful, interactive polls. 
            From quick surveys to detailed feedback forms - make every voice count.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 lg:mb-16 px-4 sm:px-0"
          >
            <motion.button
              onClick={() => navigate(currentUser ? '/dashboard' : '/auth')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentUser ? 'Go to Dashboard' : 'Try Demo'}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
            
            <motion.button
              className="w-full sm:w-auto bg-white text-gray-900 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto px-4 sm:px-0"
          >
            <motion.div
              className="text-center"
              variants={floatingVariants}
              animate="floating"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-2 sm:mb-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">2M+</div>
              <div className="text-sm sm:text-base text-gray-600">Active Users</div>
            </motion.div>

            <motion.div
              className="text-center"
              variants={floatingVariants}
              animate="floating"
              transition={{ delay: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-2 sm:mb-3">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">50M+</div>
              <div className="text-sm sm:text-base text-gray-600">Polls Created</div>
            </motion.div>

            <motion.div
              className="text-center"
              variants={floatingVariants}
              animate="floating"
              transition={{ delay: 1 }}
            >
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl mb-2 sm:mb-3">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm sm:text-base text-gray-600">User Rating</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 sm:h-3 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full mt-1.5 sm:mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
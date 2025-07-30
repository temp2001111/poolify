import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Pollify
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {link.name}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <>
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard
                </motion.button>
                <motion.button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate('/auth')}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try Demo
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-sm rounded-b-2xl shadow-lg"
        >
          <div className="px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="block text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </motion.a>
            ))}
            <div className="pt-3 sm:pt-4 space-y-2 sm:space-y-3">
              {currentUser ? (
                <>
                  <button 
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={async () => {
                      await logout();
                      navigate('/');
                      setIsOpen(false);
                    }}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-medium text-center text-sm sm:text-base"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      navigate('/auth');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/auth');
                      setIsOpen(false);
                    }}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-medium text-center text-sm sm:text-base"
                  >
                    Try Demo
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
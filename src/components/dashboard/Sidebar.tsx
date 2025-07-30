import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Plus, 
  FileText, 
  Users, 
  LogIn,
  Home,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'create-poll', label: 'Create Poll', icon: Plus },
    { id: 'create-quiz', label: 'Create Quiz', icon: FileText },
    { id: 'my-polls', label: 'My Polls', icon: BarChart3 },
    { id: 'join-poll', label: 'Join Poll', icon: LogIn },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-70 bg-white border-r border-gray-200 shadow-lg lg:shadow-none",
          "lg:relative lg:translate-x-0 lg:z-auto",
          !isOpen && "lg:w-70"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Pollify</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                  activeItem === item.id
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  activeItem === item.id ? "text-blue-600" : "text-gray-500"
                )} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            {bottomItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                  activeItem === item.id
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className={cn(
                  "w-5 h-5",
                  activeItem === item.id ? "text-blue-600" : "text-gray-500"
                )} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
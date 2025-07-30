import React from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3, Users, TrendingUp, Eye, FileText, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

interface DashboardContentProps {
  activeItem: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeItem }) => {
  const { currentUser } = useAuth();

  const stats = [
    { label: 'Total Polls', value: '12', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Responses', value: '1,234', icon: Users, color: 'from-purple-500 to-purple-600' },
    { label: 'Active Polls', value: '8', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'Views', value: '5,678', icon: Eye, color: 'from-pink-500 to-pink-600' },
  ];

  const recentPolls = [
    { id: 1, title: 'Favorite Programming Language', responses: 156, status: 'Active' },
    { id: 2, title: 'Best Coffee Shop in Town', responses: 89, status: 'Active' },
    { id: 3, title: 'Team Building Activity Preferences', responses: 234, status: 'Closed' },
    { id: 4, title: 'Product Feature Priorities', responses: 67, status: 'Active' },
  ];

  const renderDashboardHome = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your polls today.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Button className="h-24 flex-col space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-6 h-6" />
          <span>Create Poll</span>
        </Button>
        <Button variant="outline" className="h-24 flex-col space-y-2">
          <FileText className="w-6 h-6" />
          <span>Create Quiz</span>
        </Button>
        <Button variant="outline" className="h-24 flex-col space-y-2">
          <BarChart3 className="w-6 h-6" />
          <span>My Polls</span>
        </Button>
        <Button variant="outline" className="h-24 flex-col space-y-2">
          <LogIn className="w-6 h-6" />
          <span>Join Poll</span>
        </Button>
      </motion.div>

      {/* Recent Polls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Polls</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentPolls.map((poll, index) => (
            <motion.div
              key={poll.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{poll.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{poll.responses} responses</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    poll.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {poll.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return renderDashboardHome();
      case 'create-poll':
        return (
          <div className="text-center py-12">
            <Plus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Poll</h2>
            <p className="text-gray-600 mb-6">Start gathering insights with a new poll</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Get Started
            </Button>
          </div>
        );
      case 'create-quiz':
        return (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Quiz</h2>
            <p className="text-gray-600 mb-6">Build engaging quizzes for your audience</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              Get Started
            </Button>
          </div>
        );
      case 'my-polls':
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Polls</h2>
            <p className="text-gray-600 mb-6">Manage and view all your polls</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              View All Polls
            </Button>
          </div>
        );
      case 'join-poll':
        return (
          <div className="text-center py-12">
            <LogIn className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Poll</h2>
            <p className="text-gray-600 mb-6">Enter a poll code to participate</p>
            <div className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                placeholder="Enter poll code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                Join Poll
              </Button>
            </div>
          </div>
        );
      default:
        return renderDashboardHome();
    }
  };

  return (
    <div className="p-6">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
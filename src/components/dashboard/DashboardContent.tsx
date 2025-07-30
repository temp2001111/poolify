import React from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3, Users, TrendingUp, Eye, FileText, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import CreatePollWizard from './CreatePollWizard';
import CreateQuizWizard from './CreateQuizWizard';
import JoinPoll from './JoinPoll';
import MyPolls from './MyPolls';

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
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your polls today.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
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
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
      >
        <Button className="h-20 lg:h-24 flex-col space-y-1 lg:space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm lg:text-base">
          <Plus className="w-5 h-5 lg:w-6 lg:h-6" />
          <span className="text-xs lg:text-sm">Create Poll</span>
        </Button>
        <Button variant="outline" className="h-20 lg:h-24 flex-col space-y-1 lg:space-y-2 text-sm lg:text-base">
          <FileText className="w-5 h-5 lg:w-6 lg:h-6" />
          <span className="text-xs lg:text-sm">Create Quiz</span>
        </Button>
        <Button variant="outline" className="h-20 lg:h-24 flex-col space-y-1 lg:space-y-2 text-sm lg:text-base">
          <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6" />
          <span className="text-xs lg:text-sm">My Polls</span>
        </Button>
        <Button variant="outline" className="h-20 lg:h-24 flex-col space-y-1 lg:space-y-2 text-sm lg:text-base">
          <LogIn className="w-5 h-5 lg:w-6 lg:h-6" />
          <span className="text-xs lg:text-sm">Join Poll</span>
        </Button>
      </motion.div>

      {/* Recent Polls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900">Recent Polls</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentPolls.map((poll, index) => (
            <motion.div
              key={poll.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{poll.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{poll.responses} responses</p>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3">
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
        return <CreatePollWizard />;
      case 'create-quiz':
        return <CreateQuizWizard />;
      case 'my-polls':
        return <MyPolls />;
      case 'join-poll':
        return <JoinPoll />;
      default:
        return renderDashboardHome();
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
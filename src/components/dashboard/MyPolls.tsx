import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Eye, Settings, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface PollData {
  id: string;
  title: string;
  description: string;
  joinCode: string;
  type?: string;
  status: string;
  createdAt: any;
  responses?: any[];
  totalVotes?: number;
  totalAttempts?: number;
}

const MyPolls: React.FC = () => {
  const [polls, setPolls] = useState<PollData[]>([]);
  const [quizzes, setQuizzes] = useState<PollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'polls' | 'quizzes'>('polls');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    // Listen to polls
    const pollsQuery = query(
      collection(db, 'polls'),
      where('createdBy', '==', currentUser.uid)
    );

    const unsubscribePolls = onSnapshot(pollsQuery, (snapshot) => {
      const pollsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PollData[];
      setPolls(pollsData);
    });

    // Listen to quizzes
    const quizzesQuery = query(
      collection(db, 'quizzes'),
      where('createdBy', '==', currentUser.uid)
    );

    const unsubscribeQuizzes = onSnapshot(quizzesQuery, (snapshot) => {
      const quizzesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'quiz'
      })) as PollData[];
      setQuizzes(quizzesData);
      setLoading(false);
    });

    return () => {
      unsubscribePolls();
      unsubscribeQuizzes();
    };
  }, [currentUser]);

  const handleStatusToggle = async (id: string, currentStatus: string, type: string = 'poll') => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    const collectionName = type === 'quiz' ? 'quizzes' : 'polls';
    
    try {
      await updateDoc(doc(db, collectionName, id), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string, title: string, type: string = 'poll') => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    const collectionName = type === 'quiz' ? 'quizzes' : 'polls';
    
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    }
  };

  const copyJoinCode = (joinCode: string) => {
    navigator.clipboard.writeText(joinCode);
    alert('Join code copied to clipboard!');
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const currentData = activeTab === 'polls' ? polls : quizzes;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Content</h1>
          <p className="text-gray-600">Manage your polls and quizzes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('polls')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'polls'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Polls ({polls.length})
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quizzes'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quizzes ({quizzes.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {currentData.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first {activeTab.slice(0, -1)} to get started
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            Create {activeTab === 'polls' ? 'Poll' : 'Quiz'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description || 'No description'}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {item.type === 'quiz' ? (item.totalAttempts || 0) : (item.totalVotes || 0)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.type === 'quiz' ? 'Attempts' : 'Votes'}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {(item.responses?.length || 0) * 3}
                  </div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
              </div>

              {/* Join Code */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-4">
                <div>
                  <div className="text-xs text-blue-600 font-medium">Join Code</div>
                  <div className="text-lg font-mono font-bold text-blue-900">
                    {item.joinCode}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyJoinCode(item.joinCode)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* Meta */}
              <div className="text-xs text-gray-500 mb-4">
                Created {formatDate(item.createdAt)}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusToggle(item.id, item.status, item.type)}
                  >
                    {item.status === 'active' ? 'Close' : 'Activate'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id, item.title, item.type)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPolls;
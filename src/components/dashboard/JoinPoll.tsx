import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { LogIn, Search, Users, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import PollRoom from './PollRoom';

interface JoinFormData {
  joinCode: string;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  joinCode: string;
  type?: string;
  questions: any[];
  settings: any;
  createdBy: string;
  status: string;
}

const JoinPoll: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [joinedPoll, setJoinedPoll] = useState<Poll | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<JoinFormData>();

  const onSubmit = async (data: JoinFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const joinCode = data.joinCode.toUpperCase().trim();

      // Search in polls collection
      const pollsQuery = query(
        collection(db, 'polls'),
        where('joinCode', '==', joinCode),
        where('status', '==', 'active')
      );
      const pollsSnapshot = await getDocs(pollsQuery);

      // Search in quizzes collection
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('joinCode', '==', joinCode),
        where('status', '==', 'active')
      );
      const quizzesSnapshot = await getDocs(quizzesQuery);

      let foundPoll = null;

      if (!pollsSnapshot.empty) {
        const pollDoc = pollsSnapshot.docs[0];
        foundPoll = { id: pollDoc.id, ...pollDoc.data(), type: 'poll' } as Poll;
      } else if (!quizzesSnapshot.empty) {
        const quizDoc = quizzesSnapshot.docs[0];
        foundPoll = { id: quizDoc.id, ...quizDoc.data(), type: 'quiz' } as Poll;
      }

      if (foundPoll) {
        setJoinedPoll(foundPoll);
      } else {
        setError('Invalid join code or poll/quiz is not active');
      }
    } catch (error) {
      console.error('Error joining poll:', error);
      setError('Failed to join. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeavePoll = () => {
    setJoinedPoll(null);
    setError('');
  };

  if (joinedPoll) {
    return <PollRoom poll={joinedPoll} onLeave={handleLeavePoll} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Join Poll or Quiz
          </h1>
          <p className="text-gray-600">
            Enter the join code to participate in a poll or quiz
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Join Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Join Code
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('joinCode', {
                  required: 'Join code is required',
                  minLength: {
                    value: 6,
                    message: 'Join code must be at least 6 characters'
                  }
                })}
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono uppercase"
                placeholder="Enter join code"
                maxLength={8}
                style={{ letterSpacing: '0.1em' }}
              />
            </div>
            {errors.joinCode && (
              <p className="mt-1 text-sm text-red-600">{errors.joinCode.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 py-4 text-lg font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Joining...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="w-5 h-5 mr-2" />
                Join Now
              </div>
            )}
          </Button>
        </form>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">How to join:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <p>Get the join code from the poll or quiz creator</p>
            </div>
            <div className="flex items-start">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs font-bold text-blue-600">2</span>
              </div>
              <p>Enter the code in the field above</p>
            </div>
            <div className="flex items-start">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-xs font-bold text-blue-600">3</span>
              </div>
              <p>Click "Join Now" to participate</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">2M+</div>
            <div className="text-xs text-gray-600">Active Participants</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">24/7</div>
            <div className="text-xs text-gray-600">Available</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinPoll;
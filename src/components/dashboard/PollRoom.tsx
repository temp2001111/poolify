import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Clock, BarChart3, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore';

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
  responses?: any[];
  totalVotes?: number;
}

interface PollRoomProps {
  poll: Poll;
  onLeave: () => void;
}

const PollRoom: React.FC<PollRoomProps> = ({ poll, onLeave }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const { currentUser } = useAuth();

  const isQuiz = poll.type === 'quiz';
  const collectionName = isQuiz ? 'quizzes' : 'polls';

  // Initialize timer
  useEffect(() => {
    if (poll.settings?.timer && poll.settings.timer > 0 && !hasSubmitted) {
      setTimeLeft(poll.settings.timer);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (isQuiz && currentQuestion < poll.questions.length - 1) {
              handleNextQuestion();
            } else {
              handleSubmit();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, hasSubmitted]);

  // Listen for live results
  useEffect(() => {
    if (!isQuiz && poll.settings?.showResults === 'immediately') {
      const unsubscribe = onSnapshot(doc(db, collectionName, poll.id), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setLiveResults(data.responses || []);
        }
      });

      return () => unsubscribe();
    }
  }, [poll.id]);

  // Calculate total possible score for quiz
  useEffect(() => {
    if (isQuiz) {
      const total = poll.questions.reduce((sum, q) => sum + (q.points || 1), 0);
      setTotalScore(total);
    }
  }, [poll.questions, isQuiz]);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (isQuiz && currentQuestion < poll.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(poll.settings?.timer || 0);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (hasSubmitted) return;

    try {
      let userScore = 0;
      const responses = Object.entries(selectedAnswers).map(([questionIndex, answerIndex]) => {
        const qIndex = parseInt(questionIndex);
        const question = poll.questions[qIndex];
        const isCorrect = isQuiz ? question.correctAnswer === answerIndex : false;
        
        if (isCorrect) {
          userScore += question.points || 1;
        }

        return {
          questionIndex: qIndex,
          answerIndex,
          question: question.question,
          selectedOption: question.options[answerIndex],
          isCorrect,
          points: isCorrect ? (question.points || 1) : 0,
          userId: currentUser?.uid,
          userName: currentUser?.displayName || 'Anonymous',
          timestamp: new Date()
        };
      });

      setScore(userScore);

      const responseData = {
        userId: currentUser?.uid,
        userName: currentUser?.displayName || 'Anonymous',
        responses,
        totalScore: userScore,
        maxScore: totalScore,
        percentage: totalScore > 0 ? Math.round((userScore / totalScore) * 100) : 0,
        completedAt: new Date()
      };

      await updateDoc(doc(db, collectionName, poll.id), {
        responses: arrayUnion(responseData),
        ...(isQuiz ? { totalAttempts: (poll.responses?.length || 0) + 1 } : { totalVotes: (poll.totalVotes || 0) + 1 })
      });

      setHasSubmitted(true);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    }
  };

  const getResultsData = () => {
    if (!liveResults.length) return [];

    return poll.questions.map((question, qIndex) => {
      const questionResponses = liveResults.flatMap(r => r.responses || [])
        .filter(r => r.questionIndex === qIndex);

      const optionCounts = question.options.map((option: string, oIndex: number) => {
        const count = questionResponses.filter(r => r.answerIndex === oIndex).length;
        return {
          option,
          count,
          percentage: questionResponses.length > 0 ? Math.round((count / questionResponses.length) * 100) : 0
        };
      });

      return {
        question: question.question,
        options: optionCounts,
        totalResponses: questionResponses.length
      };
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestionData = poll.questions[currentQuestion];
  const resultsData = getResultsData();

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{poll.title}</h1>
              <p className="text-gray-600">
                {isQuiz ? 'Quiz Results' : 'Poll Results'}
              </p>
            </div>
            <Button variant="outline" onClick={onLeave}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Leave
            </Button>
          </div>

          {/* Quiz Score */}
          {isQuiz && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Score</h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {score}/{totalScore}
                  </p>
                  <p className="text-sm text-gray-600">
                    {Math.round((score / totalScore) * 100)}% - {
                      (score / totalScore) >= (poll.settings?.passingScore || 70) / 100 
                        ? 'Passed!' 
                        : 'Try again!'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <Trophy className={`w-12 h-12 ${
                    (score / totalScore) >= (poll.settings?.passingScore || 70) / 100 
                      ? 'text-yellow-500' 
                      : 'text-gray-400'
                  }`} />
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="space-y-6">
            {poll.questions.map((question: any, qIndex: number) => {
              const userAnswer = selectedAnswers[qIndex];
              const isCorrect = isQuiz ? question.correctAnswer === userAnswer : false;

              return (
                <div key={qIndex} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {qIndex + 1}. {question.question}
                    </h3>
                    {isQuiz && (
                      <div className="flex items-center">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option: string, oIndex: number) => {
                      const isUserAnswer = userAnswer === oIndex;
                      const isCorrectAnswer = isQuiz && question.correctAnswer === oIndex;
                      const resultData = resultsData[qIndex]?.options[oIndex];

                      return (
                        <div
                          key={oIndex}
                          className={`p-3 rounded-lg border-2 ${
                            isUserAnswer && isCorrectAnswer
                              ? 'border-green-500 bg-green-50'
                              : isUserAnswer && !isCorrectAnswer
                              ? 'border-red-500 bg-red-50'
                              : isCorrectAnswer
                              ? 'border-green-300 bg-green-25'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option}</span>
                            <div className="flex items-center space-x-2">
                              {isUserAnswer && (
                                <span className="text-sm text-blue-600 font-medium">Your answer</span>
                              )}
                              {isCorrectAnswer && isQuiz && (
                                <span className="text-sm text-green-600 font-medium">Correct</span>
                              )}
                              {!isQuiz && resultData && (
                                <span className="text-sm text-gray-600">
                                  {resultData.count} votes ({resultData.percentage}%)
                                </span>
                              )}
                            </div>
                          </div>
                          {!isQuiz && resultData && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${resultData.percentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{poll.title}</h1>
            <p className="text-sm text-gray-600">
              {isQuiz ? 'Quiz' : 'Poll'} • Code: {poll.joinCode}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {timeLeft > 0 && (
              <div className="flex items-center text-orange-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={onLeave}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Leave
            </Button>
          </div>
        </div>

        {/* Progress */}
        {isQuiz && (
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {poll.questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / poll.questions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / poll.questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question */}
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  {!isQuiz && `${currentQuestion + 1}. `}{currentQuestionData.question}
                </h2>
                {isQuiz && currentQuestionData.points && (
                  <p className="text-sm text-gray-600">
                    Worth {currentQuestionData.points} point{currentQuestionData.points !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {currentQuestionData.options.map((option: string, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {selectedAnswers[currentQuestion] !== undefined ? 'Answer selected' : 'Select an answer'}
          </div>
          
          <div className="flex space-x-3">
            {isQuiz && currentQuestion < poll.questions.length - 1 ? (
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Next Question
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswers[currentQuestion] === undefined || hasSubmitted}
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                {hasSubmitted ? 'Submitted' : isQuiz ? 'Finish Quiz' : 'Submit Vote'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PollRoom;
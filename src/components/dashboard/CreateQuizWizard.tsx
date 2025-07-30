import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Minus, ArrowLeft, ArrowRight, Check, Clock, Users, Eye, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface QuizFormData {
  title: string;
  description: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
  }[];
  settings: {
    timer: number;
    anonymous: boolean;
    showCorrectAnswers: boolean;
    passingScore: number;
  };
}

const CreateQuizWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuizFormData>({
    defaultValues: {
      title: '',
      description: '',
      questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 }],
      settings: {
        timer: 30,
        anonymous: false,
        showCorrectAnswers: true,
        passingScore: 70
      }
    }
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions'
  });

  const watchedQuestions = watch('questions');

  const addOption = (questionIndex: number) => {
    const currentOptions = watchedQuestions[questionIndex].options;
    const updatedQuestions = [...watchedQuestions];
    updatedQuestions[questionIndex].options = [...currentOptions, ''];
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...watchedQuestions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    // Adjust correct answer if needed
    if (updatedQuestions[questionIndex].correctAnswer >= optionIndex) {
      updatedQuestions[questionIndex].correctAnswer = Math.max(0, updatedQuestions[questionIndex].correctAnswer - 1);
      setValue(`questions.${questionIndex}.correctAnswer`, updatedQuestions[questionIndex].correctAnswer);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true);
    try {
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const quizData = {
        ...data,
        joinCode,
        type: 'quiz',
        createdBy: currentUser?.uid,
        createdAt: serverTimestamp(),
        status: 'active',
        responses: [],
        totalAttempts: 0
      };

      await addDoc(collection(db, 'quizzes'), quizData);
      
      setCurrentStep(1);
      alert(`Quiz created successfully! Join code: ${joinCode}`);
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Title and description' },
    { number: 2, title: 'Questions', description: 'Add quiz questions' },
    { number: 3, title: 'Settings', description: 'Configure quiz settings' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-purple-600 border-purple-600 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-purple-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-24 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-purple-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 lg:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your quiz title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your quiz (optional)"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 lg:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quiz Questions</h2>
                <Button
                  type="button"
                  onClick={() => appendQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 })}
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-8">
                {questionFields.map((field, questionIndex) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Question {questionIndex + 1}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <input
                            {...register(`questions.${questionIndex}.points`, { min: 1 })}
                            type="number"
                            min="1"
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="1"
                          />
                          <span className="text-sm text-gray-500">pts</span>
                        </div>
                        {questionFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(questionIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <input
                          {...register(`questions.${questionIndex}.question`, {
                            required: 'Question is required'
                          })}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter your question"
                        />
                        {errors.questions?.[questionIndex]?.question && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.questions[questionIndex]?.question?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Answer Options
                        </label>
                        <div className="space-y-2">
                          {watchedQuestions[questionIndex]?.options.map((_, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <input
                                {...register(`questions.${questionIndex}.correctAnswer`)}
                                type="radio"
                                value={optionIndex}
                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                              />
                              <input
                                {...register(`questions.${questionIndex}.options.${optionIndex}`, {
                                  required: 'Option is required'
                                })}
                                type="text"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              {watchedQuestions[questionIndex]?.options.length > 2 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(questionIndex, optionIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(questionIndex)}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Select the radio button next to the correct answer
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 lg:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Time per question (seconds)
                  </label>
                  <input
                    {...register('settings.timer', { min: 10 })}
                    type="number"
                    min="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    {...register('settings.passingScore', { min: 0, max: 100 })}
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="70"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        <Users className="w-4 h-4 inline mr-2" />
                        Anonymous Attempts
                      </label>
                      <p className="text-xs text-gray-500">Allow users to take quiz without revealing identity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        {...register('settings.anonymous')}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        <Eye className="w-4 h-4 inline mr-2" />
                        Show Correct Answers
                      </label>
                      <p className="text-xs text-gray-500">Display correct answers after completion</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        {...register('settings.showCorrectAnswers')}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-gradient-to-r from-purple-600 to-pink-600 flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 flex items-center"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Create Quiz
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateQuizWizard;
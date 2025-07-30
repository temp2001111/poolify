import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Minus, ArrowLeft, ArrowRight, Check, Clock, Users, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PollFormData {
  title: string;
  description: string;
  questions: {
    question: string;
    options: string[];
  }[];
  settings: {
    timer: number;
    anonymous: boolean;
    allowMultipleVotes: boolean;
    showResults: 'immediately' | 'after_voting' | 'never';
  };
}

const CreatePollWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<PollFormData>({
    defaultValues: {
      title: '',
      description: '',
      questions: [{ question: '', options: ['', ''] }],
      settings: {
        timer: 0,
        anonymous: false,
        allowMultipleVotes: false,
        showResults: 'after_voting'
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
    // This will trigger a re-render through the form state
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...watchedQuestions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
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

  const onSubmit = async (data: PollFormData) => {
    setIsSubmitting(true);
    try {
      // Generate a unique join code
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const pollData = {
        ...data,
        joinCode,
        createdBy: currentUser?.uid,
        createdAt: serverTimestamp(),
        status: 'active',
        responses: [],
        totalVotes: 0
      };

      await addDoc(collection(db, 'polls'), pollData);
      
      // Reset form and go back to dashboard
      setCurrentStep(1);
      alert(`Poll created successfully! Join code: ${joinCode}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Title and description' },
    { number: 2, title: 'Questions', description: 'Add your poll questions' },
    { number: 3, title: 'Settings', description: 'Configure poll settings' }
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
                  ? 'bg-blue-600 border-blue-600 text-white' 
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
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-24 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poll Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your poll title"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your poll (optional)"
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
                <h2 className="text-2xl font-bold text-gray-900">Poll Questions</h2>
                <Button
                  type="button"
                  onClick={() => appendQuestion({ question: '', options: ['', ''] })}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
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

                    <div className="space-y-4">
                      <div>
                        <input
                          {...register(`questions.${questionIndex}.question`, {
                            required: 'Question is required'
                          })}
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          Options
                        </label>
                        <div className="space-y-2">
                          {watchedQuestions[questionIndex]?.options.map((_, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <input
                                {...register(`questions.${questionIndex}.options.${optionIndex}`, {
                                  required: 'Option is required'
                                })}
                                type="text"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Poll Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Timer (minutes, 0 = no timer)
                  </label>
                  <input
                    {...register('settings.timer', { min: 0 })}
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        <Users className="w-4 h-4 inline mr-2" />
                        Anonymous Voting
                      </label>
                      <p className="text-xs text-gray-500">Allow users to vote without revealing identity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        {...register('settings.anonymous')}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Allow Multiple Votes
                      </label>
                      <p className="text-xs text-gray-500">Users can change their vote</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        {...register('settings.allowMultipleVotes')}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Eye className="w-4 h-4 inline mr-2" />
                    Show Results
                  </label>
                  <select
                    {...register('settings.showResults')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="immediately">Immediately</option>
                    <option value="after_voting">After voting</option>
                    <option value="never">Never (admin only)</option>
                  </select>
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 flex items-center"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 flex items-center"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Create Poll
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatePollWizard;
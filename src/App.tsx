import React, { useState, useCallback, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { APIKeySetup } from './components/APIKeySetup';
import { QuizTabs } from './components/QuizTabs';
import { useQuizState } from './hooks/useQuizState';
import { useApiKey } from './hooks/useApiKey';
import { QUESTIONS_PER_SET } from './config/constants';

export function App() {
  const { apiKey, setApiKey, resetApiKey, hasApiKey } = useApiKey();
  const [activeTab, setActiveTab] = useState('questions');
  const {
    state,
    handleQuestionsLoaded,
    handleAnswer,
    handleNextQuestion,
    handleContinue,
    handleReset
  } = useQuizState(apiKey);

  useEffect(() => {
    document.title = 'English Quiz App';
  }, []);

  const handleApiKeySubmit = useCallback((key: string) => {
    setApiKey(key);
  }, [setApiKey]);

  const renderContent = () => {
    if (!hasApiKey) {
      return <APIKeySetup onKeySubmit={handleApiKeySubmit} />;
    }

    if (state.questions.length === 0) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <FileUpload onQuestionsLoaded={handleQuestionsLoaded} />
        </div>
      );
    }

    if (state.quizCompleted) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <QuizResults
            score={state.score % QUESTIONS_PER_SET}
            totalQuestions={QUESTIONS_PER_SET}
            onContinue={handleContinue}
            onReset={() => {
              resetApiKey();
              handleReset();
            }}
          />
        </div>
      );
    }

    const currentQuestion = state.questions[state.currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <header className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">English Quiz</h1>
              <div className="text-sm text-gray-500">
                Total Questions: {state.questions.length}
              </div>
            </div>
            <QuizTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </header>

          <main className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'questions' && currentQuestion && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    Question {(state.currentQuestionIndex % QUESTIONS_PER_SET) + 1}/{QUESTIONS_PER_SET}
                  </span>
                  <span className="text-lg">
                    Score: {state.score % QUESTIONS_PER_SET}/{QUESTIONS_PER_SET}
                  </span>
                </div>

                <QuizQuestion
                  question={currentQuestion}
                  userAnswer={state.userAnswer}
                  onAnswer={handleAnswer}
                  showExplanation={state.showExplanation}
                  explanation={state.explanation}
                />

                {state.showExplanation && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Next Question
                  </button>
                )}
              </div>
            )}

            {activeTab === 'study' && (
              <div className="text-gray-600">
                <h2 className="text-xl font-semibold mb-4">Study Guide</h2>
                <div className="space-y-4">
                  <section>
                    <h3 className="font-medium text-lg mb-2">Tips for Multiple Choice Questions</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li>Read the context carefully</li>
                      <li>Pay attention to tense and number agreement</li>
                      <li>Check the part of speech (noun, verb, adjective, etc.)</li>
                    </ul>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-gray-600">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">API Key Settings</h3>
                    <button
                      onClick={() => {
                        resetApiKey();
                        handleReset();
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      Reset API Key
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

  return renderContent();
}
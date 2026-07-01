import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function Quiz({ quiz, onSubmit }) {
  const { token } = useAuth();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/quizzes/${quiz._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ answers })
      });

      const data = await response.json();
      setResult(data);
      setSubmitted(true);
      onSubmit?.(data);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (!quiz || !quiz.questions) {
    return <div className="text-gray-500">No quiz available</div>;
  }

  if (submitted && result) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>

        <div className={`mb-6 p-4 rounded-lg ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className="text-lg font-bold">{result.passed ? '✓ Passed!' : '✗ Failed'}</p>
          <p className="text-2xl font-bold">{result.score}%</p>
          <p className="text-gray-600">{result.correctCount} of {result.totalQuestions} correct</p>
        </div>

        <div className="space-y-6">
          {result.results.map((item) => (
            <div key={item.questionId} className={`p-4 border-l-4 ${item.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <p className="font-semibold mb-2">{item.questionText}</p>
              <p className="text-gray-700 mb-1">Your answer: <span className="font-semibold">{item.userAnswer}</span></p>
              {!item.isCorrect && (
                <p className="text-gray-700 mb-1">Correct answer: <span className="font-semibold text-green-600">{item.correctAnswer}</span></p>
              )}
              {item.explanation && (
                <p className="text-gray-600 mt-2"><strong>Explanation:</strong> {item.explanation}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setAnswers({});
            setResult(null);
          }}
          className="mt-6 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80 transition"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
      {quiz.description && <p className="text-gray-600 mb-6">{quiz.description}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="p-4 border border-gray-200 rounded-lg">
            <p className="font-semibold mb-3">
              {index + 1}. {question.questionText}
            </p>

            {question.type === 'multipleChoice' && (
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name={question._id}
                      value={option}
                      checked={answers[question._id] === option}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      className="mr-3"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'trueFalse' && (
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={question._id}
                    value="true"
                    checked={answers[question._id] === 'true'}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    className="mr-3"
                  />
                  <span>True</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={question._id}
                    value="false"
                    checked={answers[question._id] === 'false'}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    className="mr-3"
                  />
                  <span>False</span>
                </label>
              </div>
            )}

            {(question.type === 'shortAnswer' || question.type === 'essay') && (
              <textarea
                value={answers[question._id] || ''}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows={question.type === 'essay' ? 4 : 2}
                placeholder={`Enter your ${question.type === 'essay' ? 'essay' : 'answer'}`}
              />
            )}

            {question.points && (
              <p className="text-sm text-gray-500 mt-2">Points: {question.points}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}

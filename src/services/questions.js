// File: src/services/questions.js
// This service loads questions from local files
// Fetch the list of questions from the backend
export const loadQuestions = async () => {
  try {
    const response = await fetch('https://web-prograder-backend.onrender.com/api/questions');
    const questions = await response.json();
    console.log('Loaded questions:', questions);
    return questions;
  } catch (error) {
    console.error('Failed to load questions:', error);
    return [];
  }
};

// Fetch the details of a specific question from the backend
export const loadQuestionDetails = async (questionId) => {
  try {
    const response = await fetch(`https://web-prograder-backend.onrender.com/api/questions/${questionId}`);
    const questionDetails = await response.json();
    return questionDetails;
  } catch (error) {
    console.error('Failed to load question details:', error);
    return null;
  }
};
// File: src/components/QuestionList.jsx
import React from 'react';

const QuestionList = ({ questions, selectedQuestion, onSelectQuestion }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <ul>
        {questions.map((question) => (
          <li
            key={question.id}
            className={`p-4 cursor-pointer ${
              selectedQuestion?.id === question.id
                ? 'bg-gray-200 font-bold'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onSelectQuestion(question)}
          >
            {question.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionList;

import React from 'react';

const QuestionDetails = ({ question }) => {
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <h2 className="text-xl font-bold mb-2">{question.title}</h2>
      <p className="text-gray-600 mb-4">{question.description}</p>
      {question.examples.map((example, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg mb-2">
          <div className="mb-2">
            <span className="font-medium">Input: </span>
            <code>{example.input}</code>
          </div>
          <div className="mb-2">
            <span className="font-medium">Output: </span>
            <code>{example.output}</code>
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Explanation: </span>
            {example.explanation}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionDetails;



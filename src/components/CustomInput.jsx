// File: src/components/CustomInput.jsx

import React from 'react';

const CustomInput = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Custom Input:</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-20 p-2 border rounded resize-none"
        placeholder="Enter your test input here..."
      />
    </div>
  );
};

export default CustomInput;
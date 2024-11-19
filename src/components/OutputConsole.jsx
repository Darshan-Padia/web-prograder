// File: src/components/OutputConsole.jsx
import React from 'react';

const OutputConsole = ({ output }) => {
  return (
    <div 
    // className='h-max'
    >
      <label className="block text-sm font-medium mb-2">Output:</label>
      <pre className="bg-gray-800 text-white p-4 rounded  overflow-y-auto font-mono">
        {output || 'No output yet. Run your code to see results.'}
      </pre>
    </div>
  );
};

export default OutputConsole;
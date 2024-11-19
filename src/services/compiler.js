// File: src/services/compiler.js

import axios from 'axios';

export const compileAndRun = async (code, input) => {
  try {
    const response = await fetch('http://localhost:5000/run-cpp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, input }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Compilation Error: ${errorDetails.error}`);
    }

    const result = await response.json();
    return result.output;
  } catch (error) {
    throw new Error(`Compilation Error: ${error.message}`);
  }
};


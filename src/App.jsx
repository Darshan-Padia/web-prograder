import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CPPPracticePlatform from './components/CPPPracticePlatform';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for question-specific views */}
        <Route path="/question/:questionId" element={<CPPPracticePlatform />} />
        
        {/* Default route */}
        <Route path="/" element={<CPPPracticePlatform />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Menu, ChevronRight, Play, Save, RefreshCw, CheckCircle, X, Terminal, PenSquare } from 'lucide-react';
import { loadQuestions, loadQuestionDetails } from '../services/questions';
import QuestionDetails from './QuestionDetails';
import OutputConsole from './OutputConsole';
import CustomInput from './CustomInput';

const CPPPracticePlatform = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const splitterRef = useRef(null);
  const containerRef = useRef(null);

  // State for panel sizing
  const [leftPanelWidth, setLeftPanelWidth] = useState(384); // 96 * 4 = 384px default
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('input'); // 'input' or 'output'


  // Original states remain the same
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [userName, setUserName] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);

  // Handle drag start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      
      // Set minimum and maximum widths
      const minWidth = 300;
      const maxWidth = window.innerWidth - 300;
      
      setLeftPanelWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (!storedName) {
      const enteredName = prompt('Please enter your name:');
      if (enteredName) {
        localStorage.setItem('userName', enteredName);
        setUserName(enteredName);
      }
    } else {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const loadedQuestions = await loadQuestions();
      setQuestions(loadedQuestions);
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const loadQuestion = async () => {
      if (questionId) {
        const questionDetails = await loadQuestionDetails(questionId);
        setSelectedQuestion(questionDetails);
        const savedCode = localStorage.getItem(`code_${questionId}`);
        setCode(savedCode || questionDetails.starterCode);
      }
    };
    loadQuestion();
  }, [questionId]);

  const handleQuestionSelect = (question) => {
    navigate(`/question/${question.id}`);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (selectedQuestion) {
      localStorage.setItem(`code_${selectedQuestion.id}`, newCode);
    }
  };

  const handleSave = () => {
    if (selectedQuestion) {
      localStorage.setItem(`code_${selectedQuestion.id}`, code);
    }
  };

  // Modified compile handler to switch to output tab
  const handleCompile = async () => {
    setIsCompiling(true);
    setOutput('Compiling...');
    setActiveTab('output');

    try {
      const response = await fetch('https://web-prograder-backend.onrender.com/run-cpp', {
        method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, input: customInput }),
        });

        const data = await response.json();
        if (response.ok) {
            setOutput(data.output);
        } else {
            if (data.error && data.error.includes('TLE')) {
                setOutput('Error: Time Limit Exceeded');
            } else {
                setOutput(`Error: ${data.error}\nDetails: ${data.details}`);
            }
        }
    } catch (error) {
        setOutput(`Error: ${error.message}`);
    } finally {
        setIsCompiling(false);
    }
};

const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setOutput('Validating...');
    setActiveTab('output');

    try {
      const response = await fetch('https://web-prograder-backend.onrender.com/validate-code', {
        method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, questionId }),
        });

        const data = await response.json();
        if (response.ok) {
            if (data.allPassed) {
                setOutput('All test cases passed!');
            } else {
                setOutput(
                    data.results
                        .map((result) => {
                            if (result.passed) {
                                return `Test Case ${result.testCase}: Passed`;
                            } else {
                                if (result.error) {
                                    return `Test Case ${result.testCase}: Error - ${result.error}`;
                                }
                                return `Test Case ${result.testCase}: Failed\nExpected: ${result.expectedOutput}\nGot: ${result.userOutput}`;
                            }
                        })
                        .join('\n')
                );
            }
        } else {
            if (data.error && data.error.includes('TLE')) {
                setOutput('Error: Time Limit Exceeded');
            } else {
                setOutput(`Error: ${data.error}`);
            }
        }
    } catch (error) {
        setOutput(`Error: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <div ref={containerRef} className="h-screen w-screen bg-gray-100 flex overflow-hidden">
      {/* Left Panel */}
      <div 
        style={{ width: `${leftPanelWidth}px` }}
        className="flex flex-col bg-white border-r border-gray-200 flex-shrink-0"
      >
        {/* Question Details Section - remains the same */}
        <div className="flex-1 overflow-y-auto p-4 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setIsQuestionsOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold">Question Details</h2>
          </div>
          {selectedQuestion && <QuestionDetails question={selectedQuestion} />}
        </div>

        {/* Bottom Section with Tabs */}
        <div className="h-1/2 border-t border-gray-200 flex flex-col">
          {/* Action Buttons */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {isCompiling ? <RefreshCw className="animate-spin h-4 w-4" /> : <Play className="h-4 w-4" />}
                Run
              </button>
              {/* <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Save className="h-4 w-4" />
                Save
              </button> */}
              <button
                onClick={handleSubmitCode}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Submit
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'input'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <PenSquare size={16} />

              Custom Input
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'output'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Terminal size={16} />
              Output Console
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'input' ? (
              <CustomInput value={customInput} onChange={setCustomInput} />
            ) : (
              <OutputConsole output={output} />
            )}
          </div>
        </div>
      </div>

      {/* Resizer Handle */}
      <div
        ref={splitterRef}
        className={`w-1 bg-gray-200 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors ${
          isDragging ? 'bg-blue-600' : ''
        }`}
        onMouseDown={handleMouseDown}
      />

      {/* Main Editor Area - remains the same */}
      <main className="flex-1 overflow-hidden">
        {selectedQuestion ? (
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
            }}
          />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            Select a question to begin
          </div>
        )}
      </main>

      {/* Questions Modal - remains the same */}
      {isQuestionsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-start">
          <div className="w-96 h-full bg-white shadow-lg animate-slide-in-left">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Practice Questions</h2>
              <button
                onClick={() => setIsQuestionsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    selectedQuestion?.id === question.id ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => {
                    handleQuestionSelect(question);
                    setIsQuestionsOpen(false);
                  }}
                >
                  <ChevronRight size={20} className="mr-4 text-gray-600" />
                  <span className="text-gray-700 font-medium">{question.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default CPPPracticePlatform;

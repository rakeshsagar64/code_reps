import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';

export function DrillScreen({ module, onClose, onCompleteSession }) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [userPattern, setUserPattern] = useState('');

  const prompts = module?.prompts || [];
  const currentPrompt = prompts[currentPromptIndex] || {
    instruction: "Match all digits in the target string.",
    targetRegex: "\\d+",
    testCases: [
      { input: "Order #1234", shouldMatch: true },
      { input: "No digits here", shouldMatch: false }
    ]
  };

  // Evaluate test cases against user pattern
  const evaluateTestCases = () => {
    if (!userPattern) return currentPrompt.testCases.map(tc => ({ ...tc, passed: false }));
    try {
      const regex = new RegExp(userPattern);
      return currentPrompt.testCases.map(tc => ({
        ...tc,
        passed: regex.test(tc.input) === tc.shouldMatch
      }));
    } catch (e) {
      return currentPrompt.testCases.map(tc => ({ ...tc, passed: false }));
    }
  };

  const testResults = evaluateTestCases();
  const allPassed = testResults.length > 0 && testResults.every(tc => tc.passed);

  const handleNext = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setUserPattern('');
    } else {
      onCompleteSession();
    }
  };

  return (
    <div className="drill-container">
      {/* Top Header */}
      <div className="drill-header">
        <div className="drill-title-group">
          <button onClick={onClose} className="btn-close">
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="code-badge">Module {module?.order || 1}</span>
            <span style={{ marginLeft: '8px', fontWeight: 700, fontSize: '14px', color: '#f8fafc' }}>
              Practice Drill
            </span>
          </div>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#cbd5e1' }}>
          Prompt {currentPromptIndex + 1} / {prompts.length || 1}
        </div>
      </div>

      {/* Instruction Card */}
      <div className="prompt-card">
        <div className="prompt-header">
          <span className="primer-label">Challenge</span>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
            Syntax: <code className="code-badge">{module?.primer?.syntaxToken || '\\d'}</code>
          </span>
        </div>
        <p className="prompt-instruction">{currentPrompt.instruction}</p>
      </div>

      {/* Regex Editor Box */}
      <div className="editor-container">
        <div className="editor-label">Your Regex Pattern</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '20px', fontWeight: 700 }}>/</span>
          <input
            type="text"
            value={userPattern}
            onChange={(e) => setUserPattern(e.target.value)}
            placeholder="Type regex here..."
            className="editor-input"
            autoFocus
          />
          <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '20px', fontWeight: 700 }}>/g</span>
        </div>
      </div>

      {/* Live Test Cases */}
      <div>
        <div className="test-section-title">Test Cases</div>
        {testResults.map((tc, index) => (
          <div key={index} className={`test-case-card ${tc.passed ? 'passed' : 'failed'}`}>
            <span>{tc.input}</span>
            <span className={`test-status-badge ${tc.passed ? 'passed' : 'failed'}`}>
              {tc.passed ? 'PASS' : 'FAIL'}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Action Button */}
      <button
        onClick={handleNext}
        disabled={!allPassed}
        className="btn-action"
        style={{
          opacity: allPassed ? 1 : 0.4,
          cursor: allPassed ? 'pointer' : 'not-allowed'
        }}
      >
        {currentPromptIndex < prompts.length - 1 ? 'Next Challenge' : 'Complete Drill'}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

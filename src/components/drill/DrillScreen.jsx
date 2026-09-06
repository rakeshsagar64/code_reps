import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { validators } from '../../utils/validators';

export function DrillScreen({ module, validatorType = 'regex', onClose, onCompleteSession }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userPattern, setUserPattern] = useState('');

  const cards = module?.cards || [];
  const currentCard = cards[currentCardIndex];

  // Individual test case status for UI highlight cards
  const evaluateTestCases = () => {
    if (!currentCard || !userPattern) {
      return (currentCard?.testCases || []).map((tc) => ({ ...tc, passed: false }));
    }

    if (validatorType === 'exact-string') {
      const isExactMatch = validators['exact-string'](userPattern, currentCard);
      return (currentCard?.testCases || []).map((tc) => ({ ...tc, passed: isExactMatch }));
    }

    try {
      const rx = new RegExp(userPattern);
      return (currentCard.testCases || []).map((tc) => ({
        ...tc,
        passed: rx.test(tc.text) === tc.shouldMatch,
      }));
    } catch {
      return (currentCard?.testCases || []).map((tc) => ({ ...tc, passed: false }));
    }
  };

  const testResults = evaluateTestCases();

  // Validate whole card completion using the validator strategy engine
  const validate = validators[validatorType] || validators.regex;
  const allPassed = currentCard ? validate(userPattern, currentCard) : false;

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setUserPattern('');
    } else {
      onCompleteSession();
    }
  };

  if (!currentCard) {
    return (
      <div className="drill-container p-8 text-center text-slate-300">
        <p>No cards found for this module.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-800 rounded-md text-white">
          Back to Dashboard
        </button>
      </div>
    );
  }

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
          Card {currentCardIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Instruction Card */}
      <div className="prompt-card">
        <div className="prompt-header">
          <span className="primer-label">Challenge</span>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
            Type: <code className="code-badge">{currentCard.type}</code>
          </span>
        </div>
        <p className="prompt-instruction">{currentCard.prompt}</p>
      </div>

      {/* Editor Box */}
      <div className="editor-container">
        <div className="editor-label">Your Solution</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {validatorType === 'regex' && (
            <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '20px', fontWeight: 700 }}>/</span>
          )}
          <input
            type="text"
            value={userPattern}
            onChange={(e) => setUserPattern(e.target.value)}
            placeholder={currentCard.ghostTemplate ? `e.g. ${currentCard.ghostTemplate}` : 'Type here...'}
            className="editor-input"
            autoFocus
          />
          {validatorType === 'regex' && (
            <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '20px', fontWeight: 700 }}>/g</span>
          )}
        </div>
      </div>

      {/* Live Test Cases */}
      <div>
        <div className="test-section-title">Test Cases</div>
        {testResults.map((tc, index) => (
          <div key={index} className={`test-case-card ${tc.passed ? 'passed' : 'failed'}`}>
            <span>{tc.text}</span>
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
          cursor: allPassed ? 'pointer' : 'not-allowed',
        }}
      >
        {currentCardIndex < cards.length - 1 ? 'Next Challenge' : 'Complete Drill'}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { validators } from '../../utils/validators';

export function DrillScreen({ module, validatorType = 'regex', onClose, onCompleteSession }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userPattern, setUserPattern] = useState('');

  const inputRef = useRef(null);

  const cards = module?.cards || [];
  const currentCard = cards[currentCardIndex];

  // Reset state when advancing to a new module
  useEffect(() => {
    setCurrentCardIndex(0);
    setUserPattern('');
  }, [module?.id || module?.order]);

  // Dynamic card properties
  const activeValidatorType = currentCard?.validatorType || validatorType;
  const regexFlags = currentCard?.flags ?? 'g';
  const promptText = currentCard?.prompt || currentCard?.question || currentCard?.instruction || '';
  const placeholderText = currentCard?.ghostTemplate || currentCard?.placeholder || currentCard?.hint || '';
  const cardType = currentCard?.type || activeValidatorType;
  const testCases = currentCard?.testCases || currentCard?.tests || [];

  // Individual test case evaluation
  const evaluateTestCases = () => {
    if (!currentCard || !userPattern.trim()) {
      return testCases.map((tc) => ({
        ...tc,
        text: tc.text ?? tc.input ?? '',
        shouldMatch: tc.shouldMatch ?? tc.expected ?? true,
        passed: false,
      }));
    }

    if (activeValidatorType === 'exact-string') {
      const validatorFn = validators['exact-string'] || validators.exactString;
      const isExactMatch = validatorFn ? validatorFn(userPattern, currentCard) : false;
      return testCases.map((tc) => ({
        ...tc,
        text: tc.text ?? tc.input ?? '',
        shouldMatch: tc.shouldMatch ?? tc.expected ?? true,
        passed: isExactMatch,
      }));
    }

    try {
      const cleanPattern = userPattern.replace(/^\/|\/[a-z]*$/gi, '');
      const rx = new RegExp(cleanPattern, regexFlags);

      return testCases.map((tc) => {
        const text = tc.text ?? tc.input ?? '';
        const shouldMatch = tc.shouldMatch ?? tc.expected ?? true;

        rx.lastIndex = 0; // Reset regex state
        const matched = rx.test(text);

        return {
          ...tc,
          text,
          shouldMatch,
          matched,
          passed: matched === shouldMatch,
        };
      });
    } catch {
      return testCases.map((tc) => ({
        ...tc,
        text: tc.text ?? tc.input ?? '',
        shouldMatch: tc.shouldMatch ?? tc.expected ?? true,
        passed: false,
      }));
    }
  };

  const testResults = evaluateTestCases();

  // Validate whole card completion
  const validate = validators[activeValidatorType] || validators[validatorType] || validators.regex;
  const allPassed = currentCard ? validate(userPattern, currentCard) : false;

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setUserPattern('');
    } else {
      onCompleteSession(module); // Pass completed module to parent
    }
  };

  // Auto-focus input on card change
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentCardIndex, module]);

  // Keyboard shortcut (Ctrl+Enter / Cmd+Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (allPassed) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allPassed, currentCardIndex, cards.length, module]);

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
            <span className="code-badge">
              {module?.order !== undefined ? `Module ${module.order}` : 'Module'}
            </span>
            <span style={{ marginLeft: '8px', fontWeight: 700, fontSize: '14px', color: '#f8fafc' }}>
              {module?.title || currentCard?.title || 'Practice Drill'}
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
            Type: <code className="code-badge">{cardType}</code>
          </span>
        </div>
        <p className="prompt-instruction">{promptText}</p>
      </div>

      {/* Editor Box */}
      <div className="editor-container">
        <div className="editor-label">Your Solution</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {activeValidatorType === 'regex' && (
            <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '20px', fontWeight: 700 }}>/</span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={userPattern}
            onChange={(e) => setUserPattern(e.target.value)}
            placeholder={placeholderText ? `e.g. ${placeholderText}` : 'Type here...'}
            className="editor-input"
          />
          {activeValidatorType === 'regex' && (
            <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: '20px', fontWeight: 700 }}>
              /{regexFlags}
            </span>
          )}
        </div>
      </div>

      {/* Live Test Cases */}
      <div>
        <div className="test-section-title">Test Cases</div>
        {testResults.map((tc, index) => (
          <div key={index} className={`test-case-card ${tc.passed ? 'passed' : 'failed'}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 700 }}>{tc.text}</span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                Expected: {tc.shouldMatch ? 'Should Match' : 'Should NOT Match'}
              </span>
            </div>
            <span className={`test-status-badge ${tc.passed ? 'passed' : 'failed'}`}>
              {tc.passed ? 'PASS' : 'FAIL'}
            </span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        onClick={handleNext}
        disabled={!allPassed}
        className="btn-action"
        style={{
          opacity: allPassed ? 1 : 0.4,
          cursor: allPassed ? 'pointer' : 'not-allowed',
        }}
      >
        <span>
          {currentCardIndex < cards.length - 1 ? 'Next Challenge' : 'Next Module'}
        </span>
        <span style={{
          fontSize: '11px',
          fontFamily: 'monospace',
          background: 'rgba(0,0,0,0.25)',
          padding: '2px 6px',
          border: '1px solid rgba(0,0,0,0.15)',
          marginLeft: '4px'
        }}>
          Ctrl+Enter
        </span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

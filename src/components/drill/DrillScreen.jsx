import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Target } from 'lucide-react';
import { validators } from '../../utils/validators';
import { GhostInputEditor } from './GhostInputEditor';
import { LiveTestCaseList } from './LiveTestCaseList';

export function DrillScreen({ module, validatorType = 'regex', onClose, onCompleteSession }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userPattern, setUserPattern] = useState('');

  const cards = module?.cards || [];
  const currentCard = cards[currentCardIndex];

  // Reset state when advancing to a new module
  useEffect(() => {
    setCurrentCardIndex(0);
    setUserPattern('');
  }, [module?.id || module?.order]);

  // Dynamic card properties
  const activeValidatorType = currentCard?.validatorType || validatorType;
  const promptText = currentCard?.prompt || currentCard?.question || currentCard?.instruction || '';
  const ghostTemplate = currentCard?.ghostTemplate || currentCard?.placeholder || currentCard?.hint || '';
  const cardType = currentCard?.type || activeValidatorType;
  const testCases = currentCard?.testCases || currentCard?.tests || [];
  const targetText = currentCard?.target || currentCard?.sample || null;

  // Validate whole card completion
  const validate = validators[activeValidatorType] || validators[validatorType] || validators.regex;
  const allPassed = currentCard ? validate(userPattern, currentCard) : false;

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setUserPattern('');
    } else {
      onCompleteSession(module);
    }
  };

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
      <div className="drill-container drill-empty-state">
        <p>No cards found for this module.</p>
        <button onClick={onClose} className="btn-action btn-compact">
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
          <button onClick={onClose} className="btn-close" title="Back to Dashboard">
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="code-badge">
              {module?.order !== undefined ? `Module ${module.order}` : 'Module'}
            </span>
            <span className="drill-module-title">
              {module?.title || currentCard?.title || 'Practice Drill'}
            </span>
          </div>
        </div>
        <div className="drill-card-counter">
          Card <span className="counter-highlight">{currentCardIndex + 1}</span> / {cards.length}
        </div>
      </div>

      {/* Prominent Challenge Card */}
      <div className="prompt-card">
        <div className="prompt-header">
          <span className="primer-label">
            <Target size={12} /> OBJECTIVE
          </span>
          <span className="prompt-type-label">
            Type: <code className="code-badge">{cardType}</code>
          </span>
        </div>

        <h3 className="prompt-instruction">
          {promptText}
        </h3>

        {/* Target String Block (If available) */}
        {targetText && (
          <div className="target-block">
            <span className="target-label">Target String</span>
            <code className="target-code">{targetText}</code>
          </div>
        )}
      </div>

      {/* Side-by-Side Layout: Editor & Live Test Cases */}
      <div className="drill-workspace">
        <GhostInputEditor
          value={userPattern}
          onChange={setUserPattern}
          ghostTemplate={ghostTemplate}
          ghostTier={currentCard?.ghostTier || 'full'}
        />

        <LiveTestCaseList
          testCases={testCases}
          userInput={userPattern}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={handleNext}
        disabled={!allPassed}
        className="btn-action btn-submit"
      >
        <span>
          {currentCardIndex < cards.length - 1 ? 'Next Challenge' : 'Complete Module'}
        </span>
        <div className="btn-shortcut-group">
          <span className="shortcut-badge">Ctrl + Enter</span>
          <ArrowRight size={18} />
        </div>
      </button>
    </div>
  );
}

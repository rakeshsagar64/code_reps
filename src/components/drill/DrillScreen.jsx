import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Target, Zap, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { validators } from '../../utils/validators';
import { GhostInputEditor } from './GhostInputEditor';
import { LiveTestCaseList } from './LiveTestCaseList';
import './DrillScreen.css';

export function DrillScreen({ module, validatorType = 'regex', onClose, onCompleteSession }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userPattern, setUserPattern] = useState('');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showPrimer, setShowPrimer] = useState(false); // Collapsible primer
  const timerRef = useRef(null);

  const cards = module?.cards || [];
  const currentCard = cards[currentCardIndex];
  const primer = module?.primer;

  useEffect(() => {
    setCurrentCardIndex(0);
    setUserPattern('');
    setIsAdvancing(false);
  }, [module?.id || module?.order]);

  const activeValidatorType = currentCard?.validatorType || validatorType;
  const promptText = currentCard?.prompt || currentCard?.question || currentCard?.instruction || '';
  const ghostTemplate = currentCard?.ghostTemplate || currentCard?.placeholder || currentCard?.hint || '';
  const cardType = currentCard?.type || activeValidatorType;
  const testCases = currentCard?.testCases || currentCard?.tests || [];

  const validate = validators[activeValidatorType] || validators[validatorType] || validators.regex;
  const allPassed = currentCard ? validate(userPattern, currentCard) : false;

  const clearAdvanceTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleNext = () => {
    clearAdvanceTimer();
    setIsAdvancing(false);

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setUserPattern('');
    } else {
      onCompleteSession(module);
    }
  };

  useEffect(() => {
    clearAdvanceTimer();
    if (allPassed && autoAdvance) {
      setIsAdvancing(true);
      timerRef.current = setTimeout(() => handleNext(), 400);
    } else {
      setIsAdvancing(false);
    }
    return () => clearAdvanceTimer();
  }, [allPassed, autoAdvance, currentCardIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (allPassed) handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearAdvanceTimer();
    };
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
    <div className="drill-screen-layout">
      {/* 1. TOP HEADER BAR */}
      <header className="drill-header">
        <div className="drill-title-group">
          <button onClick={onClose} className="btn-close" title="Back to Dashboard">
            <ArrowLeft size={16} />
          </button>
          <div className="title-stack">
            <span className="code-badge">
              {module?.order !== undefined ? `Module ${module.order}` : 'Module'}
            </span>
            <span className="drill-module-title">
              {module?.title || currentCard?.title || 'Practice Drill'}
            </span>
          </div>
        </div>

        <div className="header-controls">
          {primer && (
            <button
              type="button"
              onClick={() => setShowPrimer((prev) => !prev)}
              className={`btn-primer-toggle ${showPrimer ? 'active' : ''}`}
            >
              <BookOpen size={14} />
              <span>Primer</span>
              {showPrimer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setAutoAdvance((prev) => !prev)}
            className={`toggle-auto-advance ${autoAdvance ? 'active' : ''}`}
          >
            <Zap size={14} />
            <span>Auto-Advance</span>
            <span className="toggle-badge">{autoAdvance ? 'ON' : 'OFF'}</span>
          </button>

          <div className="drill-card-counter">
            <span className="counter-highlight">{currentCardIndex + 1}</span> / {cards.length}
          </div>
        </div>
      </header>

      {/* COLLAPSIBLE PRIMER DRAWER (Pops down without pushing workspace) */}
      {primer && showPrimer && (
        <div className="primer-dropdown">
          <div className="primer-dropdown-content">
            <code className="primer-syntax-badge">{primer.syntaxToken}</code>
            <p className="primer-definition">{primer.definition}</p>
            {primer.goldenRule && <p className="primer-rule">💡 {primer.goldenRule}</p>}
          </div>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN SPLIT WORKSPACE */}
      <main className="drill-split-workspace">
        {/* LEFT COLUMN: Prompt + Input Editor */}
        <section className="drill-panel left-panel">
          <div className="prompt-card">
            <div className="prompt-header">
              <span className="primer-label">
                <Target size={12} /> OBJECTIVE
              </span>
              <span className="prompt-type-label">
                Type: <code className="code-badge">{cardType}</code>
              </span>
            </div>

            <h3 className="prompt-instruction">{promptText}</h3>
          </div>

          <div className="editor-wrapper">
            <GhostInputEditor
              value={userPattern}
              onChange={setUserPattern}
              ghostTemplate={ghostTemplate}
              ghostTier={
                currentCard?.ghostTier ||
                (currentCard?.scaffold === 'blind' ? 'blind' : 'full')
              }
            />
          </div>
        </section>

        {/* RIGHT COLUMN: Test Cases + Action Button */}
        <section className="drill-panel right-panel">
          <div className="test-cases-wrapper">
            <LiveTestCaseList testCases={testCases} userInput={userPattern} />
          </div>

          <button
            onClick={handleNext}
            disabled={!allPassed}
            className={`btn-action btn-submit ${isAdvancing ? 'advancing' : ''}`}
          >
            <span>
              {isAdvancing
                ? 'Auto-Advancing...'
                : currentCardIndex < cards.length - 1
                ? 'Next Challenge'
                : 'Complete Module'}
            </span>
            <div className="btn-shortcut-group">
              <span className="shortcut-badge">Ctrl + Enter</span>
              <ArrowRight size={18} />
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}

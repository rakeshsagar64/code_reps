import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function LiveTestCaseList({ testCases = [], userInput = '' }) {
  let compiledRegex = null;
  let regexError = null;

  // Compile user regex safely
  if (userInput.trim() !== '') {
    try {
      // Force 'g' flag for global substring highlighting across the text
      compiledRegex = new RegExp(userInput, 'g');
    } catch (err) {
      regexError = err.message;
    }
  }

  // Render text with dynamically highlighted regex matches
  const renderHighlightedText = (text, shouldMatch) => {
    if (!userInput || !compiledRegex || regexError) {
      return <span>{text}</span>;
    }

    // Reset regex cursor state before execution
    compiledRegex.lastIndex = 0;

    const parts = [];
    let lastIndex = 0;
    let match;
    let matchCount = 0;

    try {
      while ((match = compiledRegex.exec(text)) !== null) {
        matchCount++;

        // Append preceding unmatched substring
        if (match.index > lastIndex) {
          parts.push(text.slice(lastIndex, match.index));
        }

        // Color coding: green if this text is supposed to match, red if it's matching text it shouldn't
        const highlightClass = shouldMatch
          ? 'match-highlight-valid'
          : 'match-highlight-invalid';

        // Append matched substring wrapped in <mark>
        parts.push(
          <mark key={`${match.index}-${matchCount}`} className={`match-highlight ${highlightClass}`}>
            {match[0]}
          </mark>
        );

        lastIndex = compiledRegex.lastIndex;

        // Prevent infinite loops on zero-width assertions (e.g. ^, $, \b)
        if (match[0].length === 0) {
          compiledRegex.lastIndex++;
        }
      }

      // Append remaining trailing substring
      if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
      }

      return parts.length > 0 ? parts : <span>{text}</span>;
    } catch {
      return <span>{text}</span>;
    }
  };

  // Evaluate single test case
  const checkPass = (tc) => {
    if (!userInput || !compiledRegex || regexError) return false;
    compiledRegex.lastIndex = 0;
    const matches = compiledRegex.test(tc.text);
    return tc.shouldMatch ? matches : !matches;
  };

  const passedCount = testCases.filter(checkPass).length;

  return (
    <div className="test-cases-container">
      {/* Header Bar */}
      <div className="test-cases-header">
        <span>Test Cases</span>
        {regexError ? (
          <span className="regex-status-error" title={regexError}>
            <AlertCircle size={13} /> Syntax Error
          </span>
        ) : (
          <span className="test-cases-counter-badge">
            {userInput ? `${passedCount} / ${testCases.length} Passed` : 'Requirement'}
          </span>
        )}
      </div>

      {/* Test Case Items */}
      <div className="test-cases-list">
        {testCases.map((tc, idx) => {
          const isPassed = checkPass(tc);

          return (
            <div
              key={idx}
              className={`test-case-item ${userInput && isPassed ? 'passed' : ''} ${
                userInput && !isPassed ? 'failing' : ''
              }`}
            >
              <div className="test-case-content">
                {userInput && isPassed ? (
                  <CheckCircle2 size={16} className="test-case-icon passed" />
                ) : (
                  <XCircle size={16} className="test-case-icon pending" />
                )}
                <span className="test-case-text">
                  {renderHighlightedText(tc.text, tc.shouldMatch)}
                </span>
              </div>

              <span className={`test-case-badge ${tc.shouldMatch ? 'match' : 'skip'}`}>
                {tc.shouldMatch ? 'Should Match' : 'Should Not Match'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

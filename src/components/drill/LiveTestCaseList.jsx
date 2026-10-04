import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function LiveTestCaseList({ testCases = [], userInput = '', card = null }) {
  let compiledRegex = null;
  let regexError = null;

  // Safely compile user regex
  if (userInput.trim() !== '') {
    try {
      // Global flag for substring matching/highlighting
      compiledRegex = new RegExp(userInput, 'g');
    } catch (err) {
      regexError = err.message;
    }
  }

  // Evaluate a single test case against all regex engine requirements
  const checkPass = (tc) => {
    if (!userInput || !compiledRegex || regexError) return false;

    // Always reset lastIndex before testing
    compiledRegex.lastIndex = 0;

    try {
      const match = compiledRegex.exec(tc.text);
      const doesMatch = match !== null;

      if (tc.shouldMatch) {
        if (!doesMatch) return false;

        // 1. Validate full expected match substring
        if (tc.expected !== undefined && match[0] !== tc.expected) {
          return false;
        }

        // 2. Validate expected capture groups array
        if (tc.expectedGroups !== undefined) {
          const capturedGroups = Array.from(match)
            .slice(1)
            .map((g) => (g === undefined ? null : g));

          if (capturedGroups.length !== tc.expectedGroups.length) {
            return false;
          }

          for (let i = 0; i < tc.expectedGroups.length; i++) {
            if (capturedGroups[i] !== tc.expectedGroups[i]) {
              return false;
            }
          }
        }

        return true;
      } else {
        // For negative test cases, return true only if it does NOT match
        return !doesMatch;
      }
    } catch {
      return false;
    }
  };

  // Render text with dynamically highlighted regex matches
  const renderHighlightedText = (tc) => {
    const { text } = tc;
    if (!userInput || !compiledRegex || regexError) {
      return <span>{text}</span>;
    }

    const isPassed = checkPass(tc);

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

        // Highlight green if this test case passes overall, red if it fails
        const highlightClass = isPassed
          ? 'match-highlight-valid'
          : 'match-highlight-invalid';

        // Append matched substring wrapped in <mark>
        parts.push(
          <mark
            key={`${match.index}-${matchCount}`}
            className={`match-highlight ${highlightClass}`}
          >
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
                <span className="test-case-text">{renderHighlightedText(tc)}</span>
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

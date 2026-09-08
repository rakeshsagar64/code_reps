import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export function LiveTestCaseList({ testCases = [], userInput = '' }) {
  const evaluateTestCase = (testCase) => {
    if (!userInput) return { isPassed: false, text: testCase.text };
    try {
      const rx = new RegExp(userInput);
      const matches = rx.test(testCase.text);
      const isPassed = testCase.shouldMatch ? matches : !matches;
      return { isPassed, text: testCase.text };
    } catch {
      return { isPassed: false, text: testCase.text };
    }
  };

  return (
    <div className="test-cases-container">
      {/* Header Bar */}
      <div className="test-cases-header">
        <span>Test Cases</span>
        <span>Requirement</span>
      </div>

      {/* Test Case Items */}
      <div className="test-cases-list">
        {testCases.map((tc, idx) => {
          const result = evaluateTestCase(tc);

          return (
            <div
              key={idx}
              className={`test-case-item ${result.isPassed ? 'passed' : ''}`}
            >
              <div className="test-case-content">
                {result.isPassed ? (
                  <CheckCircle2 size={16} className="test-case-icon passed" />
                ) : (
                  <XCircle size={16} className="test-case-icon pending" />
                )}
                <span className="test-case-text">
                  {tc.text}
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

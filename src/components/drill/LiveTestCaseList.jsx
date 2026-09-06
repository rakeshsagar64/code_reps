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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1 font-mono">
        <span>Test Cases</span>
        <span>Requirement</span>
      </div>

      <div className="space-y-2">
        {testCases.map((tc, idx) => {
          const result = evaluateTestCase(tc);

          return (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-xl border-l-4 border-y border-r p-3.5 font-mono text-xs sm:text-sm transition-all ${
                result.isPassed
                  ? 'border-l-emerald-500 border-slate-800 bg-emerald-950/10 text-emerald-200'
                  : 'border-l-slate-700 border-slate-800/80 bg-slate-900/40 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3 truncate pr-2">
                {result.isPassed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-slate-600" />
                )}
                <span className="truncate">{tc.text}</span>
              </div>

              <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-sans font-bold uppercase tracking-wider ${
                  tc.shouldMatch
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                }`}
              >
                {tc.shouldMatch ? 'Match' : 'Skip'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

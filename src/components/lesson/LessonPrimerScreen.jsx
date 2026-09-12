import React from 'react';
import {
  ArrowLeft,
  Play,
  Lightbulb,
  Code2,
  Target,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  XCircle
} from 'lucide-react';

export function LessonPrimerScreen({ module, onBack, onStartDrill }) {
  const { primer, title, order, description, testCases: moduleTestCases } = module;

  // Consolidate test cases from either module level or primer level
  const testCases = primer?.testCases || moduleTestCases || null;

  return (
    <div className="primer-page">
      <div className="primer-container">

        {/* Navigation Bar */}
        <div className="primer-nav">
          <button onClick={onBack} className="btn-back">
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <span className="primer-module-badge">MODULE {order}</span>
        </div>

        {/* Title Section */}
        <div>
          <h1 className="primer-header-title">{title}</h1>
          {description && <p className="primer-header-desc">{description}</p>}
        </div>

        {/* Target Syntax Banner */}
        {primer?.syntaxToken && (
          <div className="syntax-banner">
            <div className="syntax-banner-left">
              <Code2 style={{ color: '#10b981' }} size={24} />
              <div>
                <span className="syntax-label">Target Syntax</span>
                <span className="syntax-value">{primer.syntaxToken}</span>
              </div>
            </div>
            <span className="syntax-label">// Core Pattern</span>
          </div>
        )}

        {/* 1. Mental Model (How the Engine Thinks) */}
        {primer?.mentalModel && (
          <div className="primer-section">
            <h2 className="primer-section-title">
              <BrainCircuit style={{ color: '#10b981' }} size={20} />
              Mental Model
            </h2>
            <div className="mental-model-card">
              <p className="mental-model-text">{primer.mentalModel}</p>
            </div>
          </div>
        )}

        {/* 2. Core Rules & Breakdown */}
        {primer?.points && primer.points.length > 0 && (
          <div className="primer-section">
            <h2 className="primer-section-title">
              <Lightbulb style={{ color: '#38bdf8' }} size={20} />
              Core Rules
            </h2>

            <div className="concept-grid">
              {primer.points.map((point, index) => (
                <div key={index} className="concept-card">
                  <CheckCircle2 className="concept-card-icon" size={18} />
                  <p className="concept-card-text">{point}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Common Traps & Pitfalls */}
        {primer?.pitfalls && primer.pitfalls.length > 0 && (
          <div className="primer-section">
            <h2 className="primer-section-title">
              <AlertTriangle style={{ color: '#f59e0b' }} size={20} />
              Common Traps & Edge Cases
            </h2>

            <div className="concept-grid">
              {primer.pitfalls.map((pitfall, index) => (
                <div key={index} className="pitfall-card">
                  <AlertTriangle className="pitfall-card-icon" size={18} />
                  <p className="pitfall-card-text">{pitfall}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Worked Examples */}
        {primer?.examples && primer.examples.length > 0 && (
          <div className="primer-section">
            <h2 className="primer-section-title">
              <Target style={{ color: '#a855f7' }} size={20} />
              Examples
            </h2>

            <div className="example-list">
              {primer.examples.map((example, idx) => (
                <div key={idx} className="example-item">
                  <div className="example-row">
                    <span className="example-key">Pattern:</span>
                    <code className="example-value-code">{example.pattern || primer.syntaxToken}</code>
                  </div>
                  {example.match !== undefined && (
                    <div className="example-row">
                      <span className="example-key">Matches:</span>
                      <span className="example-match-text">{example.match}</span>
                    </div>
                  )}
                  {example.note && (
                    <p className="example-note">{example.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Exercise Targets Preview */}
        {testCases && (
          <div className="primer-section">
            <h2 className="primer-section-title">
              <Target style={{ color: '#10b981' }} size={20} />
              Exercise Preview
            </h2>

            <div className="targets-preview-grid">
              {/* Positive Test Targets */}
              {testCases.positive && testCases.positive.length > 0 && (
                <div className="target-box positive-box">
                  <span className="target-box-header">
                    <CheckCircle2 size={14} /> Must Match
                  </span>
                  <ul className="target-list">
                    {testCases.positive.map((tc, i) => (
                      <li key={i} className="target-item">
                        <code>{typeof tc === 'string' ? tc : tc.target}</code>
                        {tc.expected && (
                          <span className="target-subtext"> → expects "{tc.expected}"</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Negative Test Targets */}
              {testCases.negative && testCases.negative.length > 0 && (
                <div className="target-box negative-box">
                  <span className="target-box-header">
                    <XCircle size={14} /> Must NOT Match
                  </span>
                  <ul className="target-list">
                    {testCases.negative.map((tc, i) => (
                      <li key={i} className="target-item">
                        <code>{typeof tc === 'string' ? tc : tc.target}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="primer-actions">
          <button onClick={onStartDrill} className="btn-proceed">
            Proceed to Exercise
            <Play size={16} fill="currentColor" />
          </button>
        </div>

      </div>
    </div>
  );
}

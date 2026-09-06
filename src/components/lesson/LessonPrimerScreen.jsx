import React from 'react';
import { Sparkles, AlertTriangle, ArrowRight, X, Zap } from 'lucide-react';

export function LessonPrimerScreen({ module, onStartDrill, onClose }) {
  const { primer } = module;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {/* Header Bar */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="code-badge">Step 1</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Concept Primer
            </span>
          </div>
          <button onClick={onClose} className="btn-close">
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc' }}>{module.title}</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{module.description}</p>
        </div>

        {/* Target Syntax Display */}
        <div className="primer-section" style={{ textAlign: 'center' }}>
          <div className="primer-label">Target Syntax</div>
          <div style={{ fontFamily: 'monospace', fontSize: '28px', fontWeight: 800, color: '#34d399' }}>
            {primer.syntaxToken}
          </div>
        </div>

        {/* Definition */}
        <div className="primer-section">
          <div className="primer-label">Definition</div>
          <p style={{ fontSize: '13px', color: '#e2e8f0', marginTop: '4px' }}>{primer.definition}</p>
        </div>

        {/* Golden Rule */}
        <div className="primer-section" style={{ borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
          <div className="primer-label" style={{ color: '#f59e0b' }}>Golden Rule</div>
          <p style={{ fontSize: '13px', color: '#fde68a', marginTop: '4px' }}>{primer.goldenRule}</p>
        </div>

        {/* Action Button */}
        <button onClick={onStartDrill} className="btn-action">
          <Zap size={16} />
          Start Practice Drill
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

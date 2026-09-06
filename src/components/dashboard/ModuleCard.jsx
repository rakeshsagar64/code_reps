import React from 'react';
import { BookOpen, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export function ModuleCard({ module, isUnlocked, progressPercent, onStartLesson }) {
  return (
    <div className="module-card">
      <div className="card-header">
        <div>
          <span className="module-badge">Module {module.order}</span>
          <h3 className="module-title">{module.title}</h3>
        </div>
        <div style={{ color: isUnlocked ? '#10b981' : '#64748b' }}>
          {isUnlocked ? <BookOpen size={20} /> : <Lock size={20} />}
        </div>
      </div>

      <p className="card-desc">{module.description}</p>

      <div className="syntax-row">
        <span>Target Syntax:</span>
        <code className="code-badge">{module.primer.syntaxToken}</code>
      </div>

      <div className="progress-bar-container">
        <div className="progress-text">
          <span>Completion</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <button
        onClick={() => onStartLesson(module)}
        disabled={!isUnlocked}
        className="btn-action"
        style={{ opacity: isUnlocked ? 1 : 0.5, cursor: isUnlocked ? 'pointer' : 'not-allowed' }}
      >
        {progressPercent > 0 ? 'Continue Lesson' : 'Start Lesson'}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

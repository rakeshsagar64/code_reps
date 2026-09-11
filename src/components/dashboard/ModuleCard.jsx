import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

export function ModuleCard({ module, onStartLesson }) {
  return (
    <div className="module-card">
      <div className="card-header">
        <div>
          <span className="module-badge">Module {module.order}</span>
          <h3 className="module-title">{module.title}</h3>
        </div>
        <div style={{ color: '#10b981' }}>
          <BookOpen size={20} />
        </div>
      </div>

      <p className="card-desc">{module.description}</p>

      <div className="syntax-row">
        <span>Target Syntax:</span>
        <code className="code-badge">{module.primer.syntaxToken}</code>
      </div>

      <button
        onClick={() => onStartLesson(module)}
        className="btn-action"
      >
        Start Practice
        <ArrowRight size={16} />
      </button>
    </div>
  );
}

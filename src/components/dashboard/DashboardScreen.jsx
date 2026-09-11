import React, { useState } from 'react';
import { regexCourse } from '../../curriculum';
import { ModuleCard } from './ModuleCard.jsx';
import { LessonPrimerScreen } from '../lesson/LessonPrimerScreen.jsx';

export function DashboardScreen({ onLaunchDrill }) {
  const [selectedModule, setSelectedModule] = useState(null);

  return (
    <div className="h-full min-h-screen overflow-y-auto bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8 pb-16">
        {/* Header Stats */}
        <header className="app-header">
          <div className="brand">
            <span className="logo-icon">CR</span>
            <div>
              <h1 className="brand-title">CodeReps</h1>
              <div className="brand-subtitle">Regex Fundamentals</div>
            </div>
          </div>
        </header>

        {/* Section Title */}
        <div className="dashboard-section-header">
          <span className="section-badge">// CURRICULUM</span>
          <h2 className="section-title">Modules</h2>
          <p className="section-desc">Select any module below to practice regex drills.</p>
        </div>

        {/* Module Card Grid */}
        <div className="space-y-4">
          {regexCourse.modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onStartLesson={(mod) => setSelectedModule(mod)}
            />
          ))}
        </div>
      </div>

      {/* Lesson Primer Modal */}
      {selectedModule && (
        <LessonPrimerScreen
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onStartDrill={() => {
            const mod = selectedModule;
            setSelectedModule(null);
            onLaunchDrill(mod);
          }}
        />
      )}
    </div>
  );
}

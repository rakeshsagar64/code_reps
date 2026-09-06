import React, { useState } from 'react';
import { regexCourse } from '../../curriculum/courses/regex/course.js';
import { ModuleCard } from './ModuleCard.jsx';
import { LessonPrimerScreen } from '../lesson/LessonPrimerScreen.jsx';
import { Flame, Target, Zap } from 'lucide-react';

export function DashboardScreen({ onLaunchDrill }) {
  const [selectedModule, setSelectedModule] = useState(null);

  // Mock progress state (Will hook into Zustand store next)
  const mockProgress = {
    regex_m1: 100,
    regex_m2: 0,
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
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
        <div>
          <h2 className="text-xl font-bold text-slate-100">Modules</h2>
          <p className="text-sm text-slate-400">
            Complete modules to build regex muscle memory.
          </p>
        </div>

        {/* Module Card Grid */}
        <div className="space-y-4">
          {regexCourse.modules.map((module, index) => {
            const progress = mockProgress[module.id] || 0;
            const isUnlocked = index === 0 || (mockProgress[regexCourse.modules[index - 1]?.id] || 0) >= 100;

            return (
              <ModuleCard
                key={module.id}
                module={module}
                isUnlocked={isUnlocked}
                progressPercent={progress}
                onStartLesson={(mod) => setSelectedModule(mod)}
              />
            );
          })}
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

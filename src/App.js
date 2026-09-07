import React, { useState } from 'react';
import './App.css';
import { DashboardScreen } from './components/dashboard/DashboardScreen.jsx';
import { DrillScreen } from './components/drill/DrillScreen.jsx';
import { regexCourse } from './curriculum';

export default function App() {
  const [activeDrillModule, setActiveDrillModule] = useState(null);

  const handleCompleteSession = (completedModule) => {
    if (!completedModule) {
      setActiveDrillModule(null);
      return;
    }

    const modules = regexCourse.modules || [];
    const currentIndex = modules.findIndex(
      (m) => m.id === completedModule.id || m.order === completedModule.order
    );

    const nextModule = modules[currentIndex + 1];

    if (nextModule) {
      setActiveDrillModule(nextModule);
    } else {
      setActiveDrillModule(null); // Course finished, back to dashboard
    }
  };

  return (
    <div className="container">
      {!activeDrillModule ? (
        <DashboardScreen onLaunchDrill={setActiveDrillModule} />
      ) : (
        <DrillScreen
          module={activeDrillModule}
          onClose={() => setActiveDrillModule(null)}
          onCompleteSession={handleCompleteSession}
        />
      )}
    </div>
  );
}

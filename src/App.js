import React, { useState } from 'react';
import './App.css'; // <-- Import standard CSS here
import { DashboardScreen } from './components/dashboard/DashboardScreen.jsx';
import { DrillScreen } from './components/drill/DrillScreen.jsx';

export default function App() {
  const [activeDrillModule, setActiveDrillModule] = useState(null);

  return (
    <div className="container">
      {!activeDrillModule ? (
        <DashboardScreen onLaunchDrill={setActiveDrillModule} />
      ) : (
        <DrillScreen
          module={activeDrillModule}
          onClose={() => setActiveDrillModule(null)}
          onCompleteSession={() => setActiveDrillModule(null)}
        />
      )}
    </div>
  );
}

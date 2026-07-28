import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { PeriodTracker } from './pages/PeriodTracker';
import { CustomCalendar } from './components/CustomCalendar';
import { AIPredictions } from './pages/AIPredictions';
import { MoodTracker } from './pages/MoodTracker';
import { SymptomTracker } from './pages/SymptomTracker';
import { MedicationPage } from './pages/Medication';
import { Appointments } from './pages/Appointments';
import { Community } from './pages/Community';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { SettingsPage } from './pages/Settings';

const AppContent: React.FC = () => {
  const { isLoggedIn } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');

  if (!isLoggedIn) {
    if (showAuth) {
      return <Auth />;
    }
    return <LandingPage onStart={() => setShowAuth(true)} />;
  }

  return (
    <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === 'dashboard' && <Dashboard />}
      {currentTab === 'tracker' && <PeriodTracker />}
      {currentTab === 'calendar' && <CustomCalendar />}
      {currentTab === 'predictions' && <AIPredictions />}
      {currentTab === 'mood' && <MoodTracker />}
      {currentTab === 'symptoms' && <SymptomTracker />}
      {currentTab === 'medication' && <MedicationPage />}
      {currentTab === 'appointments' && <Appointments />}
      {currentTab === 'community' && <Community />}
      {currentTab === 'reports' && <Reports />}
      {currentTab === 'profile' && <Profile />}
      {currentTab === 'settings' && <SettingsPage />}
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

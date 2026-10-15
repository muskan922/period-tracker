import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { PeriodTracker } from './pages/PeriodTracker';
import { WaterTracker } from './pages/WaterTracker';
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
import { AIAssistant } from './pages/AIAssistant';

const ProtectedLayout: React.FC = () => {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
};

const PublicHome: React.FC = () => {
  const { isLoggedIn } = useApp();
  const navigate = useNavigate();
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage onStart={() => navigate('/login')} />;
};

const PublicAuth: React.FC<{ initialStep?: 'login' | 'signup' }> = ({ initialStep = 'login' }) => {
  const { isLoggedIn } = useApp();
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Auth initialStep={initialStep} />;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/login" element={<PublicAuth initialStep="login" />} />
          <Route path="/signup" element={<PublicAuth initialStep="signup" />} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />

          {/* Protected Application Routes wrapped by Layout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracker" element={<PeriodTracker />} />
            <Route path="/water" element={<WaterTracker />} />
            <Route path="/calendar" element={<CustomCalendar />} />
            <Route path="/predictions" element={<AIPredictions />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/symptoms" element={<SymptomTracker />} />
            <Route path="/medication" element={<MedicationPage />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/community" element={<Community />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

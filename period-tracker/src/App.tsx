import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';

// Lazy-loaded route components for performance optimization and bundle splitting
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Auth = lazy(() => import('./pages/Auth').then(m => ({ default: m.Auth })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const PeriodTracker = lazy(() => import('./pages/PeriodTracker').then(m => ({ default: m.PeriodTracker })));
const WaterTracker = lazy(() => import('./pages/WaterTracker').then(m => ({ default: m.WaterTracker })));
const CustomCalendar = lazy(() => import('./components/CustomCalendar').then(m => ({ default: m.CustomCalendar })));
const AIPredictions = lazy(() => import('./pages/AIPredictions').then(m => ({ default: m.AIPredictions })));
const AIAssistant = lazy(() => import('./pages/AIAssistant').then(m => ({ default: m.AIAssistant })));
const MoodTracker = lazy(() => import('./pages/MoodTracker').then(m => ({ default: m.MoodTracker })));
const SymptomTracker = lazy(() => import('./pages/SymptomTracker').then(m => ({ default: m.SymptomTracker })));
const MedicationPage = lazy(() => import('./pages/Medication').then(m => ({ default: m.MedicationPage })));
const Appointments = lazy(() => import('./pages/Appointments').then(m => ({ default: m.Appointments })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const Reports = lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const SettingsPage = lazy(() => import('./pages/Settings').then(m => ({ default: m.SettingsPage })));

const PageLoader: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-accent animate-fade-in p-8">
    <div className="w-9 h-9 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
    <span className="font-subtitle text-xs text-vintageText/70 tracking-widest uppercase">Opening Sanctuary Chamber...</span>
  </div>
);

const ProtectedLayout: React.FC = () => {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
};

const PublicHome: React.FC = () => {
  const { isLoggedIn } = useApp();
  const navigate = useNavigate();
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <LandingPage onStart={() => navigate('/login')} />
    </Suspense>
  );
};

const PublicAuth: React.FC<{ initialStep?: 'login' | 'signup' }> = ({ initialStep = 'login' }) => {
  const { isLoggedIn } = useApp();
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <Auth initialStep={initialStep} />
    </Suspense>
  );
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

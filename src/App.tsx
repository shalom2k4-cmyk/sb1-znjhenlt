import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Insights from './pages/Insights';
import Tracker from './pages/Tracker';
import Consultation from './pages/Consultation';
import Settings from './pages/Settings';
import Auth from './pages/Auth'; // 1. Import your new Auth page

function AppContent() {
  const { activeTab } = useApp();

  // 2. Logic: If the tab is 'auth', show ONLY the Auth page.
  // We don't show the BottomNav here because you shouldn't navigate while logging in.
  if (activeTab === 'auth') {
    return <Auth />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-slate-50">
      {activeTab === 'home' && <Home />}
      {activeTab === 'insights' && <Insights />}
      {activeTab === 'tracker' && <Tracker />}
      {activeTab === 'consultation' && <Consultation />}
      {activeTab === 'settings' && <Settings />}
      
      {/* 3. BottomNav only appears when you are logged in */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
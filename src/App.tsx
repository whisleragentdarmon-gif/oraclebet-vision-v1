
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LivePage } from './pages/LivePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ComboPage } from './pages/ComboPage';
import { AdminPage } from './pages/AdminPage';
import { VipPage } from './pages/VipPage';
import { BankrollPage } from './pages/BankrollPage';
import { LoginPage } from './pages/LoginPage';
import { BankrollProvider } from './context/BankrollContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('analysis');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'live':
        return <LivePage filter="LIVE" title="Matchs en Direct" />;
      case 'today':
        return <LivePage filter="TODAY" title="Matchs du Jour" />;
      case 'upcoming':
        return <LivePage filter="UPCOMING" title="Matchs à Venir" />;
      case 'analysis':
        return <AnalysisPage />;
      case 'combos':
        return <ComboPage />;
      case 'bankroll':
        return <BankrollPage />;
      case 'vip':
        return <VipPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <AnalysisPage />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="animate-fade-in">
        {renderContent()}
      </div>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ConfigProvider>
        <BankrollProvider>
            <AuthenticatedApp />
        </BankrollProvider>
      </ConfigProvider>
    </AuthProvider>
  );
};

export default App;

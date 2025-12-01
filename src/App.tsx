import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LivePage } from './pages/LivePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ComboPage } from './pages/ComboPage';
import { AdminPage } from './pages/AdminPage'; // Si tu l'as encore
import { VipPage } from './pages/VipPage';
import { BankrollPage } from './pages/BankrollPage';
import { LoginPage } from './pages/LoginPage';
import { HistoryPage } from './pages/HistoryPage';
import { BankrollProvider } from './context/BankrollContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { DataProvider } from './context/DataContext'; // 👈 AJOUT ICI

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('analysis');

  if (!isAuthenticated) return <LoginPage />;

  const renderContent = () => {
    switch (activeTab) {
      case 'live': return <LivePage filter="LIVE" title="Matchs en Direct" />;
      case 'today': return <LivePage filter="TODAY" title="Matchs du Jour" />;
      case 'upcoming': return <LivePage filter="UPCOMING" title="Matchs à Venir" />;
      case 'history': return <HistoryPage />;
      case 'analysis': return <AnalysisPage />;
      case 'combos': return <ComboPage />;
      case 'bankroll': return <BankrollPage />;
      case 'vip': return <VipPage />;
      default: return <AnalysisPage />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="animate-fade-in">{renderContent()}</div>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ConfigProvider>
        <BankrollProvider>
          {/* 👇 ON ENGLOBE L'APPLI DANS LE DATA PROVIDER */}
          <DataProvider>
            <AuthenticatedApp />
          </DataProvider>
        </BankrollProvider>
      </ConfigProvider>
    </AuthProvider>
  );
};

export default App;

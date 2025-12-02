import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ProgramPage } from './pages/ProgramPage'; // 👈 Nouvelle page
import { AnalysisPage } from './pages/AnalysisPage';
import { ComboPage } from './pages/ComboPage';
import { VipPage } from './pages/VipPage';
import { BankrollPage } from './pages/BankrollPage';
import { LoginPage } from './pages/LoginPage';
import { HistoryPage } from './pages/HistoryPage';
import { BankrollProvider } from './context/BankrollContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { DataProvider } from './context/DataContext';
import { AnalysisProvider } from './context/AnalysisContext';

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // On arrive direct sur le programme
  const [activeTab, setActiveTab] = useState('program'); 

  if (!isAuthenticated) return <LoginPage />;

  const renderContent = () => {
    switch (activeTab) {
      case 'program': return <ProgramPage />; // 👈 La page unique
      case 'history': return <HistoryPage />;
      case 'analysis': return <AnalysisPage />;
      case 'combos': return <ComboPage />;
      case 'bankroll': return <BankrollPage />;
      case 'vip': return <VipPage />;
      default: return <ProgramPage />;
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
          <DataProvider>
            <AnalysisProvider>
               <AuthenticatedApp />
            </AnalysisProvider>
          </DataProvider>
        </BankrollProvider>
      </ConfigProvider>
    </AuthProvider>
  );
};

export default App;

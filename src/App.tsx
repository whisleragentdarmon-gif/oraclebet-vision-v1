import React, { useState } from 'react';
import { Layout } from './components/Layout';

// ✅ ON IMPORTE LA NOUVELLE PAGE QUI MARCHE
import { ProgramPage } from './pages/ProgramPage'; 

import { ComboPage } from './pages/ComboPage';
import { VipPage } from './pages/VipPage';
import { BankrollPage } from './pages/BankrollPage';
import { LoginPage } from './pages/LoginPage';
import { HistoryPage } from './pages/HistoryPage';

// Contextes
import { BankrollProvider } from './context/BankrollContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import { DataProvider } from './context/DataContext';
import { AnalysisProvider } from './context/AnalysisContext';

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // On pointe par défaut sur 'program' (ta page de scan)
  const [activeTab, setActiveTab] = useState('program'); 

  if (!isAuthenticated) return <LoginPage />;

  const renderContent = () => {
    switch (activeTab) {
      case 'program': return <ProgramPage />; // ✅ C'est ici que le scan se passe
      case 'history': return <HistoryPage />;
      // On retire AnalysisPage car ProgramPage la remplace
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

import React, { useState } from 'react';
import { Layout } from './components/Layout';
// On utilise ProgramPage comme page principale de saisie
import { ProgramPage } from './pages/ProgramPage'; 
import { AnalysisPage } from './pages/AnalysisPage'; // Celle-ci servira pour voir les résultats IA après
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AnalysisProvider } from './context/AnalysisContext';
import { ConfigProvider } from './context/ConfigContext';
import { BankrollProvider } from './context/BankrollContext';

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // On démarre sur le programme pour saisir les données
  const [activeTab, setActiveTab] = useState('program'); 

  if (!isAuthenticated) return <LoginPage />;

  const renderContent = () => {
    switch (activeTab) {
      case 'program': return <ProgramPage />;
      case 'analysis': return <AnalysisPage />;
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

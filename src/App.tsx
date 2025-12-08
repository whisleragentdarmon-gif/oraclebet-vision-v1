import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ProgramPage } from './pages/ProgramPage'; // Saisie Manuelle
import { AnalysisPage } from './pages/AnalysisPage'; // Calcul IA
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AnalysisProvider } from './context/AnalysisContext';
// ... autres imports ...

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('program'); // Commence par la saisie

  if (!isAuthenticated) return <LoginPage />;

  const renderContent = () => {
    switch (activeTab) {
      case 'program': return <ProgramPage />; // Etape 1 : Remplir
      case 'analysis': return <AnalysisPage />; // Etape 2 : Analyser
      // ... autres ...
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
      <DataProvider>
        <AnalysisProvider>
           <AuthenticatedApp />
        </AnalysisProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;

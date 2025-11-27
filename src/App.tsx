import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { LoginPage } from "./pages/LoginPage";
import { LivePage } from "./pages/LivePage";
import { ComboPage } from "./pages/ComboPage";
import { BankrollPage } from "./pages/BankrollPage";
import { AnalysisPage } from "./pages/AnalysisPage";
import { VipPage } from "./pages/VipPage";
import { AdminPage } from "./pages/AdminPage";
import { ConfigProvider } from "./context/ConfigContext";
import { BankrollProvider } from "./context/BankrollContext";

import "./index.css";

export const App: React.FC = () => {
  return (
    <ConfigProvider>
      <BankrollProvider>
        <Router>
          <div className="flex h-screen w-full bg-black text-white">
            <Sidebar />

            <div className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/live" element={<LivePage filter="LIVE" title="En Direct" />} />
                <Route path="/today" element={<LivePage filter="TODAY" title="Matchs du jour" />} />
                <Route path="/upcoming" element={<LivePage filter="UPCOMING" title="À venir" />} />
                <Route path="/combos" element={<ComboPage />} />
                <Route path="/bankroll" element={<BankrollPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/vip" element={<VipPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </BankrollProvider>
    </ConfigProvider>
  );
};

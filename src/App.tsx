import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Sidebar } from "./components/Sidebar";
import { LivePage } from "./pages/LivePage";
import { ComboPage } from "./pages/ComboPage";
import { BankrollPage } from "./pages/BankrollPage";
import { AnalysisPage } from "./pages/AnalysisPage";
import { VipPage } from "./pages/VipPage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";

import "./index.css";

export const App: React.FC = () => {
  const isLogged = localStorage.getItem("oracle-auth") === "true";

  return (
    <Router>
      <div className="flex h-screen bg-black text-white">

        {isLogged && <Sidebar />}

        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            {!isLogged && <Route path="*" element={<LoginPage />} />}

            <Route path="/" element={<Navigate to="/live" />} />
            <Route path="/live" element={<LivePage filter="LIVE" title="En Direct" />} />
            <Route path="/today" element={<LivePage filter="TODAY" title="Matchs du jour" />} />
            <Route path="/upcoming" element={<LivePage filter="UPCOMING" title="Matchs à venir" />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/combos" element={<ComboPage />} />
            <Route path="/bankroll" element={<BankrollPage />} />
            <Route path="/vip" element={<VipPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

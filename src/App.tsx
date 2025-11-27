import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation
} from "react-router-dom";

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

        {/* ------------------------------------------------------------------ */}
        {/*                       SIDEBAR INTÉGRÉE ORIGINALE                  */}
        {/* ------------------------------------------------------------------ */}
        {isLogged && (
          <Sidebar />
        )}

        {/* ------------------------- CONTENU DES PAGES ---------------------- */}
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

/* ---------------------------------------------------------------------- */
/*                          SIDEBAR (INTÉGRÉE)                            */
/* ---------------------------------------------------------------------- */

const Sidebar = () => {
  const location = useLocation();

  const nav = [
    { path: "/live", label: "En Direct" },
    { path: "/today", label: "Aujourd'hui" },
    { path: "/upcoming", label: "Demain" },
    { path: "/analysis", label: "Analyse IA" },
    { path: "/combos", label: "Combinés IA" },
    { path: "/bankroll", label: "Ma Bankroll" },
    { path: "/vip", label: "VIP Telegram" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <div className="w-56 bg-neutral-900 border-r border-neutral-800 p-4 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">OracleBet</h1>
      <p className="text-xs text-gray-400">Vision v1</p>

      <div className="flex flex-col gap-1 mt-4">
        {nav.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`px-3 py-2 rounded-lg transition
              ${location.pathname === item.path
                ? "bg-neutral-800 text-white font-bold"
                : "text-gray-300 hover:bg-neutral-800"}
            `}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

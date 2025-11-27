import React, { useState } from "react";

export const LoginPage: React.FC = () => {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "whisler69") {
      localStorage.setItem("oracle-auth", "true");
      window.location.href = "/live";
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-700 w-80">
        <h2 className="text-xl font-bold mb-4">Connexion OracleBet</h2>

        <input
          type="password"
          className="w-full p-3 bg-neutral-800 rounded-lg text-white border border-neutral-700 mb-4"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-neon hover:bg-neonHover font-bold text-black py-3 rounded-lg"
          onClick={handleLogin}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Match } from '../types';
import { BankrollState, BetRecord, Circuit } from '../engine/types';
import { OracleAI } from '../engine';

interface BankrollContextType {
  state: BankrollState;
  validateBet: (match: Match | BetRecord, selection: string, odds: number, isWin: boolean) => void;
  addPendingTicket: (ticket: BetRecord) => void;
  resetBankroll: (amount: number) => void;
  updateCurrentBalance: (amount: number) => void; // 👈 NOUVELLE FONCTION
  lastLearningLog: string | null;
}

const BankrollContext = createContext<BankrollContextType | undefined>(undefined);

export const BankrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BankrollState>({
    currentBalance: 100.00, // Départ défaut
    startBalance: 100.00,
    totalBets: 0,
    wins: 0,
    losses: 0,
    totalInvested: 0,
    totalReturned: 0,
    roi: 0,
    history: []
  });
  
  const [lastLearningLog, setLastLearningLog] = useState<string | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem('oracle_bankroll');
    if (savedState) setState(JSON.parse(savedState));
  }, []);

  useEffect(() => {
    localStorage.setItem('oracle_bankroll', JSON.stringify(state));
  }, [state]);

  const addPendingTicket = (ticket: BetRecord) => {
      setState(prev => ({ ...prev, history: [ticket, ...prev.history] }));
  };

  // 👇 Fonction pour modifier la bankroll manuellement
  const updateCurrentBalance = (amount: number) => {
      setState(prev => ({ ...prev, currentBalance: amount }));
  };

  const validateBet = (target: Match | BetRecord, selection: string, odds: number, isWin: boolean) => {
    // (Code existant pour valider le pari... on le garde tel quel)
    // Pour simplifier ici, je remets la logique standard de mise à jour
    let stake = 0;
    let recordId = (target as any).id;
    const existingRecordIndex = state.history.findIndex(h => h.id === recordId);

    if (existingRecordIndex >= 0) {
        const record = state.history[existingRecordIndex];
        if (record.status !== 'PENDING') return;
        stake = typeof record.stake === 'number' ? record.stake : parseFloat(record.stake as string);
    } else {
        // Si pas d'historique, on simule une mise de 1%
        stake = state.currentBalance * 0.01; 
    }

    const profit = isWin ? (stake * odds) - stake : -stake;
    
    const newState = {
        ...state,
        currentBalance: state.currentBalance + profit,
        totalBets: state.totalBets + 1,
        wins: state.wins + (isWin ? 1 : 0),
        losses: state.losses + (isWin ? 0 : 1),
        totalInvested: state.totalInvested + stake,
        totalReturned: state.totalReturned + (isWin ? stake * odds : 0)
    };

    // Update history logic...
    if (existingRecordIndex >= 0) {
        const h = [...state.history];
        h[existingRecordIndex] = { ...h[existingRecordIndex], status: isWin ? 'WON' : 'LOST', profit: parseFloat(profit.toFixed(2)) };
        newState.history = h;
    }

    setState(newState);
  };

  const resetBankroll = (amount: number) => {
    setState({
      currentBalance: amount,
      startBalance: amount,
      totalBets: 0,
      wins: 0,
      losses: 0,
      totalInvested: 0,
      totalReturned: 0,
      roi: 0,
      history: []
    });
  };

  return (
    <BankrollContext.Provider value={{ state, validateBet, addPendingTicket, resetBankroll, updateCurrentBalance, lastLearningLog }}>
      {children}
    </BankrollContext.Provider>
  );
};

export const useBankroll = () => {
  const context = useContext(BankrollContext);
  if (!context) throw new Error("useBankroll must be used within a BankrollProvider");
  return context;
};

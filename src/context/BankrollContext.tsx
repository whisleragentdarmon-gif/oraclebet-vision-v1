import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Match } from '../types';
import { BankrollState, BetRecord } from '../engine/types';
import { OracleAI } from '../engine';

interface BankrollContextType {
  state: BankrollState;
  validateBet: (match: Match | BetRecord, selection: string, odds: number, isWin: boolean) => void;
  addPendingTicket: (ticket: BetRecord) => void;
  resetBankroll: (amount: number) => void;
  updateCurrentBalance: (amount: number) => void;
  lastLearningLog: string | null;
}

const BankrollContext = createContext<BankrollContextType | undefined>(undefined);

export const BankrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BankrollState>({
    currentBalance: 100.00,
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

  const updateCurrentBalance = (amount: number) => {
      setState(prev => ({ ...prev, currentBalance: amount }));
  };

  const validateBet = (target: Match | BetRecord, selection: string, odds: number, isWin: boolean) => {
    let stake = 0;
    let recordId = (target as any).id;
    const existingRecordIndex = state.history.findIndex(h => h.id === recordId);

    if (existingRecordIndex >= 0) {
        const record = state.history[existingRecordIndex];
        if (record.status !== 'PENDING') return;
        // Si c'était un ticket en attente, la mise est déjà fixée
        stake = typeof record.stake === 'number' ? record.stake : parseFloat(record.stake as string);
    } else {
        // ✅ CORRECTION ICI : On adapte l'appel à la nouvelle signature
        // Si confiance > 70, on considère "HighConf", sinon "Normal"
        const confidence = (target as any).ai?.confidence || 50;
        const strategy = confidence > 70 ? 'HighConf' : 'Balanced';
        stake = OracleAI.bankroll.calculateStake(state.currentBalance, strategy);
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

    if (existingRecordIndex >= 0) {
        const h = [...state.history];
        h[existingRecordIndex] = { ...h[existingRecordIndex], status: isWin ? 'WON' : 'LOST', profit: parseFloat(profit.toFixed(2)) };
        newState.history = h;
    } else {
         // Si c'est un nouveau pari simple validé en direct
         const newRecord: BetRecord = {
            id: Date.now().toString(),
            matchId: (target as Match).id,
            matchTitle: `${(target as Match).player1.name} vs ${(target as Match).player2.name}`,
            selection: selection,
            odds: odds,
            stake: stake,
            status: isWin ? 'WON' : 'LOST',
            profit: parseFloat(profit.toFixed(2)),
            date: new Date().toLocaleString(),
            confidenceAtTime: (target as Match).ai?.confidence || 0
        };
        newState.history = [newRecord, ...state.history];
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

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Match } from '../types';
import { BankrollState, BetRecord, Circuit } from '../engine/types';
import { OracleAI } from '../engine';

interface BankrollContextType {
  state: BankrollState;
  validateBet: (match: Match | BetRecord, selection: string, odds: number, isWin: boolean) => void;
  addPendingTicket: (ticket: BetRecord) => void;
  resetBankroll: (amount: number) => void;
  lastLearningLog: string | null;
}

const BankrollContext = createContext<BankrollContextType | undefined>(undefined);

export const BankrollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BankrollState>({
    currentBalance: 20.00,
    startBalance: 20.00,
    totalBets: 0,
    wins: 0,
    losses: 0,
    totalInvested: 0,
    totalReturned: 0,
    roi: 0,
    history: []
  });
  
  const [lastLearningLog, setLastLearningLog] = useState<string | null>(null);

  // Load from local storage on init
  useEffect(() => {
    const savedState = localStorage.getItem('oracle_bankroll');
    if (savedState) {
        setState(JSON.parse(savedState));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('oracle_bankroll', JSON.stringify(state));
  }, [state]);

  const addPendingTicket = (ticket: BetRecord) => {
      setState(prev => ({
          ...prev,
          history: [ticket, ...prev.history]
      }));
  };

  const validateBet = (target: Match | BetRecord, selection: string, odds: number, isWin: boolean) => {
    // Determine if it's a new match or an existing pending record
    let recordId = (target as any).id;
    const existingRecordIndex = state.history.findIndex(h => h.id === recordId);
    
    let stake = 0;
    
    if (existingRecordIndex >= 0) {
        // Validation of existing pending ticket
        const record = state.history[existingRecordIndex];
        // Only validate if pending
        if (record.status !== 'PENDING') return;
        stake = record.stake;
    } else {
        // New bet from Match Card
        stake = OracleAI.bankroll.calculateStake(state.currentBalance, (target as any).ai?.confidence || 50, odds, 'Normal');
    }

    // Update Logic
    const profit = isWin ? (stake * odds) - stake : -stake;
    const returned = isWin ? stake * odds : 0;
    
    const newBalance = state.currentBalance + profit;
    const totalInvested = state.totalInvested + stake;
    const totalReturned = state.totalReturned + returned;
    const roi = totalInvested > 0 ? ((totalReturned - totalInvested) / totalInvested) * 100 : 0;

    const updatedState = {
        ...state,
        currentBalance: parseFloat(newBalance.toFixed(2)),
        totalBets: state.totalBets + 1,
        wins: state.wins + (isWin ? 1 : 0),
        losses: state.losses + (isWin ? 0 : 1),
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        totalReturned: parseFloat(totalReturned.toFixed(2)),
        roi: parseFloat(roi.toFixed(2)),
    };

    // Update History Record
    if (existingRecordIndex >= 0) {
        const updatedHistory = [...state.history];
        updatedHistory[existingRecordIndex] = {
            ...updatedHistory[existingRecordIndex],
            status: isWin ? 'WON' : 'LOST',
            profit: profit
        };
        updatedState.history = updatedHistory;
    } else {
        // Create new record
         const newRecord: BetRecord = {
            id: Date.now().toString(),
            matchId: (target as Match).id,
            matchTitle: `${(target as Match).player1.name} vs ${(target as Match).player2.name}`,
            selection: selection,
            odds: odds,
            stake: stake,
            status: isWin ? 'WON' : 'LOST',
            profit: profit,
            date: new Date().toLocaleString(),
            confidenceAtTime: (target as Match).ai?.confidence || 0
        };
        updatedState.history = [newRecord, ...state.history];
    }

    setState(updatedState);

    // Trigger Learning
    // We try to extract circuit info. If it's a new match, we have it. If it's a record, we might lack it (mocking ATP)
    const circuit = (target as Match).ai?.circuit || 'ATP';
    const log = OracleAI.predictor.learning.learnFromMatch(
        isWin, 
        {
            circuit: circuit as Circuit,
            winnerPrediction: selection,
            totalGames: 0,
            riskLevel: 'Moderate'
        },
        recordId
    );
    setLastLearningLog(log);
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
    setLastLearningLog("Bankroll Réinitialisée.");
  };

  return (
    <BankrollContext.Provider value={{ state, validateBet, addPendingTicket, resetBankroll, lastLearningLog }}>
      {children}
    </BankrollContext.Provider>
  );
};

export const useBankroll = () => {
  const context = useContext(BankrollContext);
  if (!context) throw new Error("useBankroll must be used within a BankrollProvider");
  return context;
};
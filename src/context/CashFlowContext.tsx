
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type Store = 'Lagoa Encantada' | 'Prehistoric Park';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  store: Store;
  description: string;
  type: 'income' | 'expense';
}

interface CashFlowState {
  transactions: Transaction[];
  balance: number;
}

type CashFlowAction = 
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] };

const initialState: CashFlowState = {
  transactions: [],
  balance: 0
};

const calculateBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((total, transaction) => {
    return transaction.type === 'income' 
      ? total + transaction.amount 
      : total - transaction.amount;
  }, 0);
};

const cashFlowReducer = (state: CashFlowState, action: CashFlowAction): CashFlowState => {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const newTransactions = [...state.transactions, action.payload];
      return {
        ...state,
        transactions: newTransactions,
        balance: calculateBalance(newTransactions)
      };
    }
    case 'DELETE_TRANSACTION': {
      const newTransactions = state.transactions.filter(
        transaction => transaction.id !== action.payload
      );
      return {
        ...state,
        transactions: newTransactions,
        balance: calculateBalance(newTransactions)
      };
    }
    case 'SET_TRANSACTIONS': {
      return {
        ...state,
        transactions: action.payload,
        balance: calculateBalance(action.payload)
      };
    }
    default:
      return state;
  }
};

interface CashFlowContextProps {
  state: CashFlowState;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const CashFlowContext = createContext<CashFlowContextProps | undefined>(undefined);

export const useCashFlow = () => {
  const context = useContext(CashFlowContext);
  if (!context) {
    throw new Error('useCashFlow must be used within a CashFlowProvider');
  }
  return context;
};

interface CashFlowProviderProps {
  children: React.ReactNode;
}

export const CashFlowProvider: React.FC<CashFlowProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cashFlowReducer, initialState);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      dispatch({ 
        type: 'SET_TRANSACTIONS', 
        payload: JSON.parse(savedTransactions) 
      });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  return (
    <CashFlowContext.Provider value={{ state, addTransaction, deleteTransaction }}>
      {children}
    </CashFlowContext.Provider>
  );
};

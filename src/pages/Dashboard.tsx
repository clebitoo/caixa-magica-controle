
import React from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import BalanceCard from '@/components/BalanceCard';
import TransactionList from '@/components/TransactionList';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container max-w-md px-4 py-4">
        <div className="space-y-4">
          <BalanceCard />
          
          <div>
            <h2 className="text-lg font-medium mb-2">Histórico de Transações</h2>
            <TransactionList />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;

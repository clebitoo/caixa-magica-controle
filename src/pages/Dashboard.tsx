
import React from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import BalanceCard from '@/components/BalanceCard';
import TransactionList from '@/components/TransactionList';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen pb-16">
      <Header />
      <main className="container max-w-md px-4 py-6">
        <div className="space-y-6">
          <BalanceCard />
          
          <div>
            <h2 className="text-lg font-medium mb-3">Histórico de Transações</h2>
            <TransactionList />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Dashboard;

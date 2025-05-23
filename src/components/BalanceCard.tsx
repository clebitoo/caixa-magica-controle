
import React from 'react';
import { Card } from '@/components/ui/card';
import { useCashFlow } from '@/context/CashFlowContext';
import { cn } from '@/lib/utils';

const BalanceCard: React.FC = () => {
  const { state } = useCashFlow();
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <Card className={cn(
      "balance-card",
      state.balance >= 0 ? "bg-turquoise text-white" : "bg-coral text-white"
    )}>
      <div className="space-y-4 p-5">
        <div className="text-sm opacity-90">Saldo em Caixa</div>
        <div className="text-3xl font-bold">{formatCurrency(state.balance)}</div>
      </div>
    </Card>
  );
};

export default BalanceCard;

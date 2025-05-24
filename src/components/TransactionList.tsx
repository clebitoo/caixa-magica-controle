
import React from 'react';
import { useCashFlow, Transaction } from '@/context/CashFlowContext';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowUp, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formattedDate = format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR });
  
  return (
    <div className="transaction-item mb-2">
      <Card className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            transaction.type === 'income' ? "bg-turquoise/10 text-turquoise" : "bg-coral/10 text-coral"
          )}>
            {transaction.type === 'income' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">{transaction.description || transaction.store}</h4>
              {transaction.receipt && (
                <FileImage size={12} className="text-gray-500" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
              {transaction.description && (
                <p className="text-xs text-muted-foreground">• {transaction.store}</p>
              )}
            </div>
          </div>
        </div>
        <p className={cn(
          "font-medium",
          transaction.type === 'income' ? "text-turquoise" : "text-coral"
        )}>
          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
        </p>
      </Card>
    </div>
  );
};

const TransactionList: React.FC = () => {
  const { state } = useCashFlow();
  
  const sortedTransactions = [...state.transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  if (sortedTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma transação registrada</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {sortedTransactions.map(transaction => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionList;

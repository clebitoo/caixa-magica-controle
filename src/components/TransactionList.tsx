
import React, { useState, useMemo } from 'react';
import { useCashFlow, Transaction } from '@/context/CashFlowContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowUp, FileImage, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import TransactionFilters, { FilterOptions } from './TransactionFilters';

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const { deleteTransaction } = useCashFlow();
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    toast.success('Transação removida com sucesso');
  };

  const formattedDate = format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR });
  
  return (
    <div className="transaction-item mb-2">
      <Card className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            transaction.type === 'income' ? "bg-turquoise/10 text-turquoise" : "bg-coral/10 text-coral"
          )}>
            {transaction.type === 'income' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium truncate">{transaction.description || transaction.store}</h4>
              {transaction.receipt && (
                <FileImage size={12} className="text-gray-500 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1">
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
              {transaction.description && (
                <p className="text-xs text-muted-foreground truncate">• {transaction.store}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className={cn(
            "font-medium text-sm",
            transaction.type === 'income' ? "text-turquoise" : "text-coral"
          )}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash size={14} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

const TransactionList: React.FC = () => {
  const { state } = useCashFlow();
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    dateRange: {}
  });

  const filteredTransactions = useMemo(() => {
    let filtered = [...state.transactions];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filters.type);
    }

    // Filter by date range
    if (filters.dateRange.from) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= filters.dateRange.from!;
      });
    }

    if (filters.dateRange.to) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate <= filters.dateRange.to!;
      });
    }

    // Sort by date (most recent first)
    return filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [state.transactions, filters]);
  
  if (state.transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhuma transação registrada</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <TransactionFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma transação encontrada com os filtros aplicados</p>
        </div>
      ) : (
        filteredTransactions.map(transaction => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))
      )}
    </div>
  );
};

export default TransactionList;

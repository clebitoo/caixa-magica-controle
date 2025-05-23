
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCashFlow } from '@/context/CashFlowContext';
import { toast } from '@/components/ui/sonner';

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction } = useCashFlow();
  
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }
    
    if (!description.trim()) {
      toast.error('Por favor, insira uma descrição');
      return;
    }
    
    addTransaction({
      date,
      amount: parseFloat(amount),
      store: 'Lagoa Encantada', // Poderia ser de qualquer loja para saídas
      description,
      type: 'expense'
    });
    
    toast.success('Saída adicionada com sucesso');
    navigate('/');
  };
  
  return (
    <div className="min-h-screen pb-16">
      <Header />
      <main className="container max-w-md px-4 py-6">
        <h2 className="text-xl font-medium mb-6">Registrar Saída</h2>
        
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Para que foi utilizado o dinheiro?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-coral hover:bg-coral-dark text-white"
              >
                Registrar Saída
              </Button>
            </div>
          </form>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default AddExpense;

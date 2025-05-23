
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCashFlow, Store } from '@/context/CashFlowContext';
import { toast } from '@/components/ui/sonner';

const AddIncome: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction } = useCashFlow();
  
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [store, setStore] = useState<Store>('Lagoa Encantada');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }
    
    addTransaction({
      date,
      amount: parseFloat(amount),
      store,
      description: '',
      type: 'income'
    });
    
    toast.success('Entrada adicionada com sucesso');
    navigate('/');
  };
  
  return (
    <div className="min-h-screen pb-16">
      <Header />
      <main className="container max-w-md px-4 py-6">
        <h2 className="text-xl font-medium mb-6">Registrar Entrada</h2>
        
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
            
            <div className="space-y-3">
              <Label>Loja</Label>
              <RadioGroup 
                value={store} 
                onValueChange={(value) => setStore(value as Store)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="lagoa" value="Lagoa Encantada" />
                  <Label htmlFor="lagoa">Lagoa Encantada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="prehistoric" value="Prehistoric Park" />
                  <Label htmlFor="prehistoric">Prehistoric Park</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-turquoise hover:bg-turquoise-dark"
              >
                Confirmar Entrada
              </Button>
            </div>
          </form>
        </Card>
      </main>
      <BottomNav />
    </div>
  );
};

export default AddIncome;

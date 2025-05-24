
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
import { Camera, X } from 'lucide-react';

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction } = useCashFlow();
  
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setReceiptFile(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (event) => {
          setReceipt(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Por favor, selecione apenas arquivos de imagem');
      }
    }
  };
  
  const removeReceipt = () => {
    setReceipt(null);
    setReceiptFile(null);
  };
  
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
      store: 'Lagoa Encantada',
      description,
      type: 'expense',
      receipt: receipt || undefined
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
            
            <div className="space-y-2">
              <Label htmlFor="receipt">Comprovante (Opcional)</Label>
              {!receipt ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <Label htmlFor="receipt-input" className="cursor-pointer">
                    <span className="text-sm text-gray-600">Toque para adicionar foto do comprovante</span>
                    <Input
                      id="receipt-input"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </Label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={receipt}
                    alt="Comprovante"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeReceipt}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}
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

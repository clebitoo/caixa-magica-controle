
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Caixa Capture Alchymist</h1>
        <div className="flex gap-2">
          {location.pathname === '/' && (
            <>
              <Button 
                size="sm"
                variant="outline" 
                className="flex items-center gap-1 border-turquoise text-turquoise"
                onClick={() => navigate('/adicionar-entrada')}
              >
                <ArrowDown size={16} />
                <span className="hidden sm:inline">Entrada</span>
              </Button>
              <Button 
                size="sm"
                variant="outline" 
                className="flex items-center gap-1 border-coral text-coral"
                onClick={() => navigate('/adicionar-saida')}
              >
                <ArrowUp size={16} />
                <span className="hidden sm:inline">Saída</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

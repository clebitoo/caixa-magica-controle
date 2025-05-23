
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Wallet, ArrowDown, ArrowUp } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg">
      <div className="flex justify-around">
        <Link 
          to="/"
          className={cn(
            "flex flex-col items-center py-3 px-5 flex-1",
            location.pathname === "/" && "text-turquoise"
          )}
        >
          <Wallet size={20} />
          <span className="text-xs mt-1">Resumo</span>
        </Link>
        <Link 
          to="/adicionar-entrada"
          className={cn(
            "flex flex-col items-center py-3 px-5 flex-1",
            location.pathname === "/adicionar-entrada" && "text-turquoise"
          )}
        >
          <ArrowDown size={20} />
          <span className="text-xs mt-1">Entrada</span>
        </Link>
        <Link 
          to="/adicionar-saida"
          className={cn(
            "flex flex-col items-center py-3 px-5 flex-1",
            location.pathname === "/adicionar-saida" && "text-turquoise"
          )}
        >
          <ArrowUp size={20} />
          <span className="text-xs mt-1">Saída</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;

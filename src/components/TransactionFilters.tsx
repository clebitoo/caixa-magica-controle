
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface FilterOptions {
  type: 'all' | 'income' | 'expense';
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

interface TransactionFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      type: value as FilterOptions['type']
    });
  };

  const handleDateRangeChange = (field: 'from' | 'to', date?: Date) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date
      }
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: 'all',
      dateRange: {}
    });
    setIsExpanded(false);
  };

  const hasActiveFilters = filters.type !== 'all' || filters.dateRange.from || filters.dateRange.to;

  return (
    <Card className="p-3 mb-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Filtros
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-turquoise rounded-full"></span>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpar
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Tipo</label>
            <ToggleGroup
              type="single"
              value={filters.type}
              onValueChange={handleTypeChange}
              className="justify-start"
            >
              <ToggleGroupItem value="all" className="text-xs">
                Todos
              </ToggleGroupItem>
              <ToggleGroupItem value="income" className="text-xs">
                Entradas
              </ToggleGroupItem>
              <ToggleGroupItem value="expense" className="text-xs">
                Saídas
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Período</label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-8">De:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !filters.dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        format(filters.dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Data inicial</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) => handleDateRangeChange('from', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-8">Até:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !filters.dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? (
                        format(filters.dateRange.to, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Data final</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) => handleDateRangeChange('to', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TransactionFilters;

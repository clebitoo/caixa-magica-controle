
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CashFlowProvider } from "@/context/CashFlowContext";
import Dashboard from "./pages/Dashboard";
import AddIncome from "./pages/AddIncome";
import AddExpense from "./pages/AddExpense";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CashFlowProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/adicionar-entrada" element={<AddIncome />} />
            <Route path="/adicionar-saida" element={<AddExpense />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CashFlowProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

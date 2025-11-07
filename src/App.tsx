import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import Clients from "./pages/Clients";
import Plans from "./pages/Plans";
import AccountsTrades from "./pages/AccountsTrades";
import KYPTool from "./pages/KYPTool";
import KYPReview from "./pages/KYPReview";
import KYPProductSelection from "./pages/KYPProductSelection";
import KYPComparison from "./pages/KYPComparison";
import KYPFinalReview from "./pages/KYPFinalReview";
import TradeCompliance from "./pages/TradeCompliance";
import InvoicesPayments from "./pages/InvoicesPayments";
import Members from "./pages/Members";
import Permissions from "./pages/Permissions";
import Chat from "./pages/Chat";
import Meetings from "./pages/Meetings";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage)
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      if (window.location.pathname !== '/') {
        window.history.replaceState(null, '', '/');
      }
    }
  }, []);

  const handleSignIn = (userId: string, password: string) => {
    // Simulate authentication - in a real app, this would be an API call
    // For now, accept any non-empty credentials
    if (userId && password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', userId);
      setIsAuthenticated(true);
      if (window.location.pathname !== '/') {
        window.history.replaceState(null, '', '/');
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider value={{ signOut: handleSignOut }}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {isAuthenticated ? (
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/plans" element={<Plans />} />
                  <Route path="/accounts-trades" element={<AccountsTrades />} />
                  <Route path="/kyp-tool" element={<KYPTool />} />
                  <Route path="/kyp-review" element={<KYPReview />} />
                  <Route path="/kyp-product-selection" element={<KYPProductSelection />} />
                  <Route path="/kyp-comparison" element={<KYPComparison />} />
                  <Route path="/kyp-final-review" element={<KYPFinalReview />} />
                  <Route path="/kyp-final-review" element={<KYPFinalReview />} />
                  <Route path="/trade-compliance" element={<TradeCompliance />} />
                  <Route path="/invoices-payments" element={<InvoicesPayments />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/permissions" element={<Permissions />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/meetings" element={<Meetings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            ) : (
              <SignIn onSignIn={handleSignIn} />
            )}
          </TooltipProvider>
        </AuthProvider>
    </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

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
import Clients from "./pages/Clients";
import Plans from "./pages/Plans";
import AccountsTrades from "./pages/AccountsTrades";
import Compliance from "./pages/Compliance";
import AuditLog from "./pages/AuditLog";
import Settings from "./pages/Settings";
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
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/plans" element={<Plans />} />
                  <Route path="/accounts-trades" element={<AccountsTrades />} />
                  <Route path="/compliance" element={<Compliance />} />
                  <Route path="/audit-log" element={<AuditLog />} />
                  <Route path="/settings" element={<Settings />} />
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

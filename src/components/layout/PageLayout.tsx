
import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      
      <div className="flex-1 flex flex-col">
        <div className="fixed top-0 right-0 transition-all duration-300 z-30" style={{ left: isSidebarCollapsed ? '64px' : '256px' }}>
          <Navbar />
        </div>
        
        <main className="flex-1 overflow-y-auto bg-white mt-16 transition-all duration-300" style={{ marginLeft: isSidebarCollapsed ? '64px' : '256px' }}>
          <div className="container max-w-full px-3 lg:px-4 pb-3 lg:pb-4 animate-fade-in">
            {title && <h1 className="text-2xl font-bold mb-6 text-gray-900">{title}</h1>}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

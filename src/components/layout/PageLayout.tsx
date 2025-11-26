
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto bg-white mt-16">
        <div className="container max-w-full px-3 lg:px-4 pb-3 lg:pb-4 animate-fade-in">
          {title && <h1 className="text-2xl font-bold mb-6 text-gray-900">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
}

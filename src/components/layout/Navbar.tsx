
import React from 'react';
import { Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface NavbarProps {
  className?: string;
  onMenuClick?: () => void;
}

export function Navbar({ className, onMenuClick }: NavbarProps) {
  return (
    <header className={cn("bg-white fixed top-0 left-0 right-0 z-30", className)}>
      <div className="w-full flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">OneLink</h1>
          <p className="text-xs text-gray-600 ml-4">Welcome Back, Nelson</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9 text-gray-600 hover:text-gray-900"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          </Button>
          
          <Avatar className="h-9 w-9 transition-transform duration-200 hover:scale-105">
            <AvatarFallback className="bg-gray-100 text-gray-900">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}


import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  ArrowLeftRight,
  Users,
  CreditCard,
  Briefcase,
  FileSearch,
  Scale,
  Receipt,
  UserCircle,
  Shield,
  MessageSquare,
  Video,
  Menu,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const navItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/',
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
    },
    {
      title: 'Transactions',
      icon: ArrowLeftRight,
      href: '/transactions',
    },
    {
      title: 'Clients',
      icon: Users,
      href: '/clients',
    },
    {
      title: 'Plans',
      icon: CreditCard,
      href: '/plans',
    },
    {
      title: 'Accounts & Trades',
      icon: Briefcase,
      href: '/accounts-trades',
    },
    {
      title: 'KYP',
      icon: FileSearch,
      href: '/kyp-tool',
    },
    {
      title: 'Trade Supervision',
      icon: Scale,
      href: '/trade-compliance',
    },
    {
      title: 'Invoices & Payments',
      icon: Receipt,
      href: '/invoices-payments',
    },
    {
      title: 'Members',
      icon: UserCircle,
      href: '/members',
    },
    {
      title: 'Permissions',
      icon: Shield,
      href: '/permissions',
    },
    {
      title: 'Chat',
      icon: MessageSquare,
      href: '/chat',
    },
    {
      title: 'Meetings',
      icon: Video,
      href: '/meetings',
    }
  ];

  return (
    <aside className={cn(
      "bg-white fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-in-out flex flex-col",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header with OneLink and Toggle */}
      <div className={cn(
        "h-16 flex items-center",
        isCollapsed ? "justify-center px-0" : "px-4 justify-between"
      )}>
        <div className="flex-1">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-gray-900">OneLink</h1>
              <p className="text-xs text-gray-600">Welcome Back Antoine Marsh</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "text-gray-400 hover:text-gray-600",
            isCollapsed && "h-9 w-9"
          )}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <nav className={cn(
          "grid gap-1",
          isCollapsed ? "px-2 py-2" : "px-2 py-4"
        )}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center rounded-md transition-colors hover:bg-gray-100",
                  isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600",
                  isCollapsed 
                    ? "justify-center h-10 w-10 mx-auto" 
                    : "gap-3 px-3 py-2"
                )}
              >
                <item.icon className={cn(
                  "shrink-0",
                  isCollapsed ? "h-5 w-5" : "h-5 w-5"
                )} />
                <span className={cn(
                  "text-sm font-medium transition-opacity duration-200 whitespace-nowrap",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 ml-0"
                )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div
        className={cn(
          "border-t border-gray-200 p-4",
          isCollapsed ? "flex justify-center" : ""
        )}
      >
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-2 text-gray-700 hover:text-gray-900",
            isCollapsed && "w-10 h-10 justify-center px-0"
          )}
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}

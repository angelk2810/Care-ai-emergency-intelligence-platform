import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, LayoutDashboard, Settings, Activity, Home } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/assessment', icon: Activity, label: 'Assessment' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">CARE-AI</span>
        </Link>
        
        <div className="hidden md:flex md:items-center md:gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/assessment"
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
          >
            Start Triage
          </Link>
        </div>
      </div>
    </nav>
  );
};

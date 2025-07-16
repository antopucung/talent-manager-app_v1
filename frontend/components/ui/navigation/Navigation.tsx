import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Plus, Film, Sparkles, CreditCard, Home, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Container } from '../layout/Container';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/talents', label: 'Talents', icon: Users },
    { path: '/talents/new', label: 'Add Talent', icon: Plus },
    { path: '/projects/new', label: 'New Project', icon: Film },
    { path: '/ai/story-enhancer', label: 'AI Story', icon: Sparkles },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                TalentHub
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive(item.path) ? 'default' : 'ghost'} 
                    size="sm"
                    className={cn(
                      'flex items-center space-x-2 transition-all duration-200',
                      isActive(item.path) 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                        : 'hover:bg-neutral-100'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/subscriptions">
              <Button 
                variant={isActive('/subscriptions') ? 'default' : 'outline'} 
                size="sm"
                className={cn(
                  'flex items-center space-x-2',
                  isActive('/subscriptions') 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0' 
                    : 'border-neutral-300 hover:border-primary-300'
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Premium</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}

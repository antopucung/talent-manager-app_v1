import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Plus, Film, Sparkles, CreditCard, Home, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Container } from '../layout/Container';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/landing', label: 'Gallery', icon: Star },
    { path: '/talents', label: 'Talents', icon: Users },
    { path: '/talents/new', label: 'Add Talent', icon: Plus },
    { path: '/projects/new', label: 'New Project', icon: Film },
    { path: '/ai/story-enhancer', label: 'AI Magic', icon: Sparkles },
  ];

  return (
    <nav className="bg-gradient-to-r from-dark-50/95 to-dark-100/95 backdrop-blur-xl shadow-mega border-b border-white/10 sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center shadow-neon group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                <Zap className="h-6 w-6 text-white animate-pulse" />
              </div>
              <span className="text-2xl font-bold font-display bg-gradient-neon bg-clip-text text-transparent">
                TalentHub
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive(item.path) ? 'default' : 'ghost'} 
                    size="sm"
                    className={cn(
                      'flex items-center space-x-2 transition-all duration-300 font-semibold',
                      isActive(item.path) 
                        ? 'bg-gradient-primary text-white shadow-electric border-0 scale-105' 
                        : 'hover:bg-white/10 hover:text-primary-500 text-dark-700'
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
                  'flex items-center space-x-2 font-semibold transition-all duration-300',
                  isActive('/subscriptions') 
                    ? 'bg-gradient-secondary text-white border-0 shadow-pink' 
                    : 'border-2 border-secondary-300 hover:bg-gradient-secondary hover:text-white hover:border-secondary-500 text-secondary-600'
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Premium</span>
                <Star className="h-4 w-4 animate-pulse" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}

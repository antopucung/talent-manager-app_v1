import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Plus, Film, Sparkles, CreditCard, Home, Star, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Container } from '../layout/Container';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isTalentEcosystemActive = () => 
    location.pathname.includes('/talents') || location.pathname.includes('/projects');

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-apple border-b border-neutral-100 sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center shadow-apple group-hover:shadow-apple-lg transition-all duration-300">
                <Film className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-neutral-900">
                TalentHub
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  size="sm"
                  className={cn(
                    'flex items-center space-x-2 transition-all duration-200 font-medium',
                    isActive('/') 
                      ? 'bg-neutral-900 text-white shadow-apple' 
                      : 'hover:bg-neutral-100 text-neutral-700'
                  )}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>

              <Link to="/landing">
                <Button 
                  variant={isActive('/landing') ? 'default' : 'ghost'} 
                  size="sm"
                  className={cn(
                    'flex items-center space-x-2 transition-all duration-200 font-medium',
                    isActive('/landing') 
                      ? 'bg-neutral-900 text-white shadow-apple' 
                      : 'hover:bg-neutral-100 text-neutral-700'
                  )}
                >
                  <Star className="h-4 w-4" />
                  <span>Showcase</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={isTalentEcosystemActive() ? 'default' : 'ghost'} 
                    size="sm"
                    className={cn(
                      'flex items-center space-x-2 transition-all duration-200 font-medium',
                      isTalentEcosystemActive() 
                        ? 'bg-neutral-900 text-white shadow-apple' 
                        : 'hover:bg-neutral-100 text-neutral-700'
                    )}
                  >
                    <Users className="h-4 w-4" />
                    <span>Talent</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-neutral-200 shadow-apple-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/talents" className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50">
                      <Users className="h-4 w-4" />
                      <span>Browse Talent</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/talents/new" className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50">
                      <Plus className="h-4 w-4" />
                      <span>Add Talent</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/projects/new" className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50">
                      <Film className="h-4 w-4" />
                      <span>Create Project</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link to="/ai/story-enhancer">
                <Button 
                  variant={isActive('/ai/story-enhancer') ? 'default' : 'ghost'} 
                  size="sm"
                  className={cn(
                    'flex items-center space-x-2 transition-all duration-200 font-medium',
                    isActive('/ai/story-enhancer') 
                      ? 'bg-primary-600 text-white shadow-apple' 
                      : 'hover:bg-neutral-100 text-neutral-700'
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Studio</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/subscriptions">
              <Button 
                variant={isActive('/subscriptions') ? 'default' : 'outline'} 
                size="sm"
                className={cn(
                  'flex items-center space-x-2 font-medium transition-all duration-200',
                  isActive('/subscriptions') 
                    ? 'bg-film-gold text-white shadow-apple border-0' 
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Pro</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}

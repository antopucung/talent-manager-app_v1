import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Plus, Film, Sparkles, CreditCard, Home, Star, Zap, ChevronDown } from 'lucide-react';
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
    <nav className="bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-700/50 sticky top-0 z-50">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-display bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TalentHub
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  size="sm"
                  className={cn(
                    'flex items-center space-x-2 transition-all duration-300 font-semibold',
                    isActive('/') 
                      ? 'bg-blue-600 text-white shadow-lg border-0' 
                      : 'hover:bg-slate-800 hover:text-blue-400 text-slate-300'
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
                    'flex items-center space-x-2 transition-all duration-300 font-semibold',
                    isActive('/landing') 
                      ? 'bg-blue-600 text-white shadow-lg border-0' 
                      : 'hover:bg-slate-800 hover:text-blue-400 text-slate-300'
                  )}
                >
                  <Star className="h-4 w-4" />
                  <span>Gallery</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={isTalentEcosystemActive() ? 'default' : 'ghost'} 
                    size="sm"
                    className={cn(
                      'flex items-center space-x-2 transition-all duration-300 font-semibold',
                      isTalentEcosystemActive() 
                        ? 'bg-blue-600 text-white shadow-lg border-0' 
                        : 'hover:bg-slate-800 hover:text-blue-400 text-slate-300'
                    )}
                  >
                    <Users className="h-4 w-4" />
                    <span>Talent Ecosystem</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-800 border-slate-700 shadow-xl">
                  <DropdownMenuItem asChild>
                    <Link to="/talents" className="flex items-center space-x-2 text-slate-200 hover:text-blue-400 hover:bg-slate-700">
                      <Users className="h-4 w-4" />
                      <span>Browse Talents</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/talents/new" className="flex items-center space-x-2 text-slate-200 hover:text-blue-400 hover:bg-slate-700">
                      <Plus className="h-4 w-4" />
                      <span>Add New Talent</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/projects/new" className="flex items-center space-x-2 text-slate-200 hover:text-blue-400 hover:bg-slate-700">
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
                    'flex items-center space-x-2 transition-all duration-300 font-semibold',
                    isActive('/ai/story-enhancer') 
                      ? 'bg-purple-600 text-white shadow-lg border-0' 
                      : 'hover:bg-slate-800 hover:text-purple-400 text-slate-300'
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Magic</span>
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
                  'flex items-center space-x-2 font-semibold transition-all duration-300',
                  isActive('/subscriptions') 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg' 
                    : 'border-2 border-purple-500/50 hover:bg-purple-600 hover:text-white hover:border-purple-500 text-purple-400'
                )}
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Premium</span>
                <Star className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}

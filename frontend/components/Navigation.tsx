import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Plus, Film, Sparkles, CreditCard, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TalentHub
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>

              <Link to="/talents">
                <Button 
                  variant={isActive('/talents') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Talents</span>
                </Button>
              </Link>
              
              <Link to="/talents/new">
                <Button 
                  variant={isActive('/talents/new') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Talent</span>
                </Button>
              </Link>
              
              <Link to="/projects/new">
                <Button 
                  variant={isActive('/projects/new') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Film className="h-4 w-4" />
                  <span>New Project</span>
                </Button>
              </Link>
              
              <Link to="/ai/story-enhancer">
                <Button 
                  variant={isActive('/ai/story-enhancer') ? 'default' : 'ghost'} 
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI Story</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/subscriptions">
              <Button 
                variant={isActive('/subscriptions') ? 'default' : 'outline'} 
                size="sm"
                className="flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Subscriptions</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { TalentList } from './components/TalentList';
import { TalentForm } from './components/TalentForm';
import { TalentDetail } from './components/TalentDetail';
import { ProjectForm } from './components/ProjectForm';
import { AIStoryEnhancer } from './components/AIStoryEnhancer';
import { TalentMatching } from './components/TalentMatching';
import { SubscriptionPlans } from './components/SubscriptionPlans';

const queryClient = new QueryClient();

function AppInner() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/talents" element={<TalentList />} />
            <Route path="/talents/new" element={<TalentForm />} />
            <Route path="/talents/:id" element={<TalentDetail />} />
            <Route path="/talents/:id/edit" element={<TalentForm />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/ai/story-enhancer" element={<AIStoryEnhancer />} />
            <Route path="/projects/:id/matching" element={<TalentMatching />} />
            <Route path="/subscriptions" element={<SubscriptionPlans />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}

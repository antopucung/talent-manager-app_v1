import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Check, Star, Zap, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export function SubscriptionPlans() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: backend.subscription.createSubscription,
    onSuccess: (data) => {
      toast({ 
        title: 'Success', 
        description: `Subscription created! Expires: ${new Date(data.expiresAt).toLocaleDateString()}` 
      });
    },
    onError: (error) => {
      console.error('Subscription error:', error);
      toast({ title: 'Error', description: 'Failed to create subscription', variant: 'destructive' });
    }
  });

  const handleSubscribe = (subscriptionType: string, tier: string, billingCycle: string) => {
    // For demo purposes, using a dummy user ID
    subscribeMutation.mutate({
      userType: 'talent',
      userId: 1,
      subscriptionType: subscriptionType as any,
      tier: tier as any,
      billingCycle: billingCycle as any
    });
  };

  const plans = [
    {
      name: 'Gallery Upgrade',
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      description: 'Expand your portfolio with unlimited media uploads',
      tiers: [
        {
          name: 'Basic',
          monthlyPrice: 14.99,
          yearlyPrice: 149.99,
          features: [
            'Up to 50 photos',
            'Up to 10 videos',
            'Basic analytics',
            'Standard support'
          ]
        },
        {
          name: 'Premium',
          monthlyPrice: 29.99,
          yearlyPrice: 299.99,
          features: [
            'Unlimited photos',
            'Unlimited videos',
            'Advanced analytics',
            'Priority support',
            'Custom portfolio themes',
            'HD video streaming'
          ]
        }
      ]
    },
    {
      name: 'Verification Badge',
      icon: <Check className="h-8 w-8 text-blue-500" />,
      description: 'Get verified and stand out to clients',
      tiers: [
        {
          name: 'Verified',
          monthlyPrice: 9.99,
          yearlyPrice: 99.99,
          features: [
            'Blue verification checkmark',
            'Enhanced profile visibility',
            'Trust badge display',
            'Priority in search results',
            'Verified talent directory listing'
          ]
        }
      ]
    },
    {
      name: 'AI Premium',
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      description: 'Advanced AI features for better matching and storytelling',
      tiers: [
        {
          name: 'Basic',
          monthlyPrice: 24.99,
          yearlyPrice: 249.99,
          features: [
            '50 AI story enhancements/month',
            'Basic talent matching',
            'Standard AI insights',
            'Email support'
          ]
        },
        {
          name: 'Premium',
          monthlyPrice: 49.99,
          yearlyPrice: 499.99,
          features: [
            'Unlimited AI story enhancements',
            'Advanced talent matching',
            'Detailed AI insights & analytics',
            'Custom AI recommendations',
            'Priority support',
            'Early access to new AI features'
          ]
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-600">Choose the perfect plan to enhance your talent management experience</p>
        </div>
      </div>

      <div className="space-y-8">
        {plans.map((plan) => (
          <div key={plan.name} className="space-y-4">
            <div className="flex items-center space-x-3">
              {plan.icon}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-gray-600">{plan.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plan.tiers.map((tier) => (
                <Card key={tier.name} className={`relative ${tier.name === 'Premium' ? 'border-purple-200 shadow-lg' : ''}`}>
                  {tier.name === 'Premium' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">
                        ${tier.monthlyPrice}
                        <span className="text-lg font-normal text-gray-600">/month</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        or ${tier.yearlyPrice}/year (save ${(tier.monthlyPrice * 12 - tier.yearlyPrice).toFixed(2)})
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        variant={tier.name === 'Premium' ? 'default' : 'outline'}
                        onClick={() => handleSubscribe(
                          plan.name === 'Gallery Upgrade' ? 'gallery_upgrade' :
                          plan.name === 'Verification Badge' ? 'verification' : 'ai_premium',
                          tier.name.toLowerCase(),
                          'monthly'
                        )}
                        disabled={subscribeMutation.isPending}
                      >
                        Subscribe Monthly
                      </Button>
                      
                      <Button 
                        className="w-full"
                        variant="outline"
                        onClick={() => handleSubscribe(
                          plan.name === 'Gallery Upgrade' ? 'gallery_upgrade' :
                          plan.name === 'Verification Badge' ? 'verification' : 'ai_premium',
                          tier.name.toLowerCase(),
                          'yearly'
                        )}
                        disabled={subscribeMutation.isPending}
                      >
                        Subscribe Yearly (Save 17%)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose TalentHub Premium?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="space-y-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <h4 className="font-semibold">Enhanced Visibility</h4>
              <p className="text-sm text-gray-600">
                Get featured in search results and attract more clients with premium features.
              </p>
            </div>
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-purple-500" />
              <h4 className="font-semibold">AI-Powered Matching</h4>
              <p className="text-sm text-gray-600">
                Our advanced AI analyzes your profile and matches you with the perfect projects.
              </p>
            </div>
            <div className="space-y-2">
              <Crown className="h-8 w-8 text-blue-500" />
              <h4 className="font-semibold">Professional Credibility</h4>
              <p className="text-sm text-gray-600">
                Build trust with verification badges and professional portfolio features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Heart, Users, Zap, ArrowRight, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

interface Plan {
  id: string;
  title: string;
  price: number;
  trainer: {
    id: string;
    name: string;
  };
  preview: boolean;
}

export default function Home() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await api.get("/plans");
      setPlans(data.plans || []);
    } catch (error: any) {
      console.error("Failed to fetch plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPlan = (planId: string) => {
    window.location.href = `/plans/${planId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Transform Your Fitness Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access expert-designed workout plans from certified trainers. Start
            building the body you've always wanted.
          </p>
          <Button size="lg" className="gap-2">
            Browse Plans <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Expert Trainers</h3>
              <p className="text-muted-foreground">
                Plans designed by certified fitness professionals
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Proven Results</h3>
              <p className="text-muted-foreground">
                Join thousands who've achieved their fitness goals
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Flexible Plans</h3>
              <p className="text-muted-foreground">
                Choose from beginner to advanced programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground">
              Find the perfect program for your fitness level
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : plans.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No plans available yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card key={plan.id} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2">
                      <Badge variant="secondary">Preview Available</Badge>
                    </div>
                    <CardTitle className="text-2xl">{plan.title}</CardTitle>
                    <CardDescription>By {plan.trainer.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Monthly Price
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">
                          ₹{plan.price}
                        </span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleViewPlan(plan.id)}
                    >
                      View Plan
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join our community and get access to all plans. Cancel anytime.
          </p>
          <Button size="lg" variant="secondary">
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 FitPlanHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

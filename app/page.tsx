"use client";

import Navbar from "@/components/navbar";
import PlanCard from "@/components/plancard";
import api from "@/lib/api";
import { Plan } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      setPlans(data.plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }

    const handleSubscribe = (planId: string) => {
      router.push(`/plans/${planId}`);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Transform Your Fitness Journey
            </h1>
            <p className="text-xl text-muted-foreground">
              Subscribe to plans created by certified trainers
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No plans available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    );
  };
}

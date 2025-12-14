"use client";

import Navbar from "@/components/navbar";
import PlanCard from "@/components/plancard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Plan, Subscription } from "@/types";
import { Calendar, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [feedPlans, setFeedPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "user")) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchFeed();
    }
  }, [user, authLoading]);

  const fetchFeed = async () => {
    try {
      const { data } = await api.get("/feed");
      setFeedPlans(data.followedTrainersPlans || []);
      setSubscriptions(data.mySubscriptions || []);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planId: string) => {
    router.push(`/plans/${planId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">My Subscriptions</h2>
          {subscriptions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  You haven&apos;t subscribed to any plans yet. Browse plans on the
                  home page!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub) => (
                <Card key={sub.id}>
                  <CardHeader>
                    <CardTitle>{sub.plan.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {sub.plan.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Rs.{sub.plan.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{sub.plan.duration} days</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Expires: {new Date(sub.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Plans from Trainers I Follow
          </h2>
          {feedPlans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No plans available. Follow trainers to see their plans here!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSubscribe={handleSubscribe}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

import Navbar from "@/components/navbar";
import api from "@/lib/api";
import { Plan } from "@/types";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Lock, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function PlanDetailsPage(){
    const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, [params.id]);

  const fetchPlan = async () => {
    try {
      const { data } = await api.get(`/plans/${params.id}`);
      setPlan(data.plan);
    } catch (error) {
      console.error('Failed to fetch plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!plan) return;
    
    const confirmed = confirm(
      `Subscribe to "${plan.title}" for ₹${plan.price}?`
    );
    
    if (!confirmed) return;

    try {
      setSubscribing(true);
      await api.post('/subscriptions/subscribe', { planId: plan.id });
      alert('Successfully subscribed!');
      fetchPlan(); // Refresh to show full details
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-destructive">Plan not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">{plan.title}</CardTitle>
            {plan.trainer && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <Link 
                  href={`/trainer/${plan.trainer.id}`}
                  className="hover:underline"
                >
                  {plan.trainer.name}
                </Link>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-2xl font-bold">₹{plan.price}</span>
              </div>
              {plan.duration && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>{plan.duration} days</span>
                </div>
              )}
            </div>

            {plan.preview ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <Lock className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
                <h3 className="text-lg font-semibold mb-2">
                  Subscribe to View Full Details
                </h3>
                <p className="text-muted-foreground mb-4">
                  This plan is locked. Subscribe to access the complete workout details.
                </p>
                <Button onClick={handleSubscribe} disabled={subscribing}>
                  {subscribing ? 'Processing...' : `Subscribe for ₹${plan.price}`}
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Workout Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(plan.workoutDetails, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-medium">
                    ✓ You have access to this plan
                  </p>
                </div>
              </>
            )}

            <div className="pt-4">
              <Button variant="outline" onClick={() => router.back()}>
                ← Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  ); 
}
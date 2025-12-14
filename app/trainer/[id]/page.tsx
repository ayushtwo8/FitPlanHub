import Navbar from "@/components/navbar";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Plan, Trainer } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlanCard from "@/components/plancard";


export default function TrainerProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTrainer();
  }, [params.id]);

  const fetchTrainer = async () => {
    try {
      const { data } = await api.get(`/trainers/${params.id}`);
      setTrainer(data.trainer);
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Failed to fetch trainer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      alert('Please login to follow trainers');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/trainers/${params.id}/follow`);
      fetchTrainer();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to follow trainer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setActionLoading(true);
      await api.delete(`/trainers/${params.id}/unfollow`);
      fetchTrainer();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to unfollow trainer');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading trainer profile...</p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-destructive">Trainer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl mb-2">{trainer.name}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{trainer.email}</span>
                </div>
              </div>

              {user && user.role === 'user' && (
                <div>
                  {trainer.isFollowing ? (
                    <Button
                      variant="outline"
                      onClick={handleUnfollow}
                      disabled={actionLoading}
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      {actionLoading ? 'Processing...' : 'Unfollow'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFollow}
                      disabled={actionLoading}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {actionLoading ? 'Processing...' : 'Follow'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground">
              {plans.length} plan{plans.length !== 1 ? 's' : ''} created
            </p>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Plans by {trainer.name}</h2>
          
          {plans.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  This trainer hasn&apos;t created any plans yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
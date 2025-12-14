"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, UserPlus, UserMinus } from "lucide-react";
import api from "@/lib/api";
import { useEffect, useState } from "react";

interface Trainer {
  id: string;
  name: string;
  email: string;
  planCount: number;
}

export default function TrainersPage() {
  const { user, loading: authLoading } = useAuth();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all trainers (public endpoint)
      const { data: trainersData } = await api.get("/trainers");
      setTrainers(trainersData.trainers || []);

      // If user is logged in, fetch their following list
      if (user) {
        try {
          const { data: followingData } = await api.get("/trainers/following");
          const followingIds = new Set(
            followingData.trainers?.map((t: Trainer) => t.id) || []
          );
          setFollowing(followingIds);
        } catch (err) {
          // User might not be following anyone, that's fine
          console.log("No following data");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load trainers");
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async (trainerId: string) => {
    if (!user) {
      setError("Please log in to follow trainers");
      return;
    }

    const isFollowing = following.has(trainerId);
    setActionLoading(trainerId);

    try {
      if (isFollowing) {
        await api.delete(`/trainers/${trainerId}/unfollow`);
        setFollowing((prev) => {
          const next = new Set(prev);
          next.delete(trainerId);
          return next;
        });
      } else {
        await api.post(`/trainers/${trainerId}/follow`);
        setFollowing((prev) => new Set(prev).add(trainerId));
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `Failed to ${isFollowing ? "unfollow" : "follow"} trainer`
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-background sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold">FitPlanHub</div>
            <div className="flex gap-3">
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">FitPlanHub</div>
          <div className="flex gap-3">
            {user ? (
              <Button variant="outline">{user.name}</Button>
            ) : (
              <>
                <Button variant="ghost">Sign In</Button>
                <Button>Get Started</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover Trainers</h1>
          <p className="text-muted-foreground">
            Find expert trainers and follow them to see their latest plans
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {trainers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No trainers available right now.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer) => {
              const isFollowing = following.has(trainer.id);
              const isLoading = actionLoading === trainer.id;

              return (
                <Card key={trainer.id}>
                  <CardHeader>
                    <CardTitle>{trainer.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {trainer.email}
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">{trainer.planCount}</span>
                      <span className="text-muted-foreground">
                        {trainer.planCount === 1 ? "plan" : "plans"} created
                      </span>
                    </div>

                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      className="w-full gap-2"
                      onClick={() => toggleFollow(trainer.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
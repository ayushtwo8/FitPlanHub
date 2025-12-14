import Navbar from "@/components/navbar";
import PlanForm from "@/components/planform";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Plan } from "@/types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TrainerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "trainer")) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchMyPlans();
    }
  }, [user, authLoading]);

  const fetchMyPlans = async () => {
    try {
      const { data } = await api.get("/plans");
      const myPlans = data.plans.filter(
        (p: Plan) => p.trainer?.id === user?.id
      );
      setPlans(myPlans);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (data: any) => {
    try {
      await api.post("/plans", data);
      setShowForm(false);
      fetchMyPlans();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to create plan");
    }
  };

  const handleUpdatePlan = async (data: any) => {
    if (!editingPlan) return;
    try {
      await api.put(`/plans/${editingPlan.id}`, data);
      setEditingPlan(null);
      setShowForm(false);
      fetchMyPlans();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to update plan");
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      await api.delete(`/plans/${planId}`);
      fetchMyPlans();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to delete plan");
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPlan(null);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Fitness Plans</h1>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Plan
            </Button>
          )}
        </div>

        {showForm && (
          <div className="mb-8">
            <PlanForm
              initialData={editingPlan || undefined}
              onSubmit={editingPlan ? handleUpdatePlan : handleCreatePlan}
              submitText={editingPlan ? "Update Plan" : "Create Plan"}
            />
            <Button
              variant="outline"
              onClick={handleCancelForm}
              className="mt-4"
            >
              Cancel
            </Button>
          </div>
        )}

        {!showForm && (
          <>
            {plans.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    You haven&apos;t created any plans yet. Click "Create New
                    Plan" to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <CardTitle>{plan.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {plan.description}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Price:</strong> ₹{plan.price}
                        </p>
                        <p>
                          <strong>Duration:</strong> {plan.duration} days
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plan)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

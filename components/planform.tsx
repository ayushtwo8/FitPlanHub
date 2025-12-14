"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const planSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  workoutDetails: z.string().min(10, "Workout details are required"),
});

type PlanFormData = z.infer<typeof planSchema>;

interface PlanFormProps {
  initialData?: Partial<PlanFormData>;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  submitText?: string;
}

export default function PlanForm({
  initialData,
  onSubmit,
  loading,
  submitText = "Create Plan",
}: PlanFormProps) {

    const { register, handleSubmit, formState: { errors } } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: initialData ? {
      ...initialData,
      workoutDetails: typeof initialData.workoutDetails === 'string' 
        ? initialData.workoutDetails 
        : JSON.stringify(initialData.workoutDetails, null, 2),
    } : undefined,
  });

  const handleFormSubmit = async (data: PlanFormData) => {
    try {
      const workoutDetails = JSON.parse(data.workoutDetails);
      await onSubmit({
        ...data,
        workoutDetails,
      });
    } catch (error) {
      alert('Invalid JSON in workout details');
    }
  };

  return <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Plan Title</Label>
            <Input
              id="title"
              placeholder="e.g., Fat Loss Beginner Plan"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Describe your fitness plan..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                placeholder="999"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="30"
                {...register('duration', { valueAsNumber: true })}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workoutDetails">Workout Details (JSON)</Label>
            <textarea
              id="workoutDetails"
              rows={10}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              placeholder={`{
  "type": "Fat Loss",
  "days": [
    {
      "day": 1,
      "exercises": [
        {"name": "Jumping Jacks", "sets": 3, "reps": 20}
      ]
    }
  ]
}`}
              {...register('workoutDetails')}
            />
            {errors.workoutDetails && (
              <p className="text-sm text-destructive">{errors.workoutDetails.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Enter workout details as valid JSON format
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : submitText}
          </Button>
        </CardFooter>
      </form>
    </Card>
}

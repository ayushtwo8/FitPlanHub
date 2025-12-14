"use client";

import { Plan } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calendar, DollarSign, Link, User } from "lucide-react";
import { Button } from "./ui/button";

interface PlanCardProps {
  plan: Plan;
  onSubscribe?: (planId: string) => void;
  showActions?: boolean;
}

export default function PlanCard({
  plan,
  onSubscribe,
  showActions = true,
}: PlanCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{plan.title}</CardTitle>
        {plan.trainer && (
          <CardDescription className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {plan.trainer.name}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold">Rs {plan.price}</span>
          </div>

          {plan.duration && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{plan.duration}</span>
            </div>
          )}

          {!plan.preview && plan.description && (
            <p className="text-sm text-muted-foreground mt-2">
              {plan.description}
            </p>
          )}

          {plan.preview && (
            <p className="text-sm text-yellow-600 font-medium">
              Subscribe to view full details
            </p>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="gap-2">
          <Link href={`/plans/${plan.id}`} className="flex-1">
            <Button variant={"outline"} className="w-full">
              View Details
            </Button>
          </Link>
          {plan.preview && onSubscribe && (
            <Button onClick={() => onSubscribe(plan.id)} className="flex-1">
              Subscribe
            </Button>
          )}
          {plan.isSubscribed && (
            <span className="text-sm text-green-600 font-medium">
              ✓ Subscribed
            </span>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

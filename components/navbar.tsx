"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          FitPlanHub
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.name} ({user.role})
              </span>
              <Link href="/trainers">Trainers</Link>
              <Link
                href={
                  user.role === "trainer"
                    ? "/dashboard/trainer"
                    : "/dashboard/user"
                }
              >
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Button onClick={logout} variant="destructive">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'trainer';
}

export interface Plan {
  id: string;
  title: string;
  description?: string;
  price: number;
  duration?: number;
  workoutDetails?: any;
  trainer?: {
    id: string;
    name: string;
  };
  preview?: boolean;
  isSubscribed?: boolean;
  createdAt?: string;
}

export interface Subscription {
  id: string;
  plan: {
    title: string;
    description: string;
    price: number;
    duration: number;
    workoutDetails: any;
    trainerId: string;
    trainerName: string;
  };
  purchaseDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  planCount?: number;
  isFollowing?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'trainer') => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'user' | 'trainer') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}
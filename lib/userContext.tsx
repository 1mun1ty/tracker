'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
}

// Two users: Ali and Ahad with passwords
export const USERS: User[] = [
  {
    id: 'user-ali',
    name: 'Ali',
    email: 'ali@timeflow.app',
    avatar: 'A',
    password: 'ali123',
  },
  {
    id: 'user-ahad',
    name: 'Ahad',
    email: 'ahad@timeflow.app',
    avatar: 'H',
    password: 'ahad123',
  },
];

interface UserContextType {
  user: User | null;
  login: (userId: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for saved user
    const savedUserId = localStorage.getItem('timeflow_user');
    if (savedUserId) {
      const foundUser = USERS.find(u => u.id === savedUserId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userId: string, password: string): { success: boolean; error?: string } => {
    const foundUser = USERS.find(u => u.id === userId);
    if (!foundUser) {
      return { success: false, error: 'User not found' };
    }
    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }
    setUser(foundUser);
    localStorage.setItem('timeflow_user', userId);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('timeflow_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

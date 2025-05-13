"use client";

// This file is kept for backward compatibility
// The actual auth provider is now in the root layout using StackProvider
// This is an empty component that just renders its children

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}

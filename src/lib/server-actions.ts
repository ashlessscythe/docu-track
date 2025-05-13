"use server";

import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { hasTeamPermission, getUserTeam } from "./team-permissions";
import { TeamPermission } from "@/lib/types";

/**
 * Get the current user data or redirect to sign-in
 * Returns only the necessary user data, not the full user object with methods
 */
export async function getUserData() {
  const user = await stackServerApp.getUser({ or: "redirect" });

  // Check team permissions
  const isAdmin = await hasTeamPermission(TeamPermission.ADMIN);
  const isPending = await hasTeamPermission(TeamPermission.PENDING);
  const userTeam = await getUserTeam();

  // Extract only the data we need, not the methods
  return {
    id: user.id,
    displayName: user.displayName,
    primaryEmail: user.primaryEmail,
    profileImageUrl: user.profileImageUrl,
    isAdmin,
    isPending,
    team: userTeam,
    clientReadOnlyMetadata: user.clientReadOnlyMetadata,
  };
}

/**
 * Get the user's primary role/team
 * Returns the user's highest priority team as a string
 */
export async function getUserRole() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return { role: "guest" };

    // Check for admin team first
    const adminTeam = await user.getTeam(TeamPermission.ADMIN);
    if (adminTeam) {
      return { role: "admin" };
    }

    // If not admin, check other teams in priority order
    const teamPriority = [
      TeamPermission.SITE_ADMIN,
      TeamPermission.APPROVER,
      TeamPermission.SUBMITTER,
      TeamPermission.REPORTER,
      TeamPermission.PENDING,
    ];

    for (const team of teamPriority) {
      const userTeam = await user.getTeam(team);
      if (userTeam) {
        return { role: team };
      }
    }

    return { role: "guest" };
  } catch (error) {
    console.error("Error getting user role:", error);
    return { role: "guest" };
  }
}

/**
 * Check if user has a specific permission
 */
export async function checkUserPermission(permission: string) {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const hasPermission = await user.getPermission(permission);
  return !!hasPermission; // Return boolean instead of permission object
}

/**
 * Check if user has PENDING permission and redirect if true
 * Returns user data if not pending
 */
export async function checkPendingAndRedirect() {
  const user = await stackServerApp.getUser({ or: "redirect" });
  const isPending = await hasTeamPermission(TeamPermission.PENDING);

  if (isPending) {
    redirect("/pending");
  }

  // Return only the data we need, not the full user object with methods
  return {
    id: user.id,
    displayName: user.displayName,
    primaryEmail: user.primaryEmail,
    profileImageUrl: user.profileImageUrl,
  };
}

"use server";

import { stackServerApp } from "@/stack";
import { TeamPermission } from "@/lib/types";

/**
 * Check if a user has a specific team permission
 * @param teamPermission The team permission to check
 * @returns Boolean indicating if the user has the permission
 */
export async function hasTeamPermission(
  teamPermission: TeamPermission | string
): Promise<boolean> {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return false;

    const team = await user.getTeam(teamPermission);
    return !!team;
  } catch (error) {
    console.error(`Error checking team permission ${teamPermission}:`, error);
    return false;
  }
}

/**
 * Get the user's primary team (highest priority team the user belongs to)
 * @returns The user's primary team as a TeamPermission enum or null if not on any team
 */
export async function getUserTeam(): Promise<TeamPermission | null> {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return null;

    // Check teams in priority order
    const teamPriority = [
      TeamPermission.ADMIN,
      TeamPermission.SITE_ADMIN,
      TeamPermission.APPROVER,
      TeamPermission.SUBMITTER,
      TeamPermission.REPORTER,
      TeamPermission.PENDING,
    ];

    for (const team of teamPriority) {
      if (await hasTeamPermission(team)) {
        return team;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting user team:", error);
    return null;
  }
}

/**
 * Get all team permissions for the current user
 * @returns Object with boolean flags for each team permission
 */
export async function getUserTeamPermissions(): Promise<
  Record<string, boolean>
> {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return {
        [TeamPermission.ADMIN]: false,
        [TeamPermission.SITE_ADMIN]: false,
        [TeamPermission.SUBMITTER]: false,
        [TeamPermission.APPROVER]: false,
        [TeamPermission.PENDING]: false,
        [TeamPermission.REPORTER]: false,
      };
    }

    const teamPermissions: Record<string, boolean> = {
      [TeamPermission.ADMIN]: false,
      [TeamPermission.SITE_ADMIN]: false,
      [TeamPermission.SUBMITTER]: false,
      [TeamPermission.APPROVER]: false,
      [TeamPermission.PENDING]: false,
      [TeamPermission.REPORTER]: false,
    };

    // Check each team permission
    for (const permission of Object.values(TeamPermission)) {
      const team = await user.getTeam(permission);
      teamPermissions[permission] = !!team;
    }

    return teamPermissions;
  } catch (error) {
    console.error("Error getting user team permissions:", error);
    return {
      admin: false,
      site_admin: false,
      submitter: false,
      approver: false,
      pending: false,
      reporter: false,
    };
  }
}

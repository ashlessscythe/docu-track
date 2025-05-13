"use server";

import { stackServerApp } from "@/stack";
import { getUserTeamPermissions, getUserTeam } from "./team-permissions";
import { TeamPermission } from "@/lib/types";

/**
 * Get the current user or return null if not authenticated
 */
export async function getUser() {
  try {
    return await stackServerApp.getUser();
  } catch (error) {
    return null;
  }
}

/**
 * Check if the current user has specific permissions
 * Returns an object with boolean flags for each permission
 */
export async function checkUserPermissions() {
  try {
    // Get all team permissions for the current user
    const permissions = await getUserTeamPermissions();
    const userTeam = await getUserTeam();

    // Map the permissions to the expected return format
    return {
      isAdmin: permissions[TeamPermission.ADMIN],
      isApprover: permissions[TeamPermission.APPROVER],
      isSubmitter: permissions[TeamPermission.SUBMITTER],
      isPending: permissions[TeamPermission.PENDING],
      isReporter: permissions[TeamPermission.REPORTER],
      isSiteAdmin: permissions[TeamPermission.SITE_ADMIN],
      primaryTeam: userTeam,
    };
  } catch (error) {
    console.error("Error checking permissions:", error);
    return {
      isAdmin: false,
      isApprover: false,
      isSubmitter: false,
      isPending: false,
      isReporter: false,
      isSiteAdmin: false,
      primaryTeam: null,
    };
  }
}

/**
 * Check if the current user has a specific permission
 */
export async function checkUserPermission(permission: string) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) return false;

    const hasPermission = await user.getPermission(permission);
    return !!hasPermission;
  } catch (error) {
    console.error(`Error checking permission ${permission}:`, error);
    return false;
  }
}

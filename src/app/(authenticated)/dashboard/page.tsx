import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/config";
import { checkPendingAndRedirect, getUserRole } from "@/lib/server-actions";
import { getUserTeamPermissions } from "@/lib/team-permissions";
import { TeamPermission } from "@/src/lib/types";

export default async function DashboardPage() {
  // Get the user data and check if they have PENDING permission
  // This will redirect to /pending if the user has PENDING permission
  const userData = await checkPendingAndRedirect();
  const teamPermissions = await getUserTeamPermissions();
  const userRole = await getUserRole();

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-3 py-6">
        <h1 className="p-3 text-3xl font-bold tracking-tight">
          Welcome to {APP_NAME}
        </h1>
        <p className="p-3 text-muted-foreground text-lg">
          You are logged in with role: {userRole.role}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/submitter"
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Submit new documents
                </Link>
              </li>
              <li>
                <Link
                  href="/approver"
                  className="flex items-center hover:text-blue-600 transition-colors"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  View/Track document status
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Current system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role</span>
                <span className="text-sm text-muted-foreground capitalize">
                  {userRole.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System</span>
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <span className="text-sm font-medium block mb-2">
                  Team Permissions:
                </span>
                <ul className="space-y-1">
                  {Object.entries(teamPermissions).map(
                    ([permission, hasPermission]) => (
                      <li
                        key={permission}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs capitalize">
                          {permission.replace("_", " ")}
                        </span>
                        <span
                          className={`text-xs ${hasPermission ? "text-green-600" : "text-red-600"}`}
                        >
                          {hasPermission ? "Yes" : "No"}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Help & Resources</CardTitle>
            <CardDescription>Useful information and guides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                Need help? Here are some resources to get you started:
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/user/guide"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    User Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/user/faq"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact/support"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

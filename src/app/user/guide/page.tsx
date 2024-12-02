import { LandingHeader } from "@/components/LandingHeader";
import { APP_NAME } from "@/lib/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function GuidePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader session={session} appName={APP_NAME} />

      <main>
        <div className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                User Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Learn how to use {APP_NAME} effectively
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
              <section className="bg-card p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                  Getting Started
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">
                      1. Account Setup
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Create your account by clicking "Get Started" on the
                      homepage. Fill in your details and verify your email
                      address to activate your account.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">
                      2. Dashboard Overview
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Your dashboard shows all your submitted documents, their
                      current status, and any pending actions required from you.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-card p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                  Document Submission
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">
                      1. Preparing Documents
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Ensure your documents are in a supported format and under
                      the size limit. Double-check all information before
                      submission.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">
                      2. Submission Process
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Click "Submit Document", select the document type, fill in
                      required details, upload your file, and submit for review.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-card p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                  Tracking & Updates
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">
                      1. Status Tracking
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Monitor your document's progress through the approval
                      workflow. Each status change will be reflected in
                      real-time on your dashboard.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-card-foreground">
                      2. Notifications
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Receive email notifications for important updates about
                      your documents, including approvals, rejections, or
                      requests for revision.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 {APP_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

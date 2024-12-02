import { LandingHeader } from "@/components/LandingHeader";
import { APP_NAME } from "@/lib/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function FAQPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader session={session} appName={APP_NAME} />

      <main>
        <div className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Find answers to common questions about using {APP_NAME}
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-card-foreground">
                  How do I submit a document?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  To submit a document, log into your account and click the
                  "Submit Document" button on your dashboard. Fill out the
                  required information and upload your document file.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-card-foreground">
                  How long does the approval process take?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  The approval timeline varies depending on the document type
                  and department. You can track the status of your document in
                  real-time through your dashboard.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-card-foreground">
                  What file formats are supported?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  We support most common document formats including PDF, DOC,
                  DOCX, and image files (JPG, PNG). Please ensure your files are
                  under 10MB in size.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Can I revise a submitted document?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, you can submit a revised version if your document is
                  returned for changes. The system will maintain a version
                  history of all submissions.
                </p>
              </div>
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

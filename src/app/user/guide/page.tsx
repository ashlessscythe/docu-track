import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Guide",
  description: "Learn how to use the system",
};

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">User Guide</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Registration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                To begin using the system:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Click the &quot;Register&quot; link in the navigation</li>
                <li>Fill out the registration form with your details</li>
                <li>Wait for admin approval of your account</li>
                <li>
                  Once approved, you can log in and start using the system
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Logging In</h3>
              <p className="text-gray-600 dark:text-gray-400">
                After registration is approved:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Click the &quot;Sign In&quot; button</li>
                <li>Enter your email and password</li>
                <li>You&apos;ll be directed to your dashboard</li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Document Management</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Submitting Documents</h3>
              <p className="text-gray-600 dark:text-gray-400">
                To submit a new document:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Navigate to the submission page</li>
                <li>Select the document type</li>
                <li>Fill in the required information</li>
                <li>Upload your document</li>
                <li>Click &quot;Submit&quot; to process your submission</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Tracking Documents</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your submissions:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Visit your dashboard</li>
                <li>View the status of each document</li>
                <li>Check for any required actions or updates</li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Using Templates</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Finding Templates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access document templates:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Go to the Templates section</li>
                <li>Browse available templates by category</li>
                <li>Download the template you need</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Using Templates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                To use a template:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Download the appropriate template</li>
                <li>Fill in the required information</li>
                <li>Save the completed document</li>
                <li>Submit through the regular submission process</li>
              </ol>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Getting Help</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Support Options</h3>
              <p className="text-gray-600 dark:text-gray-400">
                If you need assistance:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Check the FAQ section for common questions</li>
                <li>Contact support through the support page</li>
                <li>Submit a help ticket for technical issues</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

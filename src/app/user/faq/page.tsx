import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently Asked Questions",
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">General Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">
                What is the purpose of this system?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This system is designed to streamline document submission and
                approval processes within organizations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">
                How do I get started?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Register for an account, and once approved, you can begin
                submitting or reviewing documents based on your role.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Document Submission</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">
                What file types are supported?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We support PDF, DOCX, TXT, and other common document formats.
                Check the document types section for a complete list.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">
                How long does the approval process take?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The approval timeline varies by department and document type.
                Typically, you can expect a response within 2-3 business days.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Account Management</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">
                How do I update my profile?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You can update your profile information from the account
                settings page after logging in.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">
                What if I forget my password?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use the &quot;Forgot Password&quot; link on the login page to
                reset your password through your registered email.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Technical Support</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">
                What browsers are supported?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We support the latest versions of Chrome, Firefox, Safari, and
                Edge.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">
                How do I report an issue?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visit our support page to submit a ticket or contact our support
                team directly.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

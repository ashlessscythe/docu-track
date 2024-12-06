import { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/lib/config";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with using the system",
};

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Support</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
          <ContactForm />
        </div>

        {/* Support Information */}
        <div className="space-y-8">
          <div className="bg-card p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Quick Support
            </h3>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                For immediate assistance, check our:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/user/faq"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/user/guide"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    User Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-card-foreground">
                  Email Support
                </p>
                <p className="text-muted-foreground">
                  support@{APP_NAME.toLowerCase()}.com
                </p>
              </div>
              <div>
                <p className="font-medium text-card-foreground">
                  Business Hours
                </p>
                <p className="text-muted-foreground">Monday - Friday</p>
                <p className="text-muted-foreground">9:00 AM - 5:00 PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

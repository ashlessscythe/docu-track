import { LandingHeader } from "@/components/LandingHeader";
import { APP_NAME } from "@/lib/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default async function SupportPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader session={session} appName={APP_NAME} />

      <main>
        <div className="bg-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Contact Support
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Need help? We're here to assist you
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                  Send us a message
                </h2>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What can we help you with?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Describe your issue or question"
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
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
                        <a
                          href="/user/faq"
                          className="text-primary hover:underline"
                        >
                          Frequently Asked Questions
                        </a>
                      </li>
                      <li>
                        <a
                          href="/user/guide"
                          className="text-primary hover:underline"
                        >
                          User Guide
                        </a>
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
                      <p className="text-muted-foreground">
                        9:00 AM - 5:00 PM EST
                      </p>
                    </div>
                  </div>
                </div>
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

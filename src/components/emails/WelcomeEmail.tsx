import * as React from "react";

interface WelcomeEmailProps {
  name: string;
  appName: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
  appName,
}) => (
  <div
    style={{ fontFamily: "Arial, sans-serif", padding: "20px", color: "#333" }}
  >
    <h1 style={{ color: "#2563eb" }}>Welcome to {appName}!</h1>
    <p>Hello {name},</p>
    <p>
      Thank you for joining {appName}. We&apos;re excited to have you on board!
    </p>
    <p>
      With {appName}, you can easily manage document submissions, approvals, and
      more.
    </p>
    <div
      style={{
        marginTop: "30px",
        padding: "15px",
        backgroundColor: "#f3f4f6",
        borderRadius: "5px",
      }}
    >
      <p style={{ margin: "0", fontSize: "14px" }}>
        If you have any questions or need assistance, please don&apos;t hesitate
        to contact our support team.
      </p>
    </div>
    <p style={{ marginTop: "30px", fontSize: "14px", color: "#6b7280" }}>
      Best regards,
      <br />
      The {appName} Team
    </p>
  </div>
);

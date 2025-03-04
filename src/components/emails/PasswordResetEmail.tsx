import * as React from "react";

interface PasswordResetEmailProps {
  name: string;
  appName: string;
  resetLink: string;
}

export const PasswordResetEmail: React.FC<
  Readonly<PasswordResetEmailProps>
> = ({ name, appName, resetLink }) => (
  <div
    style={{ fontFamily: "Arial, sans-serif", padding: "20px", color: "#333" }}
  >
    <h1 style={{ color: "#2563eb" }}>Reset Your Password</h1>
    <p>Hello {name},</p>
    <p>
      We received a request to reset your password for your {appName} account.
      If you didn&apos;t make this request, you can safely ignore this email.
    </p>
    <p>To reset your password, please click the button below:</p>
    <div style={{ marginTop: "25px", marginBottom: "25px" }}>
      <a
        href={resetLink}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "12px 20px",
          borderRadius: "5px",
          textDecoration: "none",
          fontWeight: "bold",
          display: "inline-block",
        }}
      >
        Reset Password
      </a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>
      If the button above doesn&apos;t work, you can also copy and paste the
      following link into your browser:
    </p>
    <p style={{ wordBreak: "break-all", color: "#4b5563", fontSize: "14px" }}>
      {resetLink}
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
        If you didn&apos;t request a password reset, please contact our support
        team immediately.
      </p>
    </div>
    <p style={{ marginTop: "30px", fontSize: "14px", color: "#6b7280" }}>
      Best regards,
      <br />
      The {appName} Team
    </p>
  </div>
);

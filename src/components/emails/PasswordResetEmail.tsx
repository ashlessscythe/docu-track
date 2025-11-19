import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";
import { LOGO_URL } from "@/src/lib/config";
import { LogOut } from "lucide-react";

interface PasswordResetEmailProps {
  name: string;
  appName: string;
  resetLink: string;
}

export const PasswordResetEmail: React.FC<
  Readonly<PasswordResetEmailProps>
> = ({ name, appName, resetLink }) => {
  const previewText = `Reset your ${appName} password`;
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Preview>{previewText}</Preview>
          <Container className="border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[20px] max-w-[465px] bg-white shadow-sm">
            <Section className="mt-[32px]">
              <Img
                src={`${LOGO_URL}`}
                width="40"
                height="40"
                alt={appName}
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-gray-800 text-[24px] font-bold text-center p-0 my-[30px] mx-0">
              Reset Your Password
            </Heading>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              We received a request to reset your password for your{" "}
              <span className="font-semibold">{appName}</span> account. If you
              didn&apos;t make this request, you can safely ignore this email.
            </Text>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              To reset your password, please click the button below:
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-blue-600 rounded-md text-white text-[14px] font-semibold no-underline text-center px-6 py-3"
                href={resetLink}
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-gray-700 text-[14px] leading-[24px]">
              This link will expire in 1 hour for security reasons.
            </Text>
            <Text className="text-gray-700 text-[14px] leading-[24px]">
              If the button above doesn&apos;t work, you can also copy and paste
              this URL into your browser:
            </Text>
            <Text className="text-gray-500 text-[14px] leading-[24px] break-all">
              <Link href={resetLink} className="text-blue-600 no-underline">
                {resetLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-gray-200 my-[26px] mx-0 w-full" />
            <Section className="bg-gray-50 rounded-md p-[16px] border border-gray-100">
              <Text className="text-gray-700 text-[14px] leading-[24px] m-0">
                If you didn&apos;t request a password reset, please contact our
                support team immediately.
              </Text>
            </Section>
            <Text className="text-gray-500 text-[12px] leading-[24px] mt-[32px]">
              &copy; {currentYear} {appName}. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

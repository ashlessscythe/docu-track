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

interface AccountApprovalEmailProps {
  name: string;
  appName: string;
  role: string;
}

export const AccountApprovalEmail: React.FC<
  Readonly<AccountApprovalEmailProps>
> = ({ name, appName, role }) => {
  const previewText = `Your ${appName} account has been approved!`;
  const currentYear = new Date().getFullYear();
  const roleDisplay =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Preview>{previewText}</Preview>
          <Container className="border border-solid border-gray-200 rounded-lg my-[40px] mx-auto p-[20px] max-w-[465px] bg-white shadow-sm">
            <Section className="mt-[32px]">
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`}
                width="40"
                height="40"
                alt={appName}
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-gray-800 text-[24px] font-bold text-center p-0 my-[30px] mx-0">
              Account Approved!
            </Heading>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              Great news! Your account on{" "}
              <span className="font-semibold">{appName}</span> has been
              approved.
            </Text>

            <Section className="bg-green-50 rounded-md p-[20px] border border-green-100 my-[24px]">
              <Text className="text-gray-800 text-[16px] leading-[24px] m-0">
                Your account has been assigned the{" "}
                <span className="font-semibold">{roleDisplay}</span> role. You
                can now access all features available to your role.
              </Text>
            </Section>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-blue-600 hover:bg-blue-700 rounded-md text-white text-[14px] font-semibold no-underline text-center px-6 py-3 transition-colors"
                href={`${process.env.NEXTAUTH_URL}/dashboard`}
              >
                Go to Dashboard
              </Button>
            </Section>

            <Hr className="border border-solid border-gray-200 my-[26px] mx-0 w-full" />

            <Section className="bg-gray-50 rounded-md p-[16px] border border-gray-100">
              <Text className="text-gray-700 text-[14px] leading-[24px] m-0">
                If you have any questions or need assistance, please don&apos;t
                hesitate to contact our support team.
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

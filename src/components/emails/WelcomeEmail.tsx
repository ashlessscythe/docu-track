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
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";
import { LOGO_URL } from "@/src/lib/config";

interface WelcomeEmailProps {
  name: string;
  appName: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  name,
  appName,
}) => {
  const previewText = `Welcome to ${appName}!`;
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
                src={LOGO_URL}
                width="60"
                height="75"
                alt={appName}
                className="my-0 mx-auto rounded-lg"
              />
            </Section>
            <Heading className="text-gray-800 text-[24px] font-bold text-center p-0 my-[30px] mx-0">
              Welcome to <span className="text-blue-600">{appName}</span>!
            </Heading>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              Hello {name},
            </Text>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              Thank you for joining{" "}
              <span className="font-semibold">{appName}</span>. We&apos;re
              excited to have you on board!
            </Text>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              Your account is currently pending approval. You will receive an
              email notification once your account has been approved.
            </Text>

            <Section className="bg-blue-50 rounded-md p-[20px] border border-blue-100 my-[24px]">
              <Text className="text-gray-800 text-[16px] leading-[24px] m-0 font-medium">
                With {appName}, you can:
              </Text>
              <ul className="pl-[20px] mt-[8px] mb-0">
                <li className="text-gray-700 text-[15px] leading-[24px]">
                  Easily manage document submissions
                </li>
                <li className="text-gray-700 text-[15px] leading-[24px]">
                  Track approval processes
                </li>
                <li className="text-gray-700 text-[15px] leading-[24px]">
                  Collaborate with your team
                </li>
              </ul>
            </Section>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-blue-600 rounded-md text-white text-[14px] font-semibold no-underline text-center px-6 py-3"
                href={`${process.env.NEXTAUTH_URL}/dashboard`}
              >
                Get Started
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

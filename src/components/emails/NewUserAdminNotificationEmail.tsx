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

interface NewUserAdminNotificationEmailProps {
  userName: string;
  userEmail: string;
  appName: string;
  dashboardUrl: string;
}

export const NewUserAdminNotificationEmail: React.FC<
  Readonly<NewUserAdminNotificationEmailProps>
> = ({ userName, userEmail, appName, dashboardUrl }) => {
  return (
    <Html>
      <Head />
      <Preview>New user registration on {appName}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              New User Registration
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello Admin,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              A new user has registered on {appName} and is awaiting approval:
            </Text>
            <Section className="bg-gray-100 rounded p-4 my-4">
              <Text className="text-black text-[14px] leading-[24px] m-0">
                <strong>Name:</strong> {userName}
              </Text>
              <Text className="text-black text-[14px] leading-[24px] m-0">
                <strong>Email:</strong> {userEmail}
              </Text>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Please review this registration and take appropriate action.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={dashboardUrl}
              >
                Go to Admin Dashboard
              </Button>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This is an automated message from {appName}. Please do not reply
              to this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

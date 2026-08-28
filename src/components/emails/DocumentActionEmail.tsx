import { LOGO_URL } from "@/lib/config";
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

interface DocumentActionEmailProps {
  recipientName: string;
  documentName: string;
  documentType: string;
  departmentName?: string;
  appName: string;
  actionType: "APPROVED" | "REJECTED" | "NEEDS_REVIEW";
  actionByName: string;
  comments?: { content: string; userName: string }[];
  dashboardUrl: string;
}

export const DocumentActionEmail: React.FC<
  Readonly<DocumentActionEmailProps>
> = ({
  recipientName,
  documentName,
  documentType,
  departmentName,
  appName,
  actionType,
  actionByName,
  comments = [],
  dashboardUrl,
}) => {
  // Configure email content based on action type
  const getActionConfig = () => {
    switch (actionType) {
      case "APPROVED":
        return {
          previewText: `Your document "${documentName}" has been approved!`,
          heading: "Document Approved!",
          message: `Great news! Your document "${documentName}" has been approved by ${actionByName}.`,
          sectionBgColor: "bg-green-50",
          sectionBorderColor: "border-green-100",
          buttonText: "View Approved Document",
        };
      case "REJECTED":
        return {
          previewText: `Your document "${documentName}" has been rejected`,
          heading: "Document Rejected",
          message: `Your document "${documentName}" has been rejected by ${actionByName}. Please review the comments below for more information.`,
          sectionBgColor: "bg-red-50",
          sectionBorderColor: "border-red-100",
          buttonText: "View Document Details",
        };
      case "NEEDS_REVIEW":
        return {
          previewText: `Your document "${documentName}" needs review`,
          heading: "Document Needs Review",
          message: `Your document "${documentName}" requires additional review as requested by ${actionByName}. Please check the comments below for details.`,
          sectionBgColor: "bg-yellow-50",
          sectionBorderColor: "border-yellow-100",
          buttonText: "Review Document",
        };
      default:
        return {
          previewText: `Update on your document "${documentName}"`,
          heading: "Document Status Update",
          message: `There has been an update to your document "${documentName}" by ${actionByName}.`,
          sectionBgColor: "bg-blue-50",
          sectionBorderColor: "border-blue-100",
          buttonText: "View Document",
        };
    }
  };

  const config = getActionConfig();
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-gray-50 my-auto mx-auto font-sans">
          <Preview>{config.previewText}</Preview>
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
              {config.heading}
            </Heading>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              Hello {recipientName},
            </Text>
            <Text className="text-gray-700 text-[16px] leading-[24px]">
              {config.message}
            </Text>

            <Section
              className={`${config.sectionBgColor} rounded-md p-[20px] border ${config.sectionBorderColor} my-[24px]`}
            >
              <Text className="text-gray-800 text-[16px] leading-[24px] m-0">
                <span className="font-semibold">Document Details:</span>
                <br />
                Type: {documentType}
                {departmentName && (
                  <>
                    <br />
                    Department: {departmentName}
                  </>
                )}
              </Text>
            </Section>

            {comments.length > 0 && (
              <Section className="bg-gray-50 rounded-md p-[20px] border border-gray-100 my-[24px]">
                <Text className="text-gray-800 text-[16px] leading-[24px] font-semibold m-0 mb-[12px]">
                  Comments:
                </Text>
                {comments.map((comment, index) => (
                  <Text
                    key={index}
                    className="text-gray-700 text-[14px] leading-[20px] mb-[8px] ml-[8px]"
                  >
                    <span className="font-semibold">{comment.userName}:</span>{" "}
                    {comment.content}
                  </Text>
                ))}
              </Section>
            )}

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-blue-600 rounded-md text-white text-[14px] font-semibold no-underline text-center px-6 py-3"
                href={dashboardUrl}
              >
                {config.buttonText}
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

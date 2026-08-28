import {
  sanitizeFilename,
  validateFileUpload,
  documentStatusSchema,
} from "@/lib/schemas";
import { isSameSite } from "@/lib/site-access";

describe("security utilities", () => {
  it("sanitizes filenames", () => {
    expect(sanitizeFilename('report<script>.pdf')).toBe("report_script_.pdf");
  });

  it("rejects disallowed mime types", () => {
    const file = { size: 100, type: "application/x-msdownload" } as File;
    expect(validateFileUpload(file)).toBe("File type not allowed");
  });

  it("validates document status enum", () => {
    expect(documentStatusSchema.safeParse("APPROVED").success).toBe(true);
    expect(documentStatusSchema.safeParse("INVALID").success).toBe(false);
  });
});

describe("site isolation expectations", () => {
  it("blocks cross-site access", () => {
    expect(isSameSite("site-a", "site-b")).toBe(false);
  });

  it("allows same-site access", () => {
    expect(isSameSite("site-a", "site-a")).toBe(true);
  });
});

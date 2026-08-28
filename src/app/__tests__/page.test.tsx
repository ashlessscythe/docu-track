import { render, screen } from "@testing-library/react";
import Page from "../page";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn().mockResolvedValue(null),
}));

describe("Home Page", () => {
  it("renders without crashing", async () => {
    const jsx = await Page();
    render(jsx);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { signIn, signOut } from "next-auth/react";
import SignInPage from "../signin/page";
import SignOutPage from "../signout/page";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

describe("Authentication Flow", () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe("SignIn Page", () => {
    it("should render signin form", () => {
      render(<SignInPage />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("should handle successful signin", async () => {
      (signIn as jest.Mock).mockResolvedValueOnce({ ok: true, error: null });

      render(<SignInPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "bob@bob.bob" } });
      fireEvent.change(passwordInput, { target: { value: "bob" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("credentials", {
          email: "bob@bob.bob",
          password: "bob",
          redirect: true,
          callbackUrl: "/dashboard",
        });
      });
    });

    it("should handle failed signin", async () => {
      (signIn as jest.Mock).mockResolvedValueOnce({
        ok: false,
        error: "Invalid credentials",
      });

      render(<SignInPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "wrong@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("credentials", {
          email: "wrong@email.com",
          password: "wrongpass",
          redirect: true,
          callbackUrl: "/dashboard",
        });
      });

      expect(
        await screen.findByText(/invalid credentials/i)
      ).toBeInTheDocument();
    });

    it("should validate required fields", async () => {
      render(<SignInPage />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
      expect(
        await screen.findByText(/password is required/i)
      ).toBeInTheDocument();
      expect(signIn).not.toHaveBeenCalled();
    });
  });

  describe("SignOut Page", () => {
    it("should trigger signout on mount", async () => {
      (signOut as jest.Mock).mockResolvedValueOnce({ ok: true });

      render(<SignOutPage />);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledWith({
          callbackUrl: "/auth/signin",
        });
      });

      expect(screen.getByText(/signing out/i)).toBeInTheDocument();
      expect(screen.getByText(/you are being redirected/i)).toBeInTheDocument();
    });
  });
});

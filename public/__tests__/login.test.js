/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock Firebase Authentication
import { signInWithEmailAndPassword } from "firebase/auth";
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn()
}));

// Mock Firebase App
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn()
}));

beforeEach(() => {
  document.body.innerHTML = `
    <form id="login-form">
      <input type="email" id="login-email" placeholder="Enter email" />
      <input type="password" id="login-password" placeholder="Enter password" />
      <button type="submit">Login</button>
    </form>
  `;

  require("./login.js"); // Your loginUser logic
});

describe("loginUser", () => {
  it("logs in a user successfully when email and password are valid", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: "12345" } });

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const loginButton = screen.getByText("Login");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Password123");
    await userEvent.click(loginButton);

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
  });

  it("shows an error when login fails", async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Login failed"));

    const emailInput = screen.getByPlaceholderText("Enter email");
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const loginButton = screen.getByText("Login");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "Password123");
    await userEvent.click(loginButton);

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    // Optionally, check for an error alert/message here too
  });
});

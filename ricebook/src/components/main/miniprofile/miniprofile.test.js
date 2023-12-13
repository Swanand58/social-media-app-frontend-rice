import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import MiniProfile from "./miniprofile";
import { BrowserRouter as Router } from "react-router-dom";

describe("Validate Authetication", () => {
  test("should logout a user (login state cleared)", () => {
    render(
      <Router>
        <MiniProfile />
      </Router>
    );

    const logoutLink = screen.getByTestId("logout-button");
    fireEvent.click(logoutLink);
    expect(sessionStorage.getItem("username")).toBe(null);
    expect(window.location.href).toBe("http://localhost/");
  });
});

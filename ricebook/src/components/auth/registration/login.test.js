import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import Login from "./login";

const registeredInUser = {
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  address: {
    street: "Kulas Light",
    suite: "Apt. 556",
    city: "Gwenborough",
    zipcode: "92998-3874",
    geo: {
      lat: "-37.3159",
      lng: "81.1496",
    },
  },
  phone: "1-770-736-8031 x56442",
  website: "hildegard.org",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
};

describe("Validate Authetication", () => {
  render(
    <Router>
      <Login />
    </Router>
  );

  const username = screen.getByPlaceholderText("username", {
    exact: true,
    selector: "input",
  });

  const password = screen.getByPlaceholderText("password", {
    exact: true,
    selector: "input",
  });

  const logInButton = screen.getByTestId("login-button");

  test("Login user from JSON placeholder data", async () => {
    fireEvent.change(username, {
      target: {
        value: "Bret",
      },
    });

    fireEvent.change(password, {
      target: {
        value: "Kulas Light",
      },
    });

    fireEvent.submit(logInButton);
    setTimeout(function () {
      const LoggedInUserId = sessionStorage.getItem("userId");
      expect(LoggedInUserId).toBe(1);
    }, 50);
  });

  test("login fails for invalid user with error message", () => {
    sessionStorage.removeItem("userId");
    fireEvent.change(username, {
      target: {
        value: "pqrstuv",
      },
    });

    fireEvent.change(password, {
      target: {
        value: "12345678",
      },
    });

    fireEvent.submit(logInButton);
    setTimeout(function () {
      const LoggedInUserId = sessionStorage.getItem("userId");
      const LoggedInUser = JSON.parse(sessionStorage.getItem("userId"));
      expect(LoggedInUserId).toBe(null);
      expect(LoggedInUser).toBe(registeredInUser);
    }, 100);
  });

  test("Login Fail for incorrect password", () => {
    sessionStorage.removeItem("userId");
    fireEvent.change(username, {
      target: {
        value: "Bret",
      },
    });
    fireEvent.change(password, {
      target: {
        value: "12345678",
      },
    });
    fireEvent.submit(logInButton);
    setTimeout(function () {
      const LoggedInUserId = sessionStorage.getItem("userId");
      expect(LoggedInUserId).toBe(null);
    }, 100);
  });
});

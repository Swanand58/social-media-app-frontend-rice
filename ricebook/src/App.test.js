import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

describe("App Tests", () => {
  test("pp renders", async () => {
    render(<App />);

    screen.debug();
  });
});

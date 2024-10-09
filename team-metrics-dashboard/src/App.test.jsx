// App.test.jsx

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App component", () => {
  it("Renders snapshot", () => {
    // since screen does not have the container property, we'll destructure render to obtain a container for this test
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  it("Renders Button", () => {
    render(<App />);
    const button = screen.getByRole("button", { name: /advanced settings/i });
    expect(button).toBeInTheDocument();
  });

  it("Advanced Settings toggles div properly", async () => {
    const user = userEvent.setup();

    render(<App />);
    const button = screen.getByRole("button", {
      name: /advanced settings/i,
    });

    await user.click(button);
    const startDate = screen.getByText(/start date:/i).innerHTML;
    const endDate = screen.getByText(/end date:/i).innerHTML;
    const intersect = screen.getByText(/intersect/i).innerHTML;

    expect(startDate).toMatch("Start Date");
    expect(endDate).toMatch("End Date:");
    expect(intersect).toMatch("Intersect");
  });
});

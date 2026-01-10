import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormCanvas from "./FormCanvas";
import { theme } from "../../theme/theme";

// Mock the CSS file to avoid errors in the test environment
jest.mock("./FormCanvas.css", () => ({}));

// Mock the child components to isolate the FormCanvas component
jest.mock("../SectionHeader/SectionHeader", () => () => <div>SectionHeader</div>);

describe("FormCanvas", () => {
  const mockFields = [
    { id: "1", type: "text", label: "First Name" },
    { id: "2", type: "email", label: "Email" },
  ];

  it("should have reduced space between fields", () => {
    render(<FormCanvas fields={mockFields} />);

    const fieldElements = screen.getAllByText(/Untitled Field/i);

    fieldElements.forEach((field) => {
      const parent = field.closest(".form-canvas-field");
      if (parent) {
        const style = window.getComputedStyle(parent);
        expect(style.marginBottom).toBe(theme.spacing.sm);
      }
    });
  });
});

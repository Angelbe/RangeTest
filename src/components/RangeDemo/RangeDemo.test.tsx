import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "@jest/globals";
import RangeDemo from "@/components/RangeDemo";

function setTrackBounds(width = 100) {
  const track = screen.getByLabelText("Price range track");
  Object.defineProperty(track, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: width,
      bottom: 0,
      width,
      height: 0,
      toJSON: () => ({}),
    }),
  });
}

afterEach(() => {
  document.documentElement.classList.remove("range-dragging");
});

describe("RangeDemo integration", () => {
  it("renders normal limits and enforces them for manual edits", () => {
    render(
      <RangeDemo
        mode="normal"
        initialConfiguration={{ min: 1, max: 100 }}
      />,
    );

    const minimum = screen.getByRole("slider", { name: "Minimum value" });
    expect(minimum).toHaveAttribute("aria-valuemin", "1");
    expect(screen.getByRole("slider", { name: "Maximum value" })).toHaveAttribute(
      "aria-valuemax",
      "100",
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit minimum value" }));
    const input = screen.getByRole("spinbutton", { name: "Minimum value" });
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByRole("alert")).toHaveTextContent("between 1 and 75");
    expect(minimum).toHaveAttribute("aria-valuenow", "25");
  });

  it("renders fixed values and snaps drag selection to an option", () => {
    const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
    render(
      <RangeDemo mode="fixed" initialConfiguration={{ values }} />,
    );

    const minimum = screen.getByRole("slider", { name: "Minimum value" });
    expect(minimum).toHaveAttribute("aria-valuemin", "1.99");
    expect(screen.getByRole("slider", { name: "Maximum value" })).toHaveAttribute(
      "aria-valuemax",
      "70.99",
    );
    expect(
      screen.queryByRole("button", { name: "Edit minimum value" }),
    ).not.toBeInTheDocument();

    setTrackBounds();
    fireEvent.pointerDown(minimum, { clientX: 45 });

    const selectedValue = Number(minimum.getAttribute("aria-valuenow"));
    expect(values).toContain(selectedValue);
    expect(selectedValue).toBe(30.99);
  });

  it("shows a fallback when configuration is missing", () => {
    render(<RangeDemo mode="normal" />);

    expect(screen.getByText("Range configuration is unavailable.")).toBeInTheDocument();
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });
});

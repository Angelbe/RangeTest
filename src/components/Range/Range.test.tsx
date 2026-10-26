import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "@jest/globals";
import Range from "@/components/Range";

const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

function setTrackBounds(width = 200) {
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

function normalRange(initialValues: [number, number] = [20, 60]) {
  return render(
    <Range
      mode="normal"
      min={1}
      max={100}
      initialValues={initialValues}
    />,
  );
}

describe("Range", () => {
  it("renders two accessible custom sliders and no native range input", () => {
    normalRange();

    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(document.querySelector('input[type="range"]')).toBeNull();
    expect(screen.getByRole("slider", { name: "Minimum value" })).toHaveAttribute(
      "aria-valuenow",
      "20",
    );
  });

  it("updates a handle from pointer movement on the track", () => {
    normalRange();
    setTrackBounds();
    const minimum = screen.getByRole("slider", { name: "Minimum value" });

    fireEvent.pointerDown(minimum, { clientX: 40 });
    fireEvent.pointerMove(window, { clientX: 80 });
    fireEvent.pointerUp(window);

    expect(minimum).toHaveAttribute("aria-valuenow", "40.6");
    expect(minimum).toHaveClass("cursor-grab");
  });

  it("allows the maximum handle to move along the continuous range", () => {
    normalRange([20, 60]);
    setTrackBounds();
    const maximum = screen.getByRole("slider", { name: "Maximum value" });

    fireEvent.pointerDown(maximum, { clientX: 170 });
    fireEvent.pointerUp(window);

    expect(maximum).toHaveAttribute("aria-valuenow", "85.15");
  });

  it("prevents the minimum handle from crossing the maximum handle", () => {
    normalRange([20, 60]);
    setTrackBounds();
    const minimum = screen.getByRole("slider", { name: "Minimum value" });

    fireEvent.pointerDown(minimum, { clientX: 190 });

    expect(minimum).toHaveAttribute("aria-valuenow", "60");
    expect(minimum).toHaveAttribute("aria-valuemax", "60");
  });

  it("prevents the maximum handle from crossing the minimum handle", () => {
    normalRange([20, 60]);
    setTrackBounds();
    const maximum = screen.getByRole("slider", { name: "Maximum value" });

    fireEvent.pointerDown(maximum, { clientX: 0 });
    fireEvent.pointerUp(window);

    expect(maximum).toHaveAttribute("aria-valuenow", "20");
    expect(maximum).toHaveAttribute("aria-valuemin", "20");
  });

  it("snaps fixed-mode handles to an available value", () => {
    render(
      <Range mode="fixed" values={fixedValues} initialValues={[5.99, 50.99]} />,
    );
    setTrackBounds();
    const minimum = screen.getByRole("slider", { name: "Minimum value" });

    fireEvent.pointerDown(minimum, { clientX: 72 });

    expect(minimum).toHaveAttribute("aria-valuenow", "30.99");
    expect(fixedValues).toContain(Number(minimum.getAttribute("aria-valuenow")));
  });

  it("allows the maximum handle to snap to an available fixed value", () => {
    render(
      <Range mode="fixed" values={fixedValues} initialValues={[5.99, 50.99]} />,
    );
    setTrackBounds();
    const maximum = screen.getByRole("slider", { name: "Maximum value" });

    fireEvent.pointerDown(maximum, { clientX: 84 });
    fireEvent.pointerUp(window);

    expect(maximum).toHaveAttribute("aria-valuenow", "30.99");
  });

  it("does not expose editable labels in fixed mode", () => {
    render(
      <Range mode="fixed" values={fixedValues} initialValues={[5.99, 50.99]} />,
    );

    expect(
      document.querySelector('output[aria-label="Minimum value"]'),
    ).toHaveTextContent("5.99");
    expect(
      document.querySelector('output[aria-label="Maximum value"]'),
    ).toHaveTextContent("50.99");
    expect(screen.queryByRole("button", { name: "Edit minimum value" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Edit maximum value" })).toBeNull();
  });

  it("shows the grab cursor on hover and grabbing cursor while dragging", () => {
    normalRange();
    const minimum = screen.getByRole("slider", { name: "Minimum value" });

    fireEvent.mouseEnter(minimum);
    expect(minimum).toHaveClass("cursor-grab");
    expect(minimum.className).toContain("hover:size-9");

    fireEvent.pointerDown(minimum, { clientX: 40 });
    expect(minimum).toHaveClass("cursor-grabbing");
    expect(document.documentElement).toHaveClass("range-dragging");

    fireEvent.pointerLeave(minimum);
    expect(document.documentElement).toHaveClass("range-dragging");

    fireEvent.pointerUp(window);
    expect(minimum).toHaveClass("cursor-grab");
    expect(minimum).not.toHaveClass("cursor-grabbing");
    expect(document.documentElement).not.toHaveClass("range-dragging");
  });

  it("supports keyboard adjustment without crossing the other handle", () => {
    normalRange([60, 60]);
    const minimum = screen.getByRole("slider", { name: "Minimum value" });

    fireEvent.keyDown(minimum, { key: "ArrowRight" });
    expect(minimum).toHaveAttribute("aria-valuenow", "60");

    fireEvent.keyDown(minimum, { key: "ArrowLeft" });
    expect(minimum).toHaveAttribute("aria-valuenow", "59");
  });

  it("rejects manual values below the service minimum", () => {
    normalRange();
    fireEvent.click(screen.getByRole("button", { name: "Edit minimum value" }));
    const input = screen.getByRole("spinbutton", { name: "Minimum value" });

    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByRole("alert")).toHaveTextContent("between 1 and 60");
    expect(screen.getByRole("slider", { name: "Minimum value" })).toHaveAttribute(
      "aria-valuenow",
      "20",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("rejects manual values above the service maximum", () => {
    normalRange();
    fireEvent.click(screen.getByRole("button", { name: "Edit maximum value" }));
    const input = screen.getByRole("spinbutton", { name: "Maximum value" });

    fireEvent.change(input, { target: { value: "101" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByRole("alert")).toHaveTextContent("between 20 and 100");
    expect(screen.getByRole("slider", { name: "Maximum value" })).toHaveAttribute(
      "aria-valuenow",
      "60",
    );
  });

  it("accepts valid manual values and prevents typed handles from crossing", () => {
    normalRange([20, 60]);
    fireEvent.click(screen.getByRole("button", { name: "Edit minimum value" }));
    const input = screen.getByRole("spinbutton", { name: "Minimum value" });

    fireEvent.change(input, { target: { value: "65" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByRole("alert")).toHaveTextContent("between 1 and 60");

    fireEvent.change(input, { target: { value: "35.5" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByRole("slider", { name: "Minimum value" })).toHaveAttribute(
      "aria-valuenow",
      "35.5",
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

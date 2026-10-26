import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import RangeDemo from "@/components/RangeDemo";

const originalFetchDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "fetch",
);

function mockFetch(data: unknown, ok = true) {
  const fetchMock = jest.fn(
    async (
      _input: RequestInfo | URL,
      _init?: RequestInit,
    ): Promise<Response> =>
      {
        void _input;
        void _init;
        return {
          ok,
          status: ok ? 200 : 500,
          json: async () => data,
        } as Response;
      },
  );
  Object.defineProperty(globalThis, "fetch", {
    configurable: true,
    value: fetchMock,
  });
  return fetchMock;
}

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
  if (originalFetchDescriptor) {
    Object.defineProperty(globalThis, "fetch", originalFetchDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, "fetch");
  }
  document.documentElement.classList.remove("range-dragging");
});

describe("RangeDemo integration", () => {
  it("loads normal limits from its service and enforces them for manual edits", async () => {
    const fetchMock = mockFetch({ min: 1, max: 100 });
    render(<RangeDemo mode="normal" />);

    const minimum = await screen.findByRole("slider", {
      name: "Minimum value",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/range/normal",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
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

  it("loads fixed values from its service and snaps drag selection to an option", async () => {
    const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
    const fetchMock = mockFetch({ values });
    render(<RangeDemo mode="fixed" />);

    const minimum = await screen.findByRole("slider", {
      name: "Minimum value",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/range/fixed",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
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

  it("reports a service failure rather than rendering a default range", async () => {
    mockFetch({}, false);
    render(<RangeDemo mode="normal" />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Range service returned 500.",
    );
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });
});

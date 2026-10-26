import "@testing-library/jest-dom/jest-globals";

if (!window.PointerEvent) {
  Object.defineProperty(window, "PointerEvent", { value: MouseEvent });
}

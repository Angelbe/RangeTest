import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { GET as getFixedValues } from "../app/api/range/fixed/route";
import { GET as getNormalLimits } from "../app/api/range/normal/route";

const originalResponseDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "Response",
);

beforeAll(() => {
  if (globalThis.Response) return;

  class TestResponse {
    readonly status = 200;
    private readonly body: unknown;

    constructor(body: unknown) {
      this.body = body;
    }

    async json() {
      return this.body;
    }

    static json(body: unknown) {
      return new TestResponse(body);
    }
  }

  Object.defineProperty(globalThis, "Response", {
    configurable: true,
    value: TestResponse,
  });
});

afterAll(() => {
  if (originalResponseDescriptor) {
    Object.defineProperty(globalThis, "Response", originalResponseDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, "Response");
  }
});

describe("Range mock API handlers", () => {
  it("returns the normal range limits", async () => {
    const response = await getNormalLimits();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ min: 1, max: 100 });
  });

  it("returns the exact fixed range options", async () => {
    const response = await getFixedValues();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      values: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    });
  });
});

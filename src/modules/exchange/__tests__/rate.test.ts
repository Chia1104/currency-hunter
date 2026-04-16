import { describe, it, expect } from "vitest";

import { SupportedCurrency } from "@/enums/supported-currency.enum";

import { getRate } from "../resources/rate.resource";

describe("getRate", () => {
  it(`should return the rate for ${SupportedCurrency.TWD}`, async () => {
    const rate = await getRate(SupportedCurrency.TWD);
    expect(rate.result).toBe("success");
  });

  it(`should return the rate for ${SupportedCurrency.USD}`, async () => {
    const rate = await getRate(SupportedCurrency.USD);
    expect(rate.result).toBe("success");
  });

  it(`should return the rate for ${SupportedCurrency.JPY}`, async () => {
    const rate = await getRate(SupportedCurrency.JPY);
    expect(rate.result).toBe("success");
  });

  it(`should return the rate for ${SupportedCurrency.EUR}`, async () => {
    const rate = await getRate(SupportedCurrency.EUR);
    expect(rate.result).toBe("success");
  });
});

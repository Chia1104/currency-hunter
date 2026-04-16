export const SupportedCurrency = {
  USD: "USD",
  TWD: "TWD",
  JPY: "JPY",
  EUR: "EUR",
} as const;

export type SupportedCurrency =
  (typeof SupportedCurrency)[keyof typeof SupportedCurrency];

import ky from "ky";

import type { SupportedCurrency } from "@/enums/supported-currency.enum";

import { RatePipe } from "../pipes/rate.pipe";

export const rateResource = ky.create({
  prefix: "https://open.er-api.com/v6/latest",
});

export const getRate = async (
  currency: SupportedCurrency,
  options?: BaseQueryOptions
) => {
  const response = await rateResource.get(`${currency}`, options).json();
  const result = RatePipe.parse(response);
  return result;
};

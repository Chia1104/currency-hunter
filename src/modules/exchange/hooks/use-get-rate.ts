import { useQuery, queryOptions } from "@tanstack/react-query";

import type { SupportedCurrency } from "@/enums/supported-currency.enum";

import { getRate } from "../resources/rate.resource";

export const getRateQueryOptions = (currency: SupportedCurrency) => {
  return queryOptions({
    queryKey: ["exchange/rate", currency],
    queryFn: ({ signal }) => getRate(currency, { signal }),
  });
};

export const useGetRate = (currency: SupportedCurrency) => {
  return useQuery(getRateQueryOptions(currency));
};

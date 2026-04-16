import * as z from "zod";

export const RatePipe = z.union([
  z.object({
    result: z.literal("success"),
    provider: z.string(),
    documentation: z.string(),
    terms_of_use: z.string(),
    time_last_update_unix: z.number(),
    time_last_update_utc: z.string(),
    time_next_update_unix: z.number(),
    time_next_update_utc: z.string(),
    time_eol_unix: z.number(),
    base_code: z.string(),
    rates: z.record(z.string(), z.number()),
  }),
  z.object({
    result: z.literal("error"),
    "error-type": z.string(),
  }),
]);

export type RatePipe = z.infer<typeof RatePipe>;

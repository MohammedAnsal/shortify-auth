import { z } from "zod";

export const shortenUrlSchema = z.object({
  originalUrl: z
    .string()
    .url("Please provide a valid URL")
    .min(1, "Original URL is required"),
});

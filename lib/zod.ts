import { z } from "zod";

export const createMarketSchema = z.object({
  title: z.string().min(5).max(140),
  description: z.string().min(10).max(2000),
  category: z.string().min(2).max(40),
  closesAt: z.string().datetime(),
  options: z.array(z.string().min(1)).min(2).max(5),
});

export const voteSchema = z.object({
  amount: z.number().int().min(1).max(1000),
  optionId: z.string().min(1),
});

export const giftSchema = z.object({
  note: z.string().min(3).max(200),
  capAED: z.number().int().min(1).max(1000).optional(),
});

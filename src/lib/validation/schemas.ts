import * as z from "zod";

export const commentFormSchema = z.object({
  postDocumentId: z.string().trim().min(1, "INVALID_POST"),
  name: z.string().trim().min(2, "INVALID_NAME").max(80, "INVALID_NAME"),
  email: z.string().trim().email("INVALID_EMAIL").max(150, "INVALID_EMAIL"),
  comment: z.string().trim().min(5, "INVALID_BODY").max(5000, "INVALID_BODY"),
  hp: z.string().optional().default(""),
});

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "INVALID_NAME").max(80, "INVALID_NAME"),
  email: z.string().trim().email("INVALID_EMAIL").max(150, "INVALID_EMAIL"),
  content: z.string().trim().min(5, "INVALID_BODY").max(5000, "INVALID_BODY"),
  hp: z.string().optional().default(""),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("INVALID_EMAIL").max(150, "INVALID_EMAIL"),
  hp: z.string().optional().default(""),
});

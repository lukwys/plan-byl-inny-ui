import * as z from "zod";

const name = z
  .string()
  .trim()
  .min(2, "Imię musi mieć co najmniej 2 znaki.")
  .max(80, "Imię może mieć maksymalnie 80 znaków.");

const email = z
  .string()
  .trim()
  .email("Podaj poprawny adres e-mail.")
  .max(150, "Adres e-mail może mieć maksymalnie 150 znaków.");

const hp = z.string().optional().default("");

export const commentFormSchema = z.object({
  postDocumentId: z
    .string()
    .trim()
    .min(
      1,
      "Nie udało się dodać komentarza. Odśwież stronę i spróbuj ponownie.",
    ),
  name,
  email,
  comment: z
    .string()
    .trim()
    .min(5, "Komentarz musi mieć co najmniej 5 znaków.")
    .max(5000, "Komentarz może mieć maksymalnie 5000 znaków."),
  hp,
  postTitle: z.string(),
});

export const contactFormSchema = z.object({
  name,
  email,
  content: z
    .string()
    .trim()
    .min(5, "Wiadomość musi mieć co najmniej 5 znaków.")
    .max(5000, "Wiadomość może mieć maksymalnie 5000 znaków."),
  hp,
});

export const newsletterSchema = z.object({
  email,
  hp,
});

export type CommentFormData = z.infer<typeof commentFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;

export type ZodErrors<K> = {
  formErrors: string[];
  fieldErrors: Partial<Record<keyof K, string[]>>;
};

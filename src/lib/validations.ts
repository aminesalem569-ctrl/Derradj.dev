import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address").max(100),
  message: z.string().min(2, "Message must be at least 2 characters").max(1000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

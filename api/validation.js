import { z } from "zod";

export const postRequestSchema = z.object({
  customer_name: z.string().min(1, "Name is required"),
  customer_email: z.string().email("Invalid email format"),
  customer_contact: z.number().refine((val) => val.toString().length === 10, {
    message: "Contact must be a 10-digit number",
  }),
  reference_id: z.string().min(1, "Reference Id is required"),
  callback_url: z.string().url(),
});

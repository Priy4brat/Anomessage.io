import { z } from "zod";

export const messageSchema = z.object({
   content : z
   .string()
   .min(10, "Content must be minimum 10 characters")
   .max(300, "Content must be max 300 characters")
})
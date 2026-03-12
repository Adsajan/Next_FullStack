import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Provide a valid email address."),
  role: z.string().min(2, "Role is required."),
  status: z.enum(["active", "inactive"])
});

export type UserSchema = z.infer<typeof userSchema>;

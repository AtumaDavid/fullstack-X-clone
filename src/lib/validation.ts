import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

/** *****************Signup Schema************* */
export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_]+$/,
    "only letters, numbers, - and _ allowed",
  ),
  password: requiredString.min(8, "Must be at least * characters"),
});

export type SignupValues = z.infer<typeof signUpSchema>;

/** *****************Login Schema************* */

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

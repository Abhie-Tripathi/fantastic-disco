import { z } from "zod";

export interface SignInResponse {
  email: string;
  firstname: string;
  lastname: string;
  id: string;
}

export const SignInFormSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignInWithOTPSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid Email" })
    .min(1, "Please Enter the Email"),
});

export type TSignInFormSchema = z.infer<typeof SignInFormSchema>;
export type TSignInWithOTPSchema = z.infer<typeof SignInWithOTPSchema>;

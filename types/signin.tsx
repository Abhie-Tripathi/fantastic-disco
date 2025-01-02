import { z } from "zod";

export interface SignInResponse {
  email: string;
  firstname: string;
  lastname: string;
  id: string;
  profilePicture: string | null;
  companyId: string | null;
}

export const SignInFormSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  // password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignInWithOTPSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid Email" })
    .min(1, "Please Enter the Email"),
});

export type TSignInFormSchema = z.infer<typeof SignInFormSchema>;
export type TSignInWithOTPSchema = z.infer<typeof SignInWithOTPSchema>;

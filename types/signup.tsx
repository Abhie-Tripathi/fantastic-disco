import { z } from "zod";

export interface SignUpResponse {
  email: string;
  firstname: string;
  lastname: string;
  id: string;
  token: string;
}

export const SignUpFormSchema = z.object({
  name: z.string().min(3, "Name field should not be empty"),
  email: z.string().email({ message: "Invalid email format" }),
  mobileNo: z.string().min(10, "Enter a valid number").optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password cannot be empty"),
});


// export type SignUpDTO = Omit<z.infer<typeof SignUpFormSchema>, 'confirmPassword'>;
export type TSignUpFormSchema = z.infer<typeof SignUpFormSchema>;


// Temp
export interface SignUpDTO {
  firstname: string;
  lastname: string;
  phoneNumber?:string,
  email: string;
  password: string;
}
// Temp
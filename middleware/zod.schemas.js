import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().min(2).max(20),
  password: z.string().min(2).max(20)
});

export const signupSchema = z
  .object({
    first_name: z.string().min(2).max(20),
    last_name: z.string().min(2).max(20),
    email: z.string().email().min(2).max(20),
    password: z
      .string()
      .min(2)
      .max(20)
      .refine(
        (value) =>
          /^(?!.*[\s])(?=.*[a-z ء-ي A-Z])(?=.*[0-9 ٠-۹]).{6,20}$/.test(value),
        { message: "Not a valid password" }
      ),
    rePassword: z.string().min(2).max(20)
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Password doesn't match",
    path: ["password"] // path of error
  });

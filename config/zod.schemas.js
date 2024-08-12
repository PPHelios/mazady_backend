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

export const editProfileSchema = z.object({
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
    )
});

export const editProfileWithPasswordSchema = z
  .object({
    first_name: z.string().min(2).max(20),
    last_name: z.string().min(2).max(20),
    email: z.string().email().min(2).max(20),
    password: z.string().min(2).max(20),
    newPassword: z
      .string()
      .min(2)
      .max(20)
      .refine(
        (value) =>
          /^(?!.*[\s])(?=.*[a-z ء-ي A-Z])(?=.*[0-9 ٠-۹]).{6,20}$/.test(value),
        { message: "Not a valid password" }
      ),
    reNewPassword: z.string().min(2).max(20)
  })
  .refine((data) => data.newPassword === data.reNewPassword, {
    message: "Password doesn't match",
    path: ["newPassword"] // path of error
  });

  
export const addItemSchema = z.object({
  item_name: z.string().min(10).max(20),
  item_desc: z.string().min(20).max(2000),
  item_price: z.coerce.number().int().gte(1).lte(1000000000),
  category: z.union([
    z.literal("cars"),
    z.literal("art"),
    z.literal("electronics"),
    z.literal("fashion"),
    z.literal("sports"),
    z.literal("home"),
    z.literal("other"),
  ]),
  item_expiration_date: z.coerce.date().min(new Date()),
  imageUrls: z.array(z.string()).min(1).max(5),
});
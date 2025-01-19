import { z } from "zod";

export const signupFormType = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be between 5 and 15 characters long." })
    .max(15, { message: "Username must be between 5 and 15 characters long." }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, {
      message:
        "The password must be at least 8 characters long, including special characters and numbers.",
    })
    .max(20, {
      message:
        "The password must be at least 8 characters long, including special characters and numbers.",
    }),
});

export const signinFormType = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, {
      message:
        "The password must be at least 8 characters long, including special characters and numbers.",
    })
    .max(20, {
      message:
        "The password must be at least 8 characters long, including special characters and numbers.",
    }),
});

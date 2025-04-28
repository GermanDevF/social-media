import { z } from "zod";

const requiredString = z.string().trim().min(1, {
  message: "Este campo es requerido",
});

export const signUpSchema = z.object({
  email: requiredString.email({
    message: "El correo electrónico no es válido",
  }),
  username: requiredString.regex(/^[a-zA-Z0-9_]+$/, {
    message:
      "El nombre de usuario solo puede contener letras, números y guiones bajos",
  }),
  password: requiredString.min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString,
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

export const updateUserSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, {
    message: "La biografía debe tener menos de 1000 caracteres",
  }),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;


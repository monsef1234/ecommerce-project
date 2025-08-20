import { z } from "zod";

export const settingsSchema = z.object({
  id: z.number(),
  name: z.string().nonempty("الاسم مطلوب"),
  email: z.email("البريد الالكتروني غير صحيح"),
  phone_one: z.string().nonempty("رقم الهاتف مطلوب"),
  phone_two: z
    .string()
    .refine((val) => val === "" || /^0[567]\d{8}$/.test(val), {
      message: "رقم الهاتف غير صحيح",
    })
    .optional(),
  phone_three: z
    .string()
    .refine((val) => val === "" || /^\d+$/.test(val), {
      message: "رقم الهاتف غير صحيح",
    })
    .optional(),
});

export type SettingsSchemaType = z.infer<typeof settingsSchema>;

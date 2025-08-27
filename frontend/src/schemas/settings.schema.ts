import { z } from "zod";

export const settingsSchema = z.object({
  id: z.number(),
  storeName: z.string().nonempty("الاسم مطلوب"),
  phone1: z.string().nonempty("رقم الهاتف مطلوب"),
  phone2: z
    .string()
    .refine((val) => val === "" || /^0[567]\d{8}$/.test(val), {
      message: "رقم الهاتف غير صحيح",
    })
    .optional(),
  phone3: z
    .string()
    .refine((val) => val === "" || /^\d+$/.test(val), {
      message: "رقم الهاتف غير صحيح",
    })
    .optional(),
});

export type SettingsSchemaType = z.infer<typeof settingsSchema>;

import { z } from "zod";

export const checkoutSchema = z.object({
  fullname: z
    .string()
    .nonempty("الاسم الكامل مطلوب")
    .min(3, "الاسم الكامل يجب أن يكون أكثر من 3 حروف"),
  phone: z
    .string()
    .nonempty("رقم الهاتف مطلوب")
    .regex(/^0[567]\d{8}$/, "رقم الهاتف غير صحيح"),
  address: z.string().nonempty("العنوان مطلوب"),
  quantity: z.number().positive("الكمية مطلوبة."),
  state: z
    .object({
      id: z.number(),
      state: z.string(),
      home: z.number().optional(),
      point: z.number().optional(),
    })
    .nullable()
    .refine((val) => val !== null, { message: "الولاية مطلوبة." }),
});

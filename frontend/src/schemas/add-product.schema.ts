import { z } from "zod";

export const addProductSchema = z.object({
  title: z.string().nonempty("الاسم مطلوب"),
  price: z
    .string()
    .nonempty("السعر مطلوب")
    .regex(/^\d+(\.\d+)?$/, "الرقم غير صحيح"),
  hasDiscount: z.boolean().optional(),
  description: z
    .string()
    .nonempty("الوصف مطلوب")
    .min(10, "الوصف يجب أن يكون أكثر من 10 حروف"),
  discountPrice: z
    .string()
    .nonempty("السعر مطلوب")
    .regex(/^\d+(\.\d+)?$/, "الرقم غير صحيح"),
  colors: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        code: z.string(),
      })
    )
    .nonempty("اللون مطلوب"),
});

export type ProductForm = z.infer<typeof addProductSchema>;


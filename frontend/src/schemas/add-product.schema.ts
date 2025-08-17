import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().nonempty("الاسم مطلوب"),
  price: z
    .string()
    .nonempty("السعر مطلوب")
    .regex(/^\d+(\.\d+)?$/, "الرقم غير صحيح"),
  hasDiscount: z.boolean().optional(),
  discountPrice: z
    .string()
    .nonempty("السعر مطلوب")
    .regex(/^\d+(\.\d+)?$/, "الرقم غير صحيح"),
  colors: z.array(z.string()).nonempty("اللون مطلوب"),
  images: z.array(z.string()).nonempty("الصور مطلوبة"),
});

import { z } from "zod";

export const productSchema = z
  .object({
    id: z.number().optional(),
    title: z.string().nonempty("الاسم مطلوب"),
    price: z
      .string()
      .nonempty("السعر مطلوب")
      .regex(/^\d+(\.\d+)?$/, "الرقم غير صحيح"),

    hasDiscount: z.boolean(),
    description: z
      .string()
      .nonempty("الوصف مطلوب")
      .min(10, "الوصف يجب أن يكون أكثر من 10 حروف"),
    discountPrice: z.string().optional(),
    status: z.boolean().default(true),
    colors: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          code: z.string(),
        })
      )
      .nonempty("اللون مطلوب"),
  })
  .superRefine((data, ctx) => {
    const phoneRegex = /^\d+(\.\d+)?$/;

    if (data.hasDiscount && !data.discountPrice) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPrice"],
        message: "السعر مطلوب",
      });
    } else if (data.hasDiscount && !phoneRegex.test(data.discountPrice!)) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPrice"],
        message: "السعر غير صحيح",
      });
    }
  });

export type ProductSchemaType = z.infer<typeof productSchema>;

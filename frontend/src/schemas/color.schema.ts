import { z } from "zod";

export const colorSchema = z.object({
  name: z.string().nonempty("الاسم مطلوب"),
  code: z.string().nonempty("الكود مطلوب"),
});

export type ColorSchemaType = z.infer<typeof colorSchema>;

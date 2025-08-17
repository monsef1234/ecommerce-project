import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("البريد الالكتروني غير صحيح"),
  password: z
    .string()
    .nonempty("كلمة السر مطلوبة")
    .min(6, "كلمة السر يجب أن تكون أكثر من 6 حروف"),
});

import { type Request, type Response } from "express";
import prisma from "../prisma/client";
import sharp from "sharp";
import { supabase } from "../utils/supabaseClient";
import { z } from "zod";

const settingsSchema = z.object({
  storeName: z.string().nonempty("الاسم مطلوب"),
  phone1: z
    .string()
    .refine((val) => /^0[567]\d{8}$/.test(val), {
      message: "رقم الهاتف غير صحيح",
    })
    .nonempty("رقم الهاتف مطلوب"),
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
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

export const getSetting = async (req: Request, res: Response) => {
  try {
    const setting = await prisma.setting.findFirst();
    res.status(200).json({
      message: "تم جلب الإعدادات بنجاح",
      setting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الإعدادات",
    });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { storeName, phone1, phone2, phone3, facebook, instagram, twitter } =
      settingsSchema.parse(req.body) as z.infer<typeof settingsSchema>;
    const logo = req.file as Express.Multer.File;

    let publicUrl = "";

    if (logo) {
      const Buffer = await sharp(logo.buffer)
        .resize(150, 50, {
          fit: "contain",
          background: "transparent",
        })
        .webp()
        .toBuffer();

      const { data, error } = await supabase.storage
        .from("logo")
        .upload(`${Date.now()}.webp`, Buffer);

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl: newPublicUrl },
      } = supabase.storage.from("logo").getPublicUrl(data?.path!);

      publicUrl = newPublicUrl;
    }

    const setting = await prisma.setting.update({
      where: {
        id: 1,
      },
      data: {
        storeName,
        phone: phone1,
        phone2: phone2 || null,
        phone3: phone3 || null,
        facebook: facebook || null,
        instagram: instagram || null,
        twitter: twitter || null,
        ...(publicUrl.trim() !== "" && { logoUrl: publicUrl }),
      },
    });
    res.status(200).json({
      message: "تم تحديث الإعدادات بنجاح",
      setting,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error,
      });
    }
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء تحديث الإعدادات",
    });
  }
};

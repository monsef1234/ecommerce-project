import { type Request, type Response } from "express";
import prisma from "../prisma/client";
import { z } from "zod";

const colorSchema = z.object({
  name: z.string().nonempty("الاسم مطلوب"),
  code: z.string().nonempty("الكود مطلوب"),
});

export const getAllColors = async (req: Request, res: Response) => {
  try {
    const colors = await prisma.color.findMany();
    res.status(200).json({
      message: "تم جلب الألوان بنجاح",
      colors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الألوان",
    });
  }
};

export const createColor = async (req: Request, res: Response) => {
  try {
    const { name, code } = colorSchema.parse(req.body) as z.infer<typeof colorSchema>;
    const find = await prisma.color.findFirst({
      where: {
        OR: [
          {
            name: {
              equals: name,
              mode: "insensitive",
            },
          },
          {
            code: {
              equals: code,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (find) {
      return res.status(409).json({
        message: "اللون موجود بالفعل",
      });
    }

    const color = await prisma.color.create({
      data: {
        name,
        code,
      },
    });

    res.status(201).json({
      message: "تم اضافة اللون بنجاح",
      color,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء اضافة اللون",
    });
  }
};

export const deleteColor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const color = await prisma.color.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "تم حذف اللون بنجاح",
      color,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "حدث خطأ أثناء حذف اللون",
    });
  }
};

export const totalColors = async (req: Request, res: Response) => {
  try {
    const colors = await prisma.color.count();
    res.status(200).json({
      message: "تم جلب عدد الألوان بنجاح",
      colors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب عدد الألوان",
    });
  }
};

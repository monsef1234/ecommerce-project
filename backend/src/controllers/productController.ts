import { type Request, type Response } from "express";
import prisma from "../prisma/client";
import sharp from "sharp";
import { supabase } from "../utils/supabaseClient";
import { z } from "zod";

const productSchema = z
  .object({
    title: z.string().nonempty("الاسم مطلوب"),
    price: z
      .string()
      .nonempty("السعر مطلوب")
      .regex(/^\d+(\.\d+)?$/, "الرقم غير صحيح"),

    hasDiscount: z.preprocess(
      (val) => val === "true",
      z.boolean().default(false)
    ),
    description: z
      .string()
      .nonempty("الوصف مطلوب")
      .min(10, "الوصف يجب أن يكون أكثر من 10 حروف"),
    discountPrice: z.string().optional(),
    colors: z.array(z.string()).nonempty("اللون مطلوب"),
    deletedImages: z.array(z.string()).optional(),
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

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, price, description, hasDiscount, discountPrice, colors } =
      productSchema.parse(req.body) as z.infer<typeof productSchema>;

    const imagesData = [];

    for (const file of req.files as Express.Multer.File[]) {
      const filename =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + ".webp";

      const Buffer = await sharp(file.buffer).webp({ quality: 70 }).toBuffer();

      const { data, error } = await supabase.storage
        .from("product_images")
        .upload(filename, Buffer);

      if (error) {
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product_images").getPublicUrl(data?.path!);

      imagesData.push({ url: publicUrl });
    }

    const product = await prisma.product.create({
      data: {
        title,
        price: parseFloat(price),
        description,
        hasDiscount,
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        colors: {
          create: colors.map((id: string) => ({
            color: { connect: { id: Number(id) } },
          })),
        },
        images: {
          create: imagesData,
        },
      },
    });

    res.status(201).json({
      message: "تم اضافة المنتج بنجاح",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء اضافة المنتج",
    });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { skip, limit } = req.query as { skip: string; limit: string };

    const products = await prisma.product.findMany({
      include: {
        colors: {
          include: {
            color: true,
          },
        },
        images: true,
      },
      take: Number(limit),
      skip: Number(skip),
    });

    res.status(200).json({
      message: "تم جلب المنتجات بنجاح",
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "حدث خطأ أثناء جلب المنتجات",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        colors: {
          include: {
            color: true,
          },
        },
        images: true,
      },
    });
    const formattedProduct = {
      ...product,
      colors: product?.colors.map((c) => c.color),
    };
    res.status(200).json({
      message: "تم جلب المنتج بنجاح",
      product: formattedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب المنتج",
    });
  }
};

export const getLength = async (req: Request, res: Response) => {
  try {
    const length = await prisma.product.count();

    res.status(200).json({
      message: "تم جلب عدد المنتجات بنجاح",
      length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "حدث خطأ أثناء جلب عدد المنتجات",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as {id: string};

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "تم حذف المنتج بنجاح",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "حدث خطأ أثناء حذف المنتج",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const {
      title,
      price,
      description,
      hasDiscount,
      discountPrice,
      colors,
      deletedImages,
    } = productSchema.parse(req.body);

    if (deletedImages && deletedImages.length > 0) {
      await prisma.product.update({
        where: {
          id: Number(id),
        },
        data: {
          images: {
            deleteMany: {
              id: {
                in: deletedImages.map((id: string) => Number(id)),
              },
            },
          },
        },
      });
    }

    let imagesData = [];

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      for (const file of req.files as Express.Multer.File[]) {
        const filename =
          Date.now() + "-" + Math.round(Math.random() * 1e9) + ".webp";

        const Buffer = await sharp(file.buffer)
          .webp({ quality: 70 })
          .toBuffer();

        const { data, error } = await supabase.storage
          .from("product_images")
          .upload(filename, Buffer);

        if (error) {
          throw error;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("product_images").getPublicUrl(data?.path!);

        imagesData.push({ url: publicUrl });
      }
    }

    await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        price: parseFloat(price),
        description,
        hasDiscount: hasDiscount,
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        colors: {
          deleteMany: {},
          create: colors.map((c: string) => ({
            color: {
              connect: { id: Number(c) },
            },
          })),
        },
        ...(imagesData.length > 0 && {
          images: {
            create: imagesData,
          },
        }),
      },
    });

    res.status(200).json({
      message: "تم تحديث المنتج بنجاح",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error,
      });
    }
    console.error(error);

    res.status(500).json({
      message: "حدث خطأ أثناء تحديث المنتج",
    });
  }
};

export const getLastProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      include: {
        colors: {
          include: {
            color: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "تم جلب المنتجات بنجاح",
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "حدث خطأ أثناء جلب المنتجات",
    });
  }
};

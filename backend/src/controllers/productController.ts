import { type Request, type Response } from "express";
import prisma from "../prisma/client";
import sharp from "sharp";
import { supabase } from "../utils/supabaseClient";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, price, description, hasDiscount, discountPrice, colors } =
      req.body;

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
        hasDiscount: hasDiscount === "true" ? true : false,
        discountPrice: parseFloat(discountPrice) || null,
        colors: {
          connect: colors.map((color: string) => {
            return { id: Number(color) };
          }),
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
    const { skip, limit } = req.query;

    const products = await prisma.product.findMany({
      include: {
        colors: true,
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
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        colors: true,
        images: true,
      },
    });

    res.status(200).json({
      message: "تم جلب المنتج بنجاح",
      product,
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
    const { id } = req.params;

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
    const { id } = req.params;

    const {
      title,
      price,
      description,
      hasDiscount,
      discountPrice,
      colors,
      deletedImages,
    } = req.body;

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
        hasDiscount: hasDiscount === "true" ? true : false,
        discountPrice: parseFloat(discountPrice) || null,
        colors: {
          connect: colors.map((color: string) => {
            return { id: Number(color) };
          }),
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
    console.error(error);

    res.status(500).json({
      message: "حدث خطأ أثناء تحديث المنتج",
    });
  }
};

export const removeImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        images: {
          delete: {
            id: Number(id),
          },
        },
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

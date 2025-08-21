import { type Request, type Response } from "express";
import prisma from "../prisma/client";
import sharp from "sharp";
import path from "path";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, price, description, hasDiscount, discountPrice, colors } =
      req.body;

    console.log(req.body);

    const imagesData = [];

    for (const file of req.files as Express.Multer.File[]) {
      const filename =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + ".webp";
      const filepath = path.join("uploads", filename);

      await sharp(file.buffer).webp({ quality: 70 }).toFile(filepath);

      imagesData.push({ url: `/uploads/${filename}` });
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
      message: "Product created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create product",
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
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get products",
    });
  }
};

export const getLength = async (req: Request, res: Response) => {
  try {
    const length = await prisma.product.count();
    
    res.status(200).json({
      message: "Length retrieved successfully",
      length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get length",
    });
  }
};

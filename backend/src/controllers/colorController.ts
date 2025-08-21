import { type Request, type Response } from "express";
import prisma from "../prisma/client";

export const getAllColors = async (req: Request, res: Response) => {
  try {
    const colors = await prisma.color.findMany();
    res.status(200).json({
      message: "Colors retrieved successfully",
      colors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to get colors",
    });
  }
};

export const createColor = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;
    const find = await prisma.color.findFirst({
      where: {
        code,
      },
    });

    if (find) {
      return res.status(409).json({
        error: "Color already exists",
      });
    }

    const color = await prisma.color.create({
      data: {
        name,
        code,
      },
    });

    res.status(201).json({
      message: "Color created successfully",
      color,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create color",
    });
  }
};

export const deleteColor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const color = await prisma.color.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Color deleted successfully",
      color,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete color",
    });
  }
};

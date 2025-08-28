import { type Request, type Response } from "express";
import prisma from "../prisma/client";
import { z } from "zod";
import { sendOrderEmail } from "../services/email";

const orderSchema = z.object({
  fullname: z
    .string()
    .nonempty("الاسم الكامل مطلوب")
    .min(3, "الاسم الكامل يجب أن يكون أكثر من 3 حروف"),
  phone: z
    .string()
    .nonempty("رقم الهاتف مطلوب")
    .regex(/^0[567]\d{8}$/, "رقم الهاتف غير صحيح"),
  address: z.string().nonempty("العنوان مطلوب"),
  delivery: z.enum(["home", "point"]),
  total: z.number().positive("الإجمالي مطلوب."),
  state: z
    .object({
      id: z.number(),
      state: z.string(),
      home: z.number().optional(),
      point: z.number().optional(),
    })
    .refine((val) => val !== null, { message: "الولاية مطلوبة." }),
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { fullname, phone, address, delivery, state, total } =
      orderSchema.parse(req.body);

    const { products } = req.body;

    await prisma.order.create({
      data: {
        fullname,
        phone,
        address,
        delivery,
        state,
        total,
        products: {
          create: products.map(
            (product: {
              quantity: number;
              price: number;
              productId: number;
              colorId: number;
            }) => ({
              quantity: product.quantity,
              price: product.price,
              productId: product.productId,
              colorId: product.colorId,
            })
          ),
        },
      },
    });

    await sendOrderEmail({ fullname, phone, address, state, total, products });

    res.status(201).json({
      message: "تم اضافة الطلب بنجاح",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء اضافة الطلب",
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: true,
            color: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "تم جلب الطلبات بنجاح",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الطلبات",
    });
  }
};

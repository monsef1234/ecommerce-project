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
  address: z.string().optional(),
  delivery: z.enum(["home", "point"]),
  total: z.number().positive("الإجمالي مطلوب."),
  district: z.string().nonempty("الدائرة مطلوبة."),
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
    const { fullname, phone, address, delivery, state, total, district } =
      orderSchema.parse(req.body) as z.infer<typeof orderSchema>;

    const { products } = req.body as { products: any[] };

    await prisma.order.create({
      data: {
        fullname,
        phone,
        address: address || null,
        delivery,
        state,
        total,
        district,
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

    await sendOrderEmail({
      fullname,
      phone,
      address,
      state,
      total,
      products,
      district,
    });

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

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body as { id: number; status: string };

    await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    res.status(200).json({
      message: "تم تحديث حالة الطلب بنجاح",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء تحديث حالة الطلب",
    });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    await prisma.order.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "تم حذف الطلب بنجاح",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء حذف الطلب",
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const { skip, limit } = req.query as { skip: string; limit: string };
  try {
    const orders = await prisma.order.findMany({
      take: Number(limit),
      skip: Number(skip),
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

export const getAllOrdersCount = async (req: Request, res: Response) => {
  try {
    const count = await prisma.order.count();
    res.status(200).json({
      message: "تم جلب عدد الطلبات بنجاح",
      count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب عدد الطلبات",
    });
  }
};

export const getDeliveredOrdersCount = async (req: Request, res: Response) => {
  try {
    const count = await prisma.order.count({
      where: {
        status: "delivered",
      },
    });
    res.status(200).json({
      message: "تم جلب عدد الطلبات المكتملة بنجاح",
      count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب عدد الطلبات المكتملة",
    });
  }
};

export const getNotDeliveredOrdersCount = async (
  req: Request,
  res: Response
) => {
  try {
    const count = await prisma.order.count({
      where: {
        status: "not_delivered",
      },
    });
    res.status(200).json({
      message: "تم جلب عدد الطلبات غير المكتملة بنجاح",
      count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب عدد الطلبات غير المكتملة",
    });
  }
};

export const getAllOrdersPriceTotal = async (req: Request, res: Response) => {
  try {
    const total = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });
    res.status(200).json({
      message: "تم جلب إجمالي سعر الطلبات بنجاح",
      total: total._sum.total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب إجمالي سعر الطلبات",
    });
  }
};

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const currencyFormat = (price: number) => {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
  }).format(price);
};

export const sendOrderEmail = async (order: any) => {
  await transporter.sendMail({
    from: `"متجري" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "تم اضافة طلب جديد",
    text: `تم اضافة طلب جديد من ${order.fullname}, رقم الهاتف: ${
      order.phone
    }, إجمالي: ${currencyFormat(order.total)}`,
    html: `
      <h2 style="font-family: Arial, sans-serif; color: #333;">🛒 تم إضافة طلب جديد</h2>
      <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">الاسم</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            order.fullname
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">رقم الهاتف</td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            <a href="tel:${
              order.phone
            }" style="color: #007BFF; text-decoration: none;">${order.phone}</a>
          </td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">الولاية</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            order.state.state
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">الدائرة</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            order.district
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">العنوان</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            order.address
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">المنتجات</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${order.products
            .map((product: any) => product?.title)
            .join(", ")}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">طريقة التوصيل</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${
            order.delivery === "home" ? "للمنزل" : "ZR Express"
          }</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">الإجمالي</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${currencyFormat(
            order.total
          )}</td>
        </tr>
      </table>
      <p style="margin-top: 16px;">
        <a href="https://www.mysouqdz.store/dashboard" 
           style="background: #007BFF; color: #fff; padding: 10px 16px; text-decoration: none; border-radius: 4px; font-family: Arial, sans-serif;">
          عرض التفاصيل 🔎
        </a>
      </p>
    `,
  });
};

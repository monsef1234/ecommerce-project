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
        <h2>تم اضافة طلب جديد</h2>
        <p><b>الاسم:</b> ${order.fullname}</p>
        <p><b>رقم الهاتف:</b> <a href="tel:${order.phone}">${
      order.phone
    }</a></p>
        <p><b>الولاية:</b> ${order.state.state}</p>
        <p><b>العنوان:</b> ${order.address}</p>
        <p><b>المنتجات:</b> ${order.products
          .map((product: any) => product?.title)
          .join(", ")}</p>
        <p><b>الطريقة:</b> ${
          order.delivery === "home" ? "للمنزل" : "ZR Express"
        }</p>
        <p><b>الإجمالي:</b> ${currencyFormat(order.total)}</p>

        <a href="https://ecommerce-project-iota-one.vercel.app/dashboard">التفاصيل</a>
      `,
  });
};

import express from "express";
import dotenv from "dotenv";
import colorRoutes from "./routes/colorRoutes";
import productRoutes from "./routes/productRoutes";
import settingRoutes from "./routes/settingRoutes";
import orderRoutes from "./routes/orderRoutes";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://ecommerce-project-iota-one.vercel.app",
      "https://www.mysouqdz.store",
      "https://mysouqdz.store",
    ],
    credentials: true,
  })
);

app.use("/api/colors", colorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/uploads", express.static("uploads"));

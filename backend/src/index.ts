import express from "express";
import dotenv from "dotenv";
import colorRoutes from "./routes/colorRoutes";
import productRoutes from "./routes/productRoutes";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use("/colors", colorRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/uploads", express.static("uploads"));

import type { Color } from "./color";

export interface Image {
  id: number;
  url: string;
  createdAt?: string;
  updatedAt?: string;
  productId: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  hasDiscount: boolean;
  discountPrice?: number;
  description: string;
  colors: Color[];
  images: Image[];
  createdAt?: string;
  updatedAt?: string;
}

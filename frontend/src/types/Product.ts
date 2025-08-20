import type { Color } from "./color";

export interface Image {
  id: number;
  url: string;
}

export interface Product {
  id: number;
  title: string;
  price: string;
  hasDiscount: boolean;
  discountPrice?: string;
  description: string;
  colors: Color[];
  images: Image[];
}

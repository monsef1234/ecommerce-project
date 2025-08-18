interface Image {
  id: number;
  url: string;
  isMain: boolean;
}

export interface Color {
  id: number;
  name: string;
  code: string;
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

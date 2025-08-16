interface Image {
  id: number;
  url: string;
  isMain: boolean;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  hasDiscount: boolean;
  discountPrice?: number;
  description: string;
  images: Image[];
}

import { defineStore } from "pinia";
import type { Product } from "@/types/Product";

export const useStoreProduct = defineStore("product", {
  state: () => ({
    products: [
      {
        id: 1,
        title: "Prodsd,dsl,lsdn,flksdnflskd uct 1",
        price: 10,
        hasDiscount: false,
        description: "Product 1 description",
        images: [
          {
            id: 1,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: true,
          },
        ],
      },
      {
        id: 2,
        title: "Product 2",
        price: 2000000,
        hasDiscount: true,
        discountPrice: 150000,
        description: "Product 2 description",
        images: [
          {
            id: 1,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: true,
          },
        ],
      },
      {
        id: 3,
        title: "Product 3",
        price: 3000000,
        hasDiscount: false,
        description: "Product 3 description",
        images: [
          {
            id: 1,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: true,
          },
        ],
      },
      {
        id: 4,
        title: "Product 4",
        price: 4000000,
        hasDiscount: true,
        discountPrice: 350000,
        description: "Product 4 description",
        images: [
          {
            id: 1,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: true,
          },
        ],
      },
      {
        id: 5,
        title: "Product 5",
        price: 5000000,
        hasDiscount: false,
        description: "Product 5 description",
        images: [
          {
            id: 1,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: true,
          },
        ],
      },
      {
        id: 6,
        title: "Product 6",
        price: 6000000,
        hasDiscount: true,
        discountPrice: 550000,
        description: "Product 6 description",
        images: [
          {
            id: 1,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: true,
          },
        ],
      },
    ] as Product[],
  }),
  actions: {},
});

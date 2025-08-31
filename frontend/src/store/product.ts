import { defineStore } from "pinia";
import type { Product } from "@/types/Product";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    product: {
      id: 0,
      title: "",
      price: 0,
      hasDiscount: false,
      status: true,
      discountPrice: 0,
      description: "",
      images: [],
      colors: [],
    } as Product,
    total: 0,
  }),

  actions: {
    getProductById(id: number) {
      return this.products.find((product) => product.id === id);
    },

    deleteProduct(product: Product) {
      this.products = this.products.filter((p) => p.id !== product.id);
    },

    editProduct(product: Product) {
      this.products = this.products.map((p) =>
        p.id === product.id ? product : p
      );
    },
  },
});

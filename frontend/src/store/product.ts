import { defineStore } from "pinia";
import type { Product } from "@/types/Product";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    total: 0,
  }),

  actions: {
    getProductById(id: number) {
      return this.products.find((product) => product.id === id);
    },

    editProduct(product: Product) {
      console.log(product);

      this.products = this.products.map((p) =>
        p.id === product.id ? product : p
      );
    },
  },
});

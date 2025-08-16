import type { CartProduct } from "@/types/cartProduct";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [] as CartProduct[],
  }),

  actions: {
    addToCart(product: CartProduct) {
      const cartProduct = this.cart.find((p) => p.id === product.id);

      if (cartProduct) {
        cartProduct.quantity += product.quantity;
      } else {
        this.cart.push(product);
      }
    },
  },
});

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

    removeProduct(product: CartProduct) {
      this.cart = this.cart.filter((p) => p.id !== product.id);
    },

    getTotalPriceOneProduct(product: CartProduct) {
      return (
        (product.hasDiscount ? product.discountPrice! : product.price) *
        product.quantity
      );
    },

    getTotalPrice() {
      return this.cart.reduce(
        (total, product) => total + this.getTotalPriceOneProduct(product),
        0
      );
    },
  },

  getters: {
    reset(state) {
      return (state.cart = []);
    },
  },
});

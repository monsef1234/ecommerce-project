import { defineStore } from "pinia";
import type { Product } from "@/types/Product";

export const useStoreProduct = defineStore("product", {
  state: () => ({
    products: [
      {
        id: 1,
        title: "Prodsd,dsl,lsdn,flksdnflskd uct 1",
        price: 100000,
        hasDiscount: true,
        discountPrice: 80000,
        description: `🔥 عرض خاص – كاسك P9 + AirPods Pro 2 🔥

🎧 استمتع بأفضل تجربة صوت مع باك مميز يجمع بين:

✅ كاسك P9 ستيريو – تصميم عصري وجودة عالية

✅ AirPods Pro 2 – عزل ضوضاء وراحة في الاستعمال

 

 (ZR Express) 🚚 توصيل سريع لكل الولايات

💵 الدفع عند الاستلام

📲 اطلب الآن من الرسائل وعيش تجربة صوت استثنائية!

`,
        colors: [
          {
            id: 1,
            name: "Red",
            code: "#FF0000",
          },
          {
            id: 2,
            name: "Green",
            code: "#00FF00",
          },
          {
            id: 3,
            name: "Blue",
            code: "#0000FF",
          },
          {
            id: 4,
            name: "Yellow",
            code: "#FFFF00",
          },
          {
            id: 5,
            name: "Black",
            code: "#000000",
          },
          {
            id: 6,
            name: "White",
            code: "#FFFFFF",
          },
          {
            id: 7,
            name: "Pink",
            code: "#FF00FF",
          },
        ],
        images: [
          {
            id: 1,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: true,
          },
          {
            id: 2,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: false,
          },
          {
            id: 3,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: false,
          },
          {
            id: 4,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: false,
          },
          {
            id: 5,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: false,
          },
          {
            id: 6,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: false,
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
        colors: [
          {
            id: 1,
            name: "Red",
            code: "#FF0000",
          },
          {
            id: 2,
            name: "Green",
            code: "#00FF00",
          },
          {
            id: 3,
            name: "Blue",
            code: "#0000FF",
          },
        ],
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
        colors: [
          {
            id: 1,
            name: "Red",
            code: "#FF0000",
          },
          {
            id: 2,
            name: "Green",
            code: "#00FF00",
          },
          {
            id: 3,
            name: "Blue",
            code: "#0000FF",
          },
        ],
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
        colors: [
          {
            id: 1,
            name: "Red",
            code: "#FF0000",
          },
          {
            id: 2,
            name: "Green",
            code: "#00FF00",
          },
          {
            id: 3,
            name: "Blue",
            code: "#0000FF",
          },
        ],
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
        colors: [
          {
            id: 1,
            name: "Red",
            code: "#FF0000",
          },
          {
            id: 2,
            name: "Green",
            code: "#00FF00",
          },
          {
            id: 3,
            name: "Blue",
            code: "#0000FF",
          },
        ],
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

  getters: {
    getProductById(state) {
      return (id: number): Product | undefined =>
        state.products.find((product) => product.id === id);
    },
  },
});

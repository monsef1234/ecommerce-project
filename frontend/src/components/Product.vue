<template>
  <Card
    class="relative cursor-pointer card"
    @click="$router.push(`/products/${product.id}`)"
  >
    <template #header>
      <div class="relative">
        <Image alt="product image" :src="product.images[0].url" />
        <Tag
          class="absolute bottom-0 left-0 px-2 py-1 rounded-none! rounded-tr-lg! text-md!"
          :severity="product.status ? 'success' : 'danger'"
          >{{ product.status ? "متوفر" : "غير متوفر" }}</Tag
        >
      </div>
    </template>
    <template #title>
      <span class="text-xl truncate block text-black">{{ product.title }}</span>
    </template>
    <template #content>
      <p class="m-0 flex items-center flex-wrap gap-2 sm:gap-4">
        <span
          class="font-bold"
          :class="
            product.hasDiscount
              ? 'line-through text-gray-500 text-md'
              : 'text-lg'
          "
          >{{ currencyFormat(Number(product.price)) }}</span
        >
        <span
          class="font-bold text-lg text-green-500"
          v-if="product.hasDiscount"
          >{{ currencyFormat(Number(product.discountPrice)!) }}</span
        >
        <Tag
          class="absolute top-0 left-0 bg-red-500! text-white! px-2 py-1 rounded-none! rounded-br-lg! text-md!"
          v-if="product.hasDiscount"
          >Discount</Tag
        >
      </p>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { currencyFormat } from "@/utilities/currencyFormat";
import type { Product } from "@/types/Product";

export default defineComponent({
  name: "Product",

  props: {
    product: {
      type: Object as PropType<Product>,
      required: true,
    },
  },

  setup() {
    return {
      currencyFormat,
    };
  },
});
</script>

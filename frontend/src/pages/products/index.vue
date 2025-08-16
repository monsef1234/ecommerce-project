<template>
  <div class="container">
    <h1 class="text-2xl text-center font-bold">جميع المنتوجات</h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 mb-6"
    >
      <Product
        v-for="product in storeProduct.products.slice(0, limit)"
        :key="product.id"
        :product="product"
      />
    </div>

    <Button
      label="عرض المزيد"
      icon="pi pi-arrow-down"
      variant="outlined"
      class="flex! mx-auto! mb-10 hover:bg-black! hover:text-white! disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent! disabled:hover:text-black!"
      @click="loadMore"
      :disabled="limit >= storeProduct.products.length || loading"
      :loading="loading"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Product from "@/components/Product.vue";
import { useStoreProduct } from "@/store/product";

export default defineComponent({
  name: "Products",

  data() {
    return {
      limit: 3,
      loading: false,
    };
  },

  methods: {
    loadMore() {
      this.loading = true;
      setTimeout(() => {
        this.limit += 3;
        this.loading = false;
      }, 3000);
    },
  },

  setup() {
    const storeProduct = useStoreProduct();

    return {
      storeProduct,
    };
  },
});
</script>

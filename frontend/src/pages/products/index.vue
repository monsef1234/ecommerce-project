<template>
  <div class="container">
    <h1 class="text-2xl text-center font-bold">جميع المنتوجات</h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 mb-10"
      v-if="!loading && products.length"
    >
      <Product
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <div v-if="!loading && !products.length">
      <p class="text-center text-lg font-bold my-6">لا يوجد منتجات</p>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 mb-6"
      v-if="loading"
    >
      <div class="flex flex-col gap-4" v-for="i in 8" :key="i">
        <Skeleton shape="rectangle" class="h-72! w-full!" />
        <Skeleton />
        <Skeleton />
      </div>
    </div>

    <Button
      v-if="!loading && products.length && products.length < total"
      label="عرض المزيد"
      icon="pi pi-arrow-down"
      variant="outlined"
      class="flex! mx-auto! mb-10 hover:bg-black! hover:text-white! disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent! disabled:hover:text-black!"
      @click="loadMore"
      :loading="loadingMore"
      :disabled="loadingMore"
    />

    <Toast dir="rtl" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Product from "@/components/Product.vue";
import axios from "axios";
import type { Product as ProductType } from "@/types/Product";

export default defineComponent({
  name: "Products",

  data() {
    return {
      limit: 8,
      skip: 0,
      total: 0,

      products: [] as ProductType[],

      loading: false,
      loadingMore: false,
    };
  },

  methods: {
    async getProducts() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}products?limit=${this.limit}&skip=${
            this.skip
          }`
        );

        this.products = [...this.products, ...response.data.products];
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async getLength() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}products/length`
        );

        this.total = response.data.length;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async loadMore() {
      this.loadingMore = true;
      this.skip += this.limit;
      await this.getProducts();
      this.loadingMore = false;
    },
  },

  async mounted() {
    this.loading = true;
    await this.getLength();
    await this.getProducts();
    this.loading = false;
  },
});
</script>

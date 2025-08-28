<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Products</h1>

    <DataTable
      :value="products"
      tableStyle="min-width: 50rem"
      class="relative!"
      :loading="loading"
    >
      <template #loading>
        <ProgressBar
          mode="indeterminate"
          style="height: 5px !important"
          class="w-full! absolute! top-0! left-0!"
        ></ProgressBar>
      </template>

      <template #empty>
        <div
          class="text-center"
          v-if="!loading && !storeProduct.products.length"
        >
          <p class="text-lg font-bold">لا يوجد منتجات</p>
        </div>
      </template>

      <Column
        header="ID"
        class="w-1/12! md:w-1/6!"
        style="width: 5% !important"
      >
        <template #body="slotProps">
          <span class="text-lg">{{ slotProps.index + 1 }}</span>
        </template>
      </Column>

      <Column field="images" header="Image  ">
        <template #body="slotProps">
          <Image
            :src="slotProps.data.images[0].url"
            :alt="slotProps.data.images[0].url.split('/').pop()!"
            class="shadow-lg"
            width="80"
          />
        </template>
      </Column>
      <Column field="title" header="Name" sortable />
      <Column field="colors" header="Colors">
        <template #body="slotProps">
          <div class="flex gap-2 flex-wrap" v-if="slotProps.data.colors.length">
            <Tag
              v-for="color in slotProps.data.colors"
              :key="color.id"
              :value="color.color.name"
              :style="{
                backgroundColor: color.color.code,
                color: getContrastColor(color.color.code),
              }"
            />
          </div>

          <span v-else class="font-bold text-lg"> - </span>
        </template>
      </Column>
      <Column field="price" header="Price" sortable>
        <template #body="slotProps">
          <span class="font-bold">{{
            currencyFormat(Number(slotProps.data.price))
          }}</span>
        </template>
      </Column>
      <Column field="hasDiscount" header="Discount" sortable>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.hasDiscount ? 'Yes' : 'No'"
            :severity="slotProps.data.hasDiscount ? 'success' : 'danger'"
          />
        </template>
      </Column>
      <Column field="discountPrice" header="Discount Price" sortable>
        <template #body="slotProps">
          <span v-if="slotProps.data.hasDiscount" class="font-bold">{{
            currencyFormat(Number(slotProps.data.discountPrice))
          }}</span>
          <span v-else class="font-bold text-lg"> - </span>
        </template>
      </Column>
      <Column field="createdAt" header="Created At" sortable>
        <template #body="slotProps">
          {{ format(slotProps.data.createdAt, "dd/MM/yyyy, HH:mm") }}
        </template>
      </Column>
      <Column field="actions" header="Actions">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            class="p-button-warning"
            aria-label="Edit"
            variant="text"
            @click="editProduct(slotProps.data)"
            :disabled="deleteLoading"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-danger"
            aria-label="Delete"
            variant="text"
            @click="deleteProduct(slotProps.data)"
            :loading="deleteLoading"
            :disabled="deleteLoading"
          />
        </template>
      </Column>
    </DataTable>
    <Paginator
      class="mb-6!"
      :rows="limit"
      :totalRecords="total"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      @page="onPageChange"
    ></Paginator>

    <Toast dir="rtl" class="w-3xs! md:w-1/4! text-lg! md:text-xl!" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { Product } from "@/types/Product";
import { currencyFormat } from "@/utilities/currencyFormat";
import { format } from "date-fns";
import { useProductStore } from "@/store/product";
import axios from "axios";
import type { PageState } from "primevue";

export default defineComponent({
  name: "DashboardProducts",

  data() {
    return {
      loading: false,
      deleteLoading: false,
      limit: 10,
      skip: 0,

      products: [] as Product[],
      total: 0,
    };
  },

  methods: {
    getContrastColor(hex: string) {
      const c = hex.substring(1);
      const rgb = parseInt(c, 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance > 186 ? "black" : "white";
    },

    editProduct(product: Product) {
      this.$router.push(`/dashboard/products/${product.id}`);
    },

    async fetchProducts() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}products?limit=${this.limit}&skip=${
            this.skip
          }`
        );

        this.products = response.data.products ?? [];
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async fetchLength() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}products/length`
        );

        this.total = response.data.length ?? 0;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async onPageChange(event: PageState) {
      this.skip = event.first;
      this.limit = event.rows;

      this.loading = true;
      await this.fetchProducts();
      this.loading = false;
    },

    async deleteProduct(product: Product) {
      this.deleteLoading = true;
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}products/${product.id}`
        );

        this.$toast.add({
          severity: "success",
          summary: "نجاح",
          detail: response.data.message,
          life: 3000,
        });

        this.products = this.products.filter((p) => p.id !== product.id);
        this.deleteLoading = false;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
        this.deleteLoading = false;
      }
    },
  },

  setup() {
    const storeProduct = useProductStore();

    return {
      storeProduct,
      currencyFormat,
      format,
    };
  },

  async mounted() {
    this.loading = true;
    await this.fetchLength();
    await this.fetchProducts();
    this.loading = false;
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
  requiresAuth: true
</route>

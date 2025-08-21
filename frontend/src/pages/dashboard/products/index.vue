<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Products</h1>

    <DataTable
      :value="storeProduct.products"
      tableStyle="min-width: 50rem"
      :loading="loading"
    >
      <template #loading>
        <div class="flex justify-center">
          <ProgressSpinner stroke-width="2" />
        </div>
      </template>

      <template #empty>
        <div
          class="text-center"
          v-if="!loading && !storeProduct.products.length"
        >
          <p>لا يوجد منتجات</p>
        </div>
      </template>

      <Column field="images" header="Image">
        <template #body="slotProps">
          <Image
            :src="`http://192.168.1.42:4000${slotProps.data.images[0].url}`"
            :alt="slotProps.data.images[0].url"
            class="shadow-lg"
            width="80"
          />
        </template>
      </Column>
      <Column field="title" header="Name" sortable />
      <Column field="colors" header="Colors">
        <template #body="slotProps">
          <div class="flex gap-2 flex-wrap">
            <Tag
              v-for="color in slotProps.data.colors"
              :key="color.id"
              :value="color.name"
              :style="{
                backgroundColor: color.code,
                color: getContrastColor(color.code),
              }"
            />
          </div>
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
          />
          <Button
            icon="pi pi-trash"
            class="p-button-danger"
            aria-label="Delete"
            variant="text"
          />
        </template>
      </Column>
    </DataTable>
    <Paginator
      class="mb-6!"
      :rows="limit"
      :totalRecords="storeProduct.total"
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
      limit: 10,
      skip: 0,
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
          `http://192.168.1.42:4000/products?limit=${this.limit}&skip=${this.skip}`
        );

        if (response.status === 200) {
          this.storeProduct.products = response.data.products;
        }
      } catch (error) {
        console.error(error);

        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "حدث خطأ",
          life: 3000,
        });
      }
    },

    async fetchLength() {
      try {
        const response = await axios.get(
          "http://192.168.1.42:4000/products/length"
        );

        if (response.status === 200) {
          this.storeProduct.total = response.data.length;
        }
      } catch (error) {
        console.error(error);

        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "حدث خطأ",
          life: 3000,
        });
      }
    },

    async onPageChange(event: PageState) {
      console.log(event);
      this.skip = event.first;
      this.limit = event.rows;

      this.loading = true;
      await this.fetchProducts();
      this.loading = false;
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
</route>

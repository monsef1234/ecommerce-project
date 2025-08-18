<template>
  <h1 class="text-2xl font-bold mb-6">Products</h1>

  <DataTable
    :value="storeProduct.products"
    paginator
    :rows="5"
    :rowsPerPageOptions="[5, 10, 15, 20]"
    tableStyle="min-width: 50rem"
  >
    <Column field="images" header="Image">
      <template #body="slotProps">
        <Image
          :src="slotProps.data.images[0].url"
          :alt="slotProps.data.images[0].url"
          class="shadow-lg"
          width="80"
        />
      </template>
    </Column>
    <Column field="title" header="Name" sortable>
      <template #body="slotProps">
        {{ slotProps.data.title }}
      </template>
    </Column>
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
          currencyFormat(slotProps.data.price)
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
          currencyFormat(slotProps.data.discountPrice)
        }}</span>
        <span v-else class="font-bold text-lg"> - </span>
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
</template>

<script lang="ts">
import { defineComponent } from "vue";

import type { Product } from "@/types/Product";
import { currencyFormat } from "@/utilities/currencyFormat";
import { format } from "date-fns";
import { useProductStore } from "@/store/product";

export default defineComponent({
  name: "DashboardProducts",

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
  },

  setup() {
    const storeProduct = useProductStore();

    return {
      storeProduct,
      currencyFormat,
      format,
    };
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

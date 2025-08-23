<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Colors</h1>

    <DataTable
      :value="colors"
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
        <div class="text-center" v-if="!loading && !colors.length">
          <p class="text-lg font-bold">لا يوجد ألوان</p>
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
      <Column field="code" header="Code" class="w-1/12! md:w-1/6!">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <span
              :style="{ backgroundColor: slotProps.data.code }"
              class="w-8 h-8 rounded-full block"
            ></span>
            <span class="uppercase">{{ slotProps.data.code }}</span>
          </div>
        </template>
      </Column>
      <Column field="name" header="Name" class="w-1/12! md:w-1/6!" sortable>
        <template #body="slotProps">
          <span class="text-lg">{{ slotProps.data.name }}</span>
        </template>
      </Column>
      <Column field="actions" header="Actions" class="w-1/12! md:w-1/6!">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            class="p-button-danger"
            aria-label="Delete"
            variant="text"
            :loading="deletedColor"
            :disabled="deletedColor"
            @click="deleteColor(slotProps.data)"
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

import type { Color } from "@/types/color";
import axios from "axios";
import type { PageState } from "primevue";

export default defineComponent({
  name: "Colors",

  data() {
    return {
      loading: false as boolean,
      deletedColor: false as boolean,

      colors: [] as Color[],

      limit: 10 as number,
      skip: 0 as number,
      total: 0 as number,
    };
  },

  methods: {
    async deleteColor(color: Color) {
      this.deletedColor = true;
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}colors/${color.id}`
        );

        this.$toast.add({
          severity: "success",
          summary: "نجاح",
          detail: response?.data?.message || "تم حذف اللون بنجاح",
          life: 3000,
        });

        this.colors = this.colors.filter((c) => c.id !== color.id);
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      } finally {
        this.deletedColor = false;
      }
    },

    async loadColors() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}colors?limit=${this.limit}&skip=${
            this.skip
          }`
        );

        this.colors = response.data.colors;
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
          `${import.meta.env.VITE_API_URL}colors/length`
        );

        this.total = response.data.colors ?? 0;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async onPageChange(pageState: PageState) {
      this.limit = pageState.rows;
      this.skip = pageState.first;

      this.loading = true;
      await this.loadColors();
      this.loading = false;
    },
  },

  async mounted() {
    this.loading = true;
    await this.loadColors();
    await this.fetchLength();
    this.loading = false;
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

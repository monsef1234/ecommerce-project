<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Colors</h1>

    <DataTable
      :value="storeColor.colors"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      tableStyle="min-width: 50rem"
    >
      <Column field="id" header="ID" class="w-1/12! md:w-1/6!" />
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
      <Column field="name" header="Name" class="w-1/12! md:w-1/6!">
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
            @click="deleteColor(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useColorStore } from "@/store/color";
import type { Color } from "@/types/color";

export default defineComponent({
  name: "Colors",

  methods: {
    deleteColor(color: Color) {
      this.storeColor.removeColor(color);
    },
  },

  setup() {
    const storeColor = useColorStore();

    return {
      storeColor,
    };
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

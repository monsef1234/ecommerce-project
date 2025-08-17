<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Orders</h3>
          <i class="pi pi-shopping-cart"></i>
        </div>
        <p class="text-lg">100</p>
      </div>

      <div class="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Revenu</h3>
          <i class="pi pi-tag"></i>
        </div>
        <p class="text-lg t">10000</p>
      </div>

      <div class="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Users</h3>
          <i class="pi pi-user"></i>
        </div>
        <p class="text-lg">100</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dashboard",

  data() {
    return {
      isCollapsed: false,
    };
  },
});
</script>

<route lang="yaml">
meta:
  layout: "dashboard"
</route>

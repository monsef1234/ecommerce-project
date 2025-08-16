<template>
  <div>
    <h1>Product</h1>
  </div>
</template>

<script lang="ts">
import type { Product } from "@/types/Product";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Product",

  data() {
    return {
      product: null as Product | null,
    };
  },

  mounted() {
    const id = this.$route.params.id;
    console.log(id);
  },
});
</script>

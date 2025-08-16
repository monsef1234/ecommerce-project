<template>
  <h1>About Page</h1>
  <Button color="red" label="Profile" icon="pi pi-user" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      value: null,
      items: [],
    };
  },

  methods: {},
});
</script>

<route lang="yaml">
meta:
  layout: "admin"
</route>

<template>
  <footer class="bg-black text-white py-10 text-center">
    <h3 class="text-xl">اتصلو بنا على</h3>
    <span
      class="text-lg font-bold my-6 block"
      v-for="phone in phones.filter((p) => p)"
      :key="phone"
    >
      {{ phone }}
    </span>
    <div class="social-media">
      <Button
        icon="pi pi-facebook"
        aria-label="Facebook"
        as="a"
        href="https://www.facebook.com/"
        target="_blank"
        rel="noopener"
        size="large"
      />
      <Button
        icon="pi pi-twitter"
        aria-label="Twitter"
        as="a"
        href="https://twitter.com/"
        target="_blank"
        rel="noopener"
        size="large"
      />
      <Button
        icon="pi pi-instagram"
        aria-label="Instagram"
        as="a"
        href="https://www.instagram.com/"
        target="_blank"
        rel="noopener"
        size="large"
      />
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useSettingsStore } from "@/store/settings";

export default defineComponent({
  name: "Footer",

  computed: {
    phones() {
      return [
        this.settingsStore.settings?.phone,
        this.settingsStore.settings?.phone2,
        this.settingsStore.settings?.phone3,
      ];
    },
  },

  setup() {
    const settingsStore = useSettingsStore();

    return {
      settingsStore,
    };
  },
});
</script>

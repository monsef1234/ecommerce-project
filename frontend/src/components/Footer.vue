<template>
  <footer class="bg-black text-white py-10 text-center">
    <h3 class="text-xl">اتصلو بنا على</h3>

    <a
      class="text-lg font-bold my-6 block"
      v-for="phone in phones.filter((p: string | undefined) => p)"
      :key="phone"
      :href="`tel:${phone}`"
    >
      {{ phone }}
    </a>

    <div class="social-media">
      <Button
        v-if="settingsStore.settings?.facebook"
        icon="pi pi-facebook"
        aria-label="Facebook"
        as="a"
        :href="settingsStore.settings?.facebook"
        target="_blank"
        rel="noopener"
        size="large"
      />
      <Button
        v-if="settingsStore.settings?.instagram"
        icon="pi pi-instagram"
        aria-label="Instagram"
        as="a"
        :href="settingsStore.settings?.instagram"
        target="_blank"
        rel="noopener"
        size="large"
      />
      <Button
        v-if="settingsStore.settings?.twitter"
        icon="pi pi-twitter"
        aria-label="Twitter"
        as="a"
        :href="settingsStore.settings?.twitter"
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
      ] as string[] | undefined[];
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

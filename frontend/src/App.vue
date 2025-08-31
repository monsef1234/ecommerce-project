<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useSettingsStore } from "@/store/settings";
import { useAuthStore } from "@/store/auth";

export default defineComponent({
  name: "App",

  setup() {
    const settingsStore = useSettingsStore();
    const authStore = useAuthStore();

    return {
      settingsStore,
      authStore,
    };
  },

  mounted() {
    this.settingsStore.fetchSetting();
  },
});
</script>

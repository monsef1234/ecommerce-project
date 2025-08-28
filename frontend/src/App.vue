<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import supabase from "@/supabase";
import { useSettingsStore } from "@/store/settings";
import { useAuthStore } from "@/store/auth";

export default defineComponent({
  name: "App",

  methods: {
    async checkUser() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (user) {
        // this.authStore.setUser(user);
      }
    },
  },

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
    this.checkUser();
  },
});
</script>

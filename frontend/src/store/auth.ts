import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),

  actions: {
    setUser(user: any) {
      this.user = user;
    },
  },
});

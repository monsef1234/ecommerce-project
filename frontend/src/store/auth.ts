import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      email: "qsmdd",
      password: "qsdqsdqsd",
    },
  }),

  actions: {
    setUser(user: any) {
      console.log(user);

      this.user = user;
    },
  },
});

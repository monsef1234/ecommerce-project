import { createRouter, createWebHistory } from "vue-router";
import generatedRoutes from "virtual:generated-pages";
import { setupLayouts } from "virtual:generated-layouts";
import { useAuthStore } from "@/store/auth";

const routes = setupLayouts(generatedRoutes);
const normalize = (path: string) => path.replace(/\/+$/, "");

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (
    to.meta.layout === "dashboard" &&
    !authStore.user &&
    normalize(to.path) !== "/admin/login"
  ) {
    next("/admin/login");
  } else if (authStore.user && normalize(to.path) === "/admin/login") {
    next("/admin/dashboard");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (normalize(to.path) === "/admin") {
    if (!authStore.user) {
      next("/admin/login");
    } else {
      next("/admin/dashboard");
    }
  } else {
    next();
  }
});

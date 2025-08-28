import { createRouter, createWebHistory } from "vue-router";
import generatedRoutes from "virtual:generated-pages";
import { setupLayouts } from "virtual:generated-layouts";
import supabase from "@/supabase";

const routes = setupLayouts(generatedRoutes);
const normalize = (path: string) => path.replace(/\/+$/, "");

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, _, next) => {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  if (to.meta.requiresAuth && !user && normalize(to.path) !== "/login") {
    next("/login");
  } else if (!to.meta.requiresAuth && user && normalize(to.path) === "/login") {
    next("/dashboard");
  } else {
    next();
  }
});

<template>
  <header
    class="fixed top-0 left-0 z-[10] shadow-[0_2px_10px_0_rgba(0,0,0,.1)] w-full bg-white"
  >
    <div class="flex justify-between items-center p-4">
      <Button
        class="bg-transparent! border-none!"
        aria-label="Menu"
        @click="drawer = !drawer"
      >
        <template #icon>
          <i class="pi pi-bars text-black text-2xl! md:text-3xl!"></i>
        </template>
      </Button>

      <router-link to="/" v-if="storeSettings.logoUrl">
        <Image
          :src="storeSettings.logoUrl"
          :alt="storeSettings.settings.storeName"
          width="150"
        />
      </router-link>

      <OverlayBadge :value="storeCart.cart.length">
        <router-link to="/cart" @click="drawer = false">
          <Button
            class="bg-transparent! border-none! p-0!"
            aria-label="Cart"
            v-tooltip="'السلة'"
          >
            <template #icon>
              <i
                class="pi pi-shopping-cart text-black text-2xl! md:text-3xl!"
              ></i>
            </template>
          </Button>
        </router-link>
      </OverlayBadge>
    </div>
    <div class="bg-black text-white p-4 text-center">
      <h2 class="text-md md:text-lg font-bold">
        🔥 الكمية محدودة سارعوا في الطلب الآن 🔥
      </h2>
    </div>

    <Drawer
      v-model:visible="drawer"
      position="left"
      :show-close-icon="true"
      class="w-[250px]! md:w-[25vw]!"
    >
      <ul class="flex flex-col gap-4">
        <li v-for="link in links" :key="link.name" class="text-lg">
          <router-link
            active-class="bg-gray-200 rounded-sm"
            class="px-2 w-full block"
            :to="link.to"
            @click="drawer = false"
            >{{ link.name }}</router-link
          >
        </li>
      </ul>
    </Drawer>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useCartStore } from "@/store/cart";
import { useSettingsStore } from "@/store/settings";

interface Link {
  name: string;
  to: string;
}

export default defineComponent({
  name: "FrontendHeader",

  data() {
    return {
      drawer: false as boolean,

      links: [
        {
          name: "الرئيسية",
          to: "/",
        },
        {
          name: "المنتجات",
          to: "/products",
        },
      ] as Link[],
    };
  },

  setup() {
    const storeCart = useCartStore();
    const storeSettings = useSettingsStore();

    return {
      storeCart,
      storeSettings,
    };
  },
});
</script>

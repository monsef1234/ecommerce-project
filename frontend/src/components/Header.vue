<template>
  <header
    class="p-4 fixed top-0 left-0 z-[1102] shadow-[0_2px_10px_0_rgba(0,0,0,.1)] w-full bg-white flex justify-between items-center"
  >
    <Button
      class="bg-transparent! border-none!"
      aria-label="Menu"
      @click="drawer = !drawer"
    >
      <template #icon>
        <i class="pi pi-bars text-black text-2xl!" v-if="!drawer"></i>
        <i class="pi pi-times text-black text-2xl!" v-else></i>
      </template>
    </Button>

    <router-link to="/">
      <Image :src="logo" alt="Logo" width="120" />
    </router-link>

    <router-link to="/cart" @click="drawer = false">
      <Button class="bg-transparent! border-none!" aria-label="Cart">
        <template #icon>
          <i class="pi pi-shopping-cart text-black text-2xl!"></i>
        </template>
      </Button>
    </router-link>

    <Drawer
      v-model:visible="drawer"
      position="left"
      :show-close-icon="false"
      class="mt-40 w-[250px]! md:w-[25vw]!"
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

import logo from "@/assets/images/logo.avif";

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
          name: "Home",
          to: "/",
        },
        {
          name: "Products",
          to: "/products",
        },
      ] as Link[],
    };
  },

  setup() {
    return {
      logo,
    };
  },
});
</script>

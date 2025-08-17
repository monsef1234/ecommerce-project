<template>
  <div>
    <header class="fixed top-0 left-0 w-full z-[10]">
      <div class="flex justify-between items-center p-4">
        <router-link to="/dashboard">
          <Image :src="logo" alt="Logo" width="100" />
        </router-link>

        <div>
          <Button icon="pi pi-user" variant="text" size="normal" />
          <Button
            icon="pi pi-bars"
            variant="text"
            size="normal"
            class="sm:hidden!"
            @click="drawer = !drawer"
          />
        </div>
      </div>
    </header>

    <Drawer
      v-model:visible="drawer"
      position="left"
      :show-close-icon="true"
      class="w-[250px]! md:w-[25vw]!"
    >
      <div class="flex flex-col h-full">
        <div class="overflow-y-auto">
          <ul class="list-none p-0 m-0 overflow-hidden">
            <li li v-for="link in links" :key="link.name">
              <a
                class="flex items-center cursor-pointer py-4 px-2 rounded"
                v-ripple
                v-styleclass="{
                  selector: '@next',
                  enterFromClass: 'hidden',
                  enterActiveClass: 'animate-slidedown',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'animate-slideup',
                }"
              >
                <router-link
                  :to="link.to"
                  active-class="text-green-500"
                  v-if="!link.items"
                  @click="drawer = false"
                >
                  <i :class="link.icon" class="mr-2"></i>
                  <span class="font-medium">{{ link.name }}</span>
                </router-link>
                <div v-if="link.items">
                  <i :class="link.icon" class="mr-2"></i>
                  <span class="font-medium">{{ link.name }}</span>
                </div>
                <i class="pi pi-chevron-down ml-auto" v-if="link.items"></i>
              </a>
              <ul
                class="list-none py-0 pl-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out"
                v-if="link.items"
              >
                <li v-for="item in link.items" :key="item.name">
                  <router-link
                    :to="item.to"
                    active-class="text-green-500"
                    class="flex items-center cursor-pointer p-4 rounded"
                    @click="drawer = false"
                  >
                    <i :class="item.icon" class="mr-2"></i>
                    <span class="font-medium">{{ item.name }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="mt-auto">
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            class="w-full"
            severity="danger"
            variant="outlined"
          ></Button>
        </div>
      </div>
    </Drawer>

    <aside
      class="border-r border-gray-200 fixed h-[calc(100vh-5rem)] hidden sm:block w-64 overflow-y-auto left-0 top-0 mt-20"
    >
      <div class="flex flex-col h-full">
        <div class="overflow-y-auto">
          <ul class="list-none p-0 m-0 overflow-hidden">
            <li v-for="link in links" :key="link.name">
              <a
                class="flex items-center cursor-pointer p-4 rounded"
                v-ripple
                v-styleclass="{
                  selector: '@next',
                  enterFromClass: 'hidden',
                  enterActiveClass: 'animate-slidedown',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'animate-slideup',
                }"
              >
                <router-link
                  :to="link.to"
                  active-class="text-green-500"
                  v-if="!link.items"
                >
                  <i :class="link.icon" class="mr-2"></i>
                  <span class="font-medium">{{ link.name }}</span>
                </router-link>
                <div v-if="link.items">
                  <i :class="link.icon" class="mr-2"></i>
                  <span class="font-medium">{{ link.name }}</span>
                </div>
                <i class="pi pi-chevron-down ml-auto" v-if="link.items"></i>
              </a>
              <ul
                class="list-none py-0 pl-4 pr-0 m-0 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out"
                v-if="link.items"
              >
                <li v-for="item in link.items" :key="item.name">
                  <router-link
                    :to="item.to"
                    active-class="text-green-500"
                    class="flex items-center cursor-pointer p-4 rounded"
                  >
                    <i :class="item.icon" class="mr-2"></i>
                    <span class="font-medium">{{ item.name }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="mt-auto mb-4 px-4">
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            class="w-full"
            severity="danger"
            variant="outlined"
          ></Button>
        </div>
      </div>
    </aside>

    <main class="sm:ml-70 sm:mr-6 p-4 sm:p-0 mt-[6rem]">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import logo from "@/assets/images/logo.avif";

export default defineComponent({
  name: "DashboardLayout",

  data() {
    return {
      drawer: false,

      links: [
        {
          name: "Dashboard",
          icon: "pi pi-home",
          to: "/dashboard",
        },
        {
          name: "Products",
          icon: "pi pi-box",
          items: [
            {
              name: "All Products",
              to: "/dashboard/products",
              icon: "pi pi-box",
            },
            {
              name: "Add Product",
              to: "/dashboard/add-product",
              icon: "pi pi-plus",
            },
            {
              name: "Colors",
              to: "/dashboard/colors",
              icon: "pi pi-palette",
            },
          ],
        },
        {
          name: "Settings",
          icon: "pi pi-cog",
          to: "/dashboard/settings",
        },
      ],
    };
  },

  setup() {
    return {
      logo,
    };
  },
});
</script>

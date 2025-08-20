<template>
  <div>
    <!-- Header -->
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

    <!-- Drawer (mobile) -->
    <Drawer
      v-model:visible="drawer"
      position="left"
      :show-close-icon="true"
      class="w-[250px]! md:hidden!"
    >
      <nav class="flex flex-col h-full">
        <div class="overflow-y-auto">
          <ul class="list-none p-0 m-0 overflow-hidden">
            <li v-for="link in links" :key="link.name">
              <!-- menu -->
              <div
                class="flex items-center cursor-pointer py-3 px-2 rounded"
                v-if="link.items"
                v-ripple
                v-styleclass="{
                  selector: '@next',
                  enterFromClass: 'hidden',
                  enterActiveClass: 'animate-slidedown',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'animate-slideup',
                }"
              >
                <i :class="link.icon" class="mr-2 text-lg!"></i>
                <span class="font-medium text-lg">{{ link.name }}</span>
                <i class="pi pi-chevron-down ml-auto! text-lg!"></i>
              </div>
              <router-link
                v-else
                :to="link.to"
                class="flex items-center py-3 px-2 rounded"
                active-class="text-green-500"
                @click="drawer = false"
              >
                <i :class="link.icon" class="mr-2 text-lg!"></i>
                <span class="font-medium text-lg">{{ link.name }}</span>
              </router-link>

              <!-- Submenu 1-->
              <ul
                v-if="link.items"
                class="list-none py-0 pl-6 pr-0 m-0 block overflow-y-hidden transition-all duration-400 ease-in-out"
              >
                <li v-for="item in link.items" :key="item.name">
                  <div
                    class="flex items-center cursor-pointer py-3 px-2 rounded"
                    v-if="item.items"
                    v-ripple
                    v-styleclass="{
                      selector: '@next',
                      enterFromClass: 'hidden',
                      enterActiveClass: 'animate-slidedown',
                      leaveToClass: 'hidden',
                      leaveActiveClass: 'animate-slideup',
                    }"
                  >
                    <i :class="item.icon" class="mr-2 text-lg!"></i>
                    <span class="font-medium text-lg">{{ item.name }}</span>
                    <i class="pi pi-chevron-down ml-auto text-lg!"></i>
                  </div>
                  <router-link
                    v-else
                    :to="item.to"
                    class="flex items-center py-3 px-2 rounded"
                    active-class="text-green-500"
                    @click="drawer = false"
                  >
                    <i :class="item.icon" class="mr-2 text-lg!"></i>
                    <span class="font-medium text-lg">{{ item.name }}</span>
                  </router-link>

                  <!-- Submenu 2-->
                  <ul
                    v-if="item.items"
                    class="list-none py-0 pl-6 pr-0 m-0 block overflow-y-hidden transition-all duration-400 ease-in-out"
                  >
                    <li v-for="sub in item.items" :key="sub.name">
                      <router-link
                        :to="sub.to"
                        class="flex items-center cursor-pointer py-3 px-2 rounded"
                        active-class="text-green-500"
                        @click="drawer = false"
                      >
                        <i :class="sub.icon" class="mr-2 text-lg!"></i>
                        <span class="font-medium text-lg">{{ sub.name }}</span>
                      </router-link>
                    </li>
                  </ul>
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
          />
        </div>
      </nav>
    </Drawer>

    <!-- Sidebar (desktop) -->
    <aside
      class="border-r border-gray-200 fixed h-[calc(100vh-5rem)] hidden sm:block w-64 overflow-y-auto left-0 top-0 mt-20"
    >
      <nav class="flex flex-col h-full">
        <div class="overflow-y-auto">
          <ul class="list-none p-4 m-0">
            <li v-for="link in links" :key="link.name">
              <!-- menu -->
              <div
                class="flex items-center cursor-pointer py-3 px-2 rounded"
                v-if="link.items"
                v-ripple
                v-styleclass="{
                  selector: '@next',
                  enterFromClass: 'hidden',
                  enterActiveClass: 'animate-slidedown',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'animate-slideup',
                }"
              >
                <i :class="link.icon" class="mr-2 text-lg!"></i>
                <span class="font-medium text-lg">{{ link.name }}</span>
                <i class="pi pi-chevron-down ml-auto! text-lg!"></i>
              </div>
              <router-link
                v-else
                :to="link.to"
                class="flex items-center py-3 px-2 rounded"
                active-class="text-green-500"
              >
                <i :class="link.icon" class="mr-2 text-lg!"></i>
                <span class="font-medium text-lg">{{ link.name }}</span>
              </router-link>

              <!-- Submenu 1-->
              <ul
                v-if="link.items"
                class="list-none py-0 pl-6 pr-0 m-0 block overflow-y-hidden transition-all duration-400 ease-in-out"
              >
                <li v-for="item in link.items" :key="item.name">
                  <div
                    class="flex items-center cursor-pointer py-3 px-2 rounded"
                    v-if="item.items"
                    v-ripple
                    v-styleclass="{
                      selector: '@next',
                      enterFromClass: 'hidden',
                      enterActiveClass: 'animate-slidedown',
                      leaveToClass: 'hidden',
                      leaveActiveClass: 'animate-slideup',
                    }"
                  >
                    <i router-link:class="item.icon" class="mr-2 text-lg!"></i>
                    <span class="font-medium text-lg">{{ item.name }}</span>
                    <i
                      class="pi pi-chevron-down ml-auto text-lg!"
                      v-if="item.items"
                    ></i>
                  </div>
                  <router-link
                    v-else
                    :to="item.to"
                    class="flex items-center py-3 px-2 rounded"
                    active-class="text-green-500"
                  >
                    <i :class="item.icon" class="mr-2 text-lg!"></i>
                    <span class="font-medium text-lg">{{ item.name }}</span>
                  </router-link>

                  <!-- Submenu 2-->
                  <ul
                    v-if="item.items"
                    class="list-none py-0 pl-6 pr-0 m-0 block overflow-y-hidden transition-all duration-400 ease-in-out"
                  >
                    <li v-for="sub in item.items" :key="sub.name">
                      <router-link
                        :to="sub.to"
                        class="flex items-center cursor-pointer py-3 px-2 rounded"
                        active-class="text-green-500"
                      >
                        <i :class="sub.icon" class="mr-2 text-lg!"></i>
                        <span class="font-medium text-lg">{{ sub.name }}</span>
                      </router-link>
                    </li>
                  </ul>
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
          />
        </div>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="sm:ml-70 sm:mr-6 p-4 sm:p-0 mt-[6rem]">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import logo from "@/assets/images/logo.avif";

type NavItem = {
  name: string;
  icon: string;
  to: string;
  items?: NavItem[];
};

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
              icon: "pi pi-palette",
              items: [
                {
                  name: "All Colors",
                  to: "/dashboard/colors",
                  icon: "pi pi-palette",
                },
                {
                  name: "Add Color",
                  to: "/dashboard/colors/add-color",
                  icon: "pi pi-plus",
                },
              ],
            },
          ],
        },
        {
          name: "Settings",
          icon: "pi pi-cog",
          to: "/dashboard/settings",
        },
      ] as NavItem[],
    };
  },
  setup() {
    return { logo };
  },
});
</script>

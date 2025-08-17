<template>
  <div>
    <header class="fixed top-0 left-0 w-full z-[10]">
      <div class="flex justify-between items-center p-4">
        <router-link to="/admin/dashboard">
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
          <ul class="list-none m-0">
            <li>
              <ul class="list-none p-0 m-0 overflow-hidden">
                <li>
                  <a class="flex items-center cursor-pointer py-4 px-2 rounded">
                    <router-link
                      to="/admin/dashboard"
                      active-class="text-green-500"
                    >
                      <i class="pi pi-home mr-2"></i>
                      <span class="font-medium">Dashboard</span>
                    </router-link>
                  </a>
                </li>

                <li>
                  <a class="flex items-center cursor-pointer py-4 px-2 rounded">
                    <router-link
                      to="/admin/settings"
                      active-class="text-green-500"
                    >
                      <i class="pi pi-cog mr-2"></i>
                      <span class="font-medium">Settings</span>
                    </router-link>
                  </a>
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
          <ul class="list-none m-0">
            <li>
              <ul class="list-none p-0 m-0 overflow-hidden">
                <li>
                  <a class="flex items-center cursor-pointer p-4 rounded">
                    <router-link
                      to="/admin/dashboard"
                      active-class="text-green-500"
                    >
                      <i class="pi pi-home mr-2"></i>
                      <span class="font-medium">Dashboard</span>
                    </router-link>
                  </a>
                </li>

                <li>
                  <a class="flex items-center cursor-pointer p-4 rounded">
                    <router-link
                      to="/admin/settings"
                      active-class="text-green-500"
                    >
                      <i class="pi pi-cog mr-2"></i>
                      <span class="font-medium">Settings</span>
                    </router-link>
                  </a>
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
    };
  },

  setup() {
    return {
      logo,
    };
  },
});
</script>

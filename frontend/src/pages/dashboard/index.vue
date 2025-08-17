<template>
  <div>
    <h3 class="text-xl font-bold mb-4">Statistics</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div class="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Orders</h3>
          <i class="pi pi-shopping-cart text-xl! text-gray-500!"></i>
        </div>
        <p class="text-lg">{{ orders.length }}</p>
      </div>

      <div class="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Delivered</h3>
          <i class="pi pi-check text-xl! text-green-500!"></i>
        </div>
        <p class="text-lg">{{ deliveredOrders.length }}</p>
      </div>

      <div class="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Not Delivered</h3>
          <i class="pi pi-times text-xl! text-red-500!"></i>
        </div>
        <p class="text-lg t">{{ notDeliveredOrders.length }}</p>
      </div>

      <div class="flex flex-col gap-1 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Revenue</h3>
          <i class="pi pi-tag text-xl! text-gray-500!"></i>
        </div>
        <p class="text-lg">{{ currencyFormat(revenue) }}</p>
      </div>
    </div>

    <h3 class="text-xl font-bold mt-6 mb-4">Orders</h3>

    <DataTable
      :value="orders"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      tableStyle="min-width: 50rem"
    >
      <Column field="img" header="Image">
        <template #body="slotProps">
          <img
            :src="slotProps.data.img"
            :alt="slotProps.data.img"
            class="shadow-lg"
            width="80"
          />
        </template>
      </Column>
      <Column field="name" header="Name">
        <template #body="slotProps">
          {{ slotProps.data.name }}
        </template>
      </Column>
      <Column field="phone" header="Phone">
        <template #body="slotProps">
          {{ slotProps.data.phone }}
        </template>
      </Column>
      <Column field="quantity" header="Quantity" sortable>
        <template #body="slotProps">
          {{ slotProps.data.quantity }}
        </template>
      </Column>
      <Column field="price" header="Price" sortable>
        <template #body="slotProps">
          <span class="font-bold">{{
            currencyFormat(slotProps.data.price)
          }}</span>
        </template>
      </Column>
      <Column field="status" header="Status" sortable>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.delivered ? 'Delivered' : 'Not Delivered'"
            :severity="slotProps.data.delivered ? 'success' : 'danger'"
          />
        </template>
      </Column>
      <Column field="created_at" header="Created At" sortable>
        <template #body="slotProps">
          {{ format(slotProps.data.created_at, "dd/MM/yyyy, HH:mm") }}
        </template>
      </Column>
      <Column field="actions" header="Actions">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            class="p-button-danger"
            aria-label="Delete"
            variant="text"
            @click="deleteOrder(slotProps.data)"
          />
          <Button
            v-if="!slotProps.data.delivered"
            icon="pi pi-check"
            class="p-button-success"
            aria-label="Delivered"
            variant="text"
            @click="deliveredOrder(slotProps.data)"
          />
          <Button
            v-else
            icon="pi pi-times"
            class="p-button-danger"
            aria-label="Not Delivered"
            variant="text"
            @click="notDeliveredOrder(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>

    <Toast position="bottom-center" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { format } from "date-fns";

import { currencyFormat } from "@/utilities/currencyFormat";

interface Order {
  img: string;
  name: string;
  phone: string;
  quantity: number;
  price: number;
  status: "Delivered" | "Not Delivered";
  delivered: boolean;
  created_at: string;
}

export default defineComponent({
  name: "Dashboard",

  data() {
    return {
      isCollapsed: false,

      orders: [
        {
          img: "https://imgs.search.brave.com/_6izdbSVpHbwqbawMBquENAqLf6WtvwCZmTG8AhitpY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
          name: "Product 1",
          phone: "0123456789",
          quantity: 10,
          price: 100,
          status: "Delivered",
          delivered: true,
          created_at: "2025-08-17T17:59:00.000Z",
        },

        {
          img: "https://imgs.search.brave.com/_6izdbSVpHbwqbawMBquENAqLf6WtvwCZmTG8AhitpY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
          name: "Product 2",
          phone: "0123456789",
          quantity: 10,
          status: "Not Delivered",
          delivered: false,
          price: 150,
          created_at: "2025-08-17T17:56:00.000Z",
        },
        {
          img: "https://imgs.search.brave.com/_6izdbSVpHbwqbawMBquENAqLf6WtvwCZmTG8AhitpY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
          name: "Product 3",
          phone: "0123456789",
          quantity: 10,
          status: "Not Delivered",
          delivered: false,
          price: 200,
          created_at: "2025-08-17T17:56:00.000Z",
        },
        {
          img: "https://imgs.search.brave.com/_6izdbSVpHbwqbawMBquENAqLf6WtvwCZmTG8AhitpY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
          name: "Product 4",
          phone: "0123456789",
          quantity: 10,
          status: "Not Delivered",
          delivered: false,
          price: 250,
          created_at: "2025-08-17T17:56:00.000Z",
        },
        {
          img: "https://imgs.search.brave.com/_6izdbSVpHbwqbawMBquENAqLf6WtvwCZmTG8AhitpY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/cGhvdG9ncmFwaHkv/Y2hhbmdlLWxvY2F0/aW9uLndlYnA",
          name: "Product 5",
          phone: "0123456789",
          quantity: 10,
          status: "Not Delivered",
          delivered: false,
          price: 300,
          created_at: "2025-08-17T17:56:00.000Z",
        },
      ] as Order[],
    };
  },

  methods: {
    deleteOrder(order: Order) {
      this.orders = this.orders.filter((p) => p !== order);
      this.$toast.add({
        severity: "success",
        summary: "Order Deleted",
        detail: "Order deleted successfully",
        life: 3000,
      });
    },

    deliveredOrder(order: Order) {
      this.orders = this.orders.map((p) =>
        p === order ? { ...p, delivered: true } : p
      );
      this.$toast.add({
        severity: "success",
        summary: "Order Delivered",
        detail: "Order delivered successfully",
        life: 3000,
      });
    },

    notDeliveredOrder(order: Order) {
      this.orders = this.orders.map((p) =>
        p === order ? { ...p, delivered: false } : p
      );
      this.$toast.add({
        severity: "success",
        summary: "Order Not Delivered",
        detail: "Order not delivered successfully",
        life: 3000,
      });
    },
  },

  computed: {
    deliveredOrders() {
      return this.orders.filter((order) => order.delivered);
    },

    notDeliveredOrders() {
      return this.orders.filter((order) => !order.delivered);
    },

    revenue() {
      return this.orders.reduce((total, order) => total + order.price, 0);
    },
  },

  setup() {
    return {
      currencyFormat,
      format,
    };
  },
});
</script>

<route lang="yaml">
meta:
  layout: "dashboard"
</route>

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
      @row-click="onRowClick"
      :rowClass="() => 'cursor-pointer'"
    >
      <Column field="fullname" header="Fullname">
        <template #body="slotProps">
          {{ slotProps.data.fullname }}
        </template>
      </Column>
      <Column field="phone" header="Phone">
        <template #body="slotProps">
          {{ slotProps.data.phone }}
        </template>
      </Column>
      <Column field="address" header="Address" sortable>
        <template #body="slotProps">
          {{ slotProps.data.address }}
        </template>
      </Column>
      <Column field="total" header="Total" sortable>
        <template #body="slotProps">
          <span class="font-bold">{{
            currencyFormat(Number(slotProps.data.total))
          }}</span>
        </template>
      </Column>
      <Column field="status" header="Status" sortable>
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.status"
            :severity="
              slotProps.data.status === 'Delivered' ? 'success' : 'danger'
            "
          />
        </template>
      </Column>
      <Column field="createdAt" header="Created At" sortable>
        <template #body="slotProps">
          {{ format(slotProps.data.createdAt, "dd/MM/yyyy, HH:mm") }}
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
            v-if="slotProps.data.status !== 'Delivered'"
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

    <Dialog
      v-model:visible="visible"
      :modal="true"
      :closable="false"
      :dismissableMask="true"
    >
      <p>{{ order?.fullname }}</p>
      <p>{{ order?.phone }}</p>
      <p>{{ order?.address }}</p>
      <p>{{ order?.status }}</p>
      <p>{{ order?.state?.state }}</p>
      <p>{{ order?.delivery }}</p>
      <p>{{ order?.total }}</p>
      <p>{{ order?.products }}</p>
      <p>{{ order?.createdAt }}</p>
    </Dialog>

    <Toast position="bottom-center" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { format } from "date-fns";

import { currencyFormat } from "@/utilities/currencyFormat";
import type { DataTableRowClickEvent } from "primevue";
import type { Color } from "@/types/color";
import type { Product } from "@/types/Product";

interface Order {
  fullname: string;
  phone: string;
  address: string;
  status: string;
  state: {
    id: string;
    state: string;
    home: string;
    point: string;
  };
  delivery: "home" | "point";
  total: number;
  products: {
    quantity: number;
    price: number;
    productId: string;
    title: string;
    colorId: string;
    color: Color;
    product: Product;
  }[];
  createdAt?: string;
}

export default defineComponent({
  name: "Dashboard",

  data() {
    return {
      isCollapsed: false,

      visible: false,

      order: {} as Order,

      orders: [
        {
          fullname: "Johsdsdn Doe",
          phone: "0123456789",
          address: "123 Main St",
          status: "Delivered",
          state: {
            id: "1",
            state: "Main",
            home: "123 Main St",
            point: "123 Main St",
          },
          delivery: "home",
          total: 100,
          products: [
            {
              quantity: 10,
              price: 100,
              productId: "1",
              title: "Product 1",
              colorId: "1",
            },
          ],
          createdAt: "2022-01-01T00:00:00.000Z",
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

    onRowClick(event: DataTableRowClickEvent<Order>) {
      this.visible = true;
      this.order = event.data;
    },
  },

  computed: {
    deliveredOrders() {
      return this.orders.filter((order) => order.status === "Delivered");
    },

    notDeliveredOrders() {
      return this.orders.filter((order) => order.status !== "Delivered");
    },

    revenue() {
      return this.orders.reduce((total, order) => total + order.total, 0);
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
  requiresAuth: true
</route>

<template>
  <div>
    <h3 class="text-xl font-bold mb-4">Statistics</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div class="flex flex-col justify-between p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Orders</h3>
          <i class="pi pi-shopping-cart text-xl! text-gray-500!"></i>
        </div>
        <p class="text-lg" v-if="!loading">
          {{ ordersCount }}
        </p>
        <Skeleton v-else shape="rectangle" class="w-full! h-4!" />
      </div>

      <div class="flex flex-col justify-between p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Delivered</h3>
          <i class="pi pi-check text-xl! text-green-500!"></i>
        </div>
        <p class="text-lg" v-if="!loading">{{ deliveredOrdersCount }}</p>
        <Skeleton v-else shape="rectangle" class="w-full! h-4!" />
      </div>

      <div class="flex flex-col justify-between p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Not Delivered</h3>
          <i class="pi pi-times text-xl! text-red-500!"></i>
        </div>
        <p class="text-lg" v-if="!loading">{{ notDeliveredOrdersCount }}</p>
        <Skeleton v-else shape="rectangle" class="w-full! h-4!" />
      </div>

      <div class="flex flex-col justify-between p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-2 justify-between">
          <h3 class="text-lg text-gray-500">Revenue</h3>
          <i class="pi pi-tag text-xl! text-gray-500!"></i>
        </div>
        <p class="text-lg" v-if="!loading">{{ currencyFormat(totalPrice) }}</p>
        <Skeleton v-else shape="rectangle" class="w-full! h-4!" />
      </div>
    </div>

    <h3 class="text-xl font-bold mt-6 mb-4">Orders</h3>

    <DataTable
      :value="orders"
      tableStyle="min-width: 50rem"
      class="relative!"
      :loading="loading || tableLoading"
      @row-click="onRowClick"
      :rowClass="() => 'cursor-pointer'"
    >
      <template #loading>
        <ProgressBar
          mode="indeterminate"
          style="height: 5px !important"
          class="w-full! absolute! top-0! left-0!"
        ></ProgressBar>
      </template>

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
      <Column field="state" header="State" sortable>
        <template #body="slotProps">
          {{ slotProps.data.state.state }}
        </template>
      </Column>
      <Column field="address" header="Address" sortable>
        <template #body="slotProps">
          {{ slotProps.data.address }}
        </template>
      </Column>
      <Column field="delivery" header="Delivery" sortable>
        <template #body="slotProps">
          {{ slotProps.data.delivery }}
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
            :value="statusFormat(slotProps.data.status)"
            class="text-sm! text-center!"
            :severity="
              slotProps.data.status === 'delivered' ? 'success' : 'danger'
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
            v-if="slotProps.data.status !== 'delivered'"
            icon="pi pi-check"
            class="p-button-success"
            aria-label="Delivered"
            variant="text"
            @click="deliveredOrder(slotProps.data.id)"
          />
          <Button
            v-else
            icon="pi pi-times"
            class="p-button-danger"
            aria-label="Not Delivered"
            variant="text"
            @click="notDeliveredOrder(slotProps.data.id)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-danger"
            aria-label="Delete"
            variant="text"
            @click="confirmDeleteOrder(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
    <Paginator
      class="mb-6!"
      :rows="limit"
      :totalRecords="ordersCount"
      :rowsPerPageOptions="[5, 10, 15, 20]"
      @page="onPageChange"
    ></Paginator>

    <Dialog
      v-model:visible="visible"
      :modal="true"
      :closable="false"
      :dismissableMask="true"
      class="w-full!"
    >
      <DataTable :value="order.products" responsiveLayout="scroll">
        <Column field="product.title" header="Product"></Column>
        <Column field="color.name" header="Color"></Column>
        <Column field="quantity" header="Quantity"></Column>

        <Column field="price" header="Price">
          <template #body="slotProps">
            {{ currencyFormat(slotProps.data.price) }}
          </template>
        </Column>
        <Column field="total" header="Total">
          <template #body="slotProps">
            {{ currencyFormat(slotProps.data.price * slotProps.data.quantity) }}
          </template>
        </Column>
      </DataTable>
    </Dialog>
    <ConfirmDialog></ConfirmDialog>

    <Toast position="bottom-center" dir="rtl" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { format } from "date-fns";

import { currencyFormat } from "@/utilities/currencyFormat";
import type { DataTableRowClickEvent, PageState } from "primevue";
import type { Color } from "@/types/color";
import type { Product } from "@/types/Product";
import { useConfirm } from "primevue/useconfirm";
import axios from "axios";

interface Order {
  id: number;
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
      loading: false,
      tableLoading: false,

      order: {} as Order,

      orders: [] as Order[],

      skip: 0,
      limit: 10,

      ordersCount: 0,
      deliveredOrdersCount: 0,
      notDeliveredOrdersCount: 0,
      totalPrice: 0,
    };
  },

  methods: {
    async deleteOrder(id: number) {
      console.log(id);

      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}orders/${id}`);
        console.log("done");

        this.ordersCount--;
        this.totalPrice -= this.orders.find((p) => p.id === id)?.total || 0;
        this.deliveredOrdersCount -=
          this.orders.find((p) => p.id === id)?.status === "delivered" ? 1 : 0;
        this.notDeliveredOrdersCount -=
          this.orders.find((p) => p.id === id)?.status === "not_delivered"
            ? 1
            : 0;

        this.orders = this.orders.filter((p) => p.id !== id);

        this.$toast.add({
          severity: "success",
          summary: "تم حذف الطلب",
          detail: "تم حذف الطلب بنجاح",
          life: 3000,
        });
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    confirmDeleteOrder(id: number) {
      this.confirm.require({
        message: "هل أنت متأكد من حذف الطلب؟",
        header: "تأكيد الحذف",
        icon: "pi pi-exclamation-triangle",
        rejectProps: {
          label: "إلغاء",
          severity: "secondary",
          outlined: true,
        },
        acceptProps: {
          label: "حذف",
          severity: "danger",
        },
        accept: () => this.deleteOrder(id),
      });
    },

    async deliveredOrder(id: number) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}orders/${id}`, {
          status: "delivered",
          id,
        });

        this.orders = this.orders.map((p) =>
          p.id === id ? { ...p, status: "delivered" } : p
        );

        this.$toast.add({
          severity: "success",
          summary: "تم تسليم الطلب",
          detail: "تم تسليم الطلب بنجاح",
          life: 3000,
        });

        this.deliveredOrdersCount++;
        this.notDeliveredOrdersCount--;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async notDeliveredOrder(id: number) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}orders/${id}`, {
          status: "not_delivered",
          id,
        });

        this.orders = this.orders.map((p) =>
          p.id === id ? { ...p, status: "not_delivered" } : p
        );

        this.$toast.add({
          severity: "success",
          summary: "تم عدم تسليم الطلب",
          detail: "تم عدم تسليم الطلب بنجاح",
          life: 3000,
        });

        this.deliveredOrdersCount--;
        this.notDeliveredOrdersCount++;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    onRowClick(event: DataTableRowClickEvent<Order>) {
      this.visible = true;
      this.order = event.data;
    },

    async getAllOrders() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}orders?skip=${this.skip}&limit=${
            this.limit
          }`
        );
        this.orders = response.data.orders;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async getNotDeliveredOrdersCount() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}orders/not-delivered-count`
        );
        this.notDeliveredOrdersCount = response.data.count;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async getAllOrdersPriceTotal() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}orders/total-price`
        );
        this.totalPrice = response.data.total;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async getAllOrdersCount() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}orders/count`
        );
        this.ordersCount = response.data.count;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async getDeliveredOrdersCount() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}orders/delivered-count`
        );
        this.deliveredOrdersCount = response.data.count;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async onPageChange(event: PageState) {
      this.skip = event.first;
      this.limit = event.rows;

      this.tableLoading = true;
      await this.getAllOrders();
      this.tableLoading = false;
    },
  },

  computed: {
    statusFormat() {
      return (status: string) => {
        if (status === "delivered") return "Delivered";
        return "Not Delivered";
      };
    },
  },

  setup() {
    const confirm = useConfirm();
    return {
      currencyFormat,
      format,
      confirm,
    };
  },

  async mounted() {
    this.loading = true;
    await this.getDeliveredOrdersCount();
    await this.getNotDeliveredOrdersCount();
    await this.getAllOrdersPriceTotal();
    await this.getAllOrdersCount();
    await this.getAllOrders();
    this.loading = false;
  },
});
</script>

<route lang="yaml">
meta:
  layout: "dashboard"
  requiresAuth: true
</route>

<template>
  <div class="container">
    <h1 class="text-2xl text-center font-bold">احدث المنتوجات</h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 mb-6"
      v-if="!loading && products.length"
    >
      <Product
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <div v-if="!loading && !products.length">
      <p class="text-center text-lg font-bold my-6">لا يوجد منتجات</p>
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 mb-6"
      v-if="loading"
    >
      <div class="flex flex-col gap-4" v-for="i in 4" :key="i">
        <Skeleton shape="rectangle" class="h-72! w-full!" />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
    <Button
      label="عرض الجميع"
      icon="pi pi-arrow-left"
      @click="$router.push('/products')"
      v-if="!loading && products.length"
      variant="outlined"
      class="flex! mx-auto! mb-10 hover:bg-black! hover:text-white!"
    />

    <div>
      <h1 class="text-2xl text-center font-bold">الاسئلة الشائعة</h1>

      <Accordion value="0" class="my-10">
        <AccordionPanel v-for="tab in tabs" :key="tab.title" :value="tab.value">
          <AccordionHeader>{{ tab.title }}</AccordionHeader>
          <AccordionContent>
            <p class="m-0">{{ tab.content }}</p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Product from "@/components/Product.vue";
import { useProductStore } from "@/store/product";
import axios from "axios";
import type { Product as ProductType } from "@/types/Product";

export default defineComponent({
  name: "Home",

  data() {
    return {
      tabs: [
        {
          value: "0",
          title: "الشحن والإرجاع",
          content:
            "بعد استلام طلبك، يُسمح لك بفتح المنتج والتحقق منه. إذا كان هناك أي مشكلة، يجب عليك إعادته إلى موظف التوصيل فورًا. ملاحظة: لا يُسمح لك بأخذ الطلب بعيدًا عن موظف التوصيل قبل دفع المبلغ. إذا كان هناك أي مشكلة في الحجم أو إذا كان المنتج به أي عيب، اتصل بنا وسنجري لك تبادلًا حيث سيأتي موظف التوصيل إليك ويوصل لك الطلب الجديد ويأخذ المنتج التالف. ملاحظة: إذا كان الخطأ من فريقنا أو كان المنتج به عيب، فسيكون شحن التبادل مجانيًا. ملاحظة: إذا أصر العميل على حجم معين وكان لا يتناسب مع مقاسه، فيتم دفع تكلفة الشحن من قبل العميل.",
        },
      ],

      products: [] as ProductType[],

      loading: false,
    };
  },

  methods: {
    async getLastProducts() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}products/last`
        );

        this.products = response.data.products;
        console.log(response.data.products);
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },

  setup() {
    const storeProduct = useProductStore();
    return {
      storeProduct,
    };
  },

  mounted() {
    this.getLastProducts();
  },
});
</script>

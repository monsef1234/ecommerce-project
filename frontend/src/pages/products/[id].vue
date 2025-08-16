<template>
  <div class="container">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <div class="col-span-2">
        <Galleria
          :value="product.images"
          :responsiveOptions="responsiveOptions"
          class="w-full"
        >
          <template #item="slotProps">
            <Image :src="slotProps.item.url" :alt="slotProps.item.alt" />
          </template>
          <template #thumbnail="slotProps">
            <Image
              :src="slotProps.item.url"
              :alt="slotProps.item.alt"
              class="md:w-[150px] thumbnail-item"
            />
          </template>
        </Galleria>
      </div>

      <div>
        <h1 class="text-3xl font-bold mb-6 break-words">
          {{ product?.title }}
        </h1>
        <p class="text-2xl font-bold mb-6" v-if="!product.hasDiscount">
          {{ currencyFormat(product.price) }}
        </p>
        <div
          v-if="product.hasDiscount"
          class="flex items-center gap-4 flex-wrap mb-6"
        >
          <p class="text-2xl font-bold line-through text-gray-500">
            {{ currencyFormat(product.price) }}
          </p>
          <p class="text-2xl font-bold text-green-500">
            {{ currencyFormat(product.discountPrice!) }}
          </p>
        </div>
        <div class="flex items-center gap-4 flex-wrap mb-6">
          <div v-for="color in product.colors" :key="color.id">
            <RadioButton
              v-model="selectedColor"
              :inputId="'radio' + color.id.toString()"
              name="colors"
              :value="color.id"
              class="hidden!"
            />

            <label
              :for="'radio' + color.id.toString()"
              class="w-10 h-10 block"
              :class="{ 'checked-label': selectedColor === color.id }"
            >
              <span
                class="w-full h-full rounded-full not:first:ml-2 block cursor-pointer p-2"
                :style="{ backgroundColor: color.code }"
              ></span>
            </label>
          </div>
        </div>
        <p class="whitespace-pre-wrap text-lg mb-6" dir="rtl">
          {{ product?.description }}
        </p>

        <Form
          dir="rtl"
          v-slot="$form"
          :initialValues
          :resolver="resolver"
          @submit="onFormSubmit"
          class="flex flex-col gap-4 w-full!"
        >
          <div
            class="flex flex-col gap-6 bg-gray-50! p-6! rounded-lg! shadow-md!"
          >
            <div class="flex flex-col gap-1">
              <FloatLabel variant="in">
                <InputText
                  name="fullname"
                  type="text"
                  label="الاسم الكامل"
                  fluid
                  size="large"
                  id="fullname"
                  class="text-lg"
                />
                <label for="fullname" class="text-lg">الاسم الكامل</label>
              </FloatLabel>

              <Message
                v-if="$form.fullname?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.fullname.error.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1">
              <FloatLabel variant="in">
                <InputText
                  name="phone"
                  type="text"
                  label="رقم الهاتف"
                  fluid
                  size="large"
                  id="phone"
                  class="text-lg"
                />
                <label for="phone" class="text-lg">رقم الهاتف</label>
              </FloatLabel>

              <Message
                v-if="$form.phone?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.phone.error.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1">
              <FloatLabel variant="in">
                <InputText
                  name="address"
                  type="text"
                  label="العنوان"
                  fluid
                  size="large"
                  id="address"
                  class="text-lg"
                />
                <label for="address" class="text-lg">العنوان</label>
              </FloatLabel>
              <Message
                v-if="$form.address?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.address.error.message }}</Message
              >
            </div>

            <div class="flex flex-col gap-1">
              <Select
                name="state"
                :options="zrExpress"
                fluid
                optionLabel="wilaya"
                size="large"
                placeholder="الولاية"
              />
              <Message
                v-if="$form.state?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.state.error.message }}</Message
              >
            </div>

            <div class="flex flex-col gap-1">
              <InputNumber
                name="quantity"
                showButtons
                buttonLayout="horizontal"
                size="large"
                :allowEmpty="false"
                inputClass="text-center w-full text-xl!"
                :min="1"
                :max="99"
              >
                <template #incrementicon>
                  <span class="pi pi-plus" />
                </template>
                <template #decrementicon>
                  <span class="pi pi-minus" />
                </template>
              </InputNumber>
              <Message
                v-if="$form.quantity?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.quantity.error.message }}</Message
              >
            </div>
          </div>

          <div
            v-if="$form.state?.value"
            class="bg-gray-50! p-6! rounded-lg! shadow-md!"
          >
            <h3 class="flex items-center gap-2 text-lg font-bold mb-4">
              <i class="pi pi-truck text-xl!"></i>
              التوصيل
            </h3>

            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <RadioButton
                    v-model="delivery"
                    inputId="home"
                    name="delivery"
                    value="home"
                  />
                  <label for="home" class="text-lg">🏠 توصيل الى المنزل</label>
                </div>
                <span>{{ currencyFormat($form.state?.value?.home) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <RadioButton
                    v-model="delivery"
                    inputId="point"
                    name="delivery"
                    value="point"
                  />
                  <label for="point" class="text-lg"
                    >📍 توصيل الى نقطة <br class="hidden md:block" />
                    (ZR Express)</label
                  >
                </div>
                <span>{{ currencyFormat($form.state?.value?.point) }}</span>
              </div>
            </div>
          </div>

          <Button type="submit" severity="success" label="اشتري الآن" />
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useStoreProduct } from "@/store/product";
import { currencyFormat } from "@/utilities/currencyFormat";
import type { Product } from "@/types/Product";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { checkoutSchema } from "@/schemas/checkout.schema";
import { Form } from "@primevue/forms";
import zrExpress from "@/zr-express.json";

export default defineComponent({
  name: "Product",

  data() {
    return {
      product: {
        id: 0,
        title: "",
        price: 0,
        hasDiscount: false,
        discountPrice: 0,
        description: "",
        images: [],
        colors: [],
      } as Product,

      initialValues: {
        fullname: "",
        phone: "",
        address: "",
        state: null,
        quantity: 1,
      },

      quantity: 1,

      delivery: "home",

      selectedColor: 0,

      responsiveOptions: [
        {
          breakpoint: "1300px",
          numVisible: 4,
        },
        {
          breakpoint: "575px",
          numVisible: 3,
        },
        {
          breakpoint: "425px",
          numVisible: 2,
        },
      ],

      resolver: zodResolver(checkoutSchema),
    };
  },

  methods: {
    onFormSubmit(values: any) {
      console.log(values);
    },
  },

  setup() {
    const storeProduct = useStoreProduct();

    return {
      storeProduct,
      currencyFormat,
      zrExpress,
    };
  },

  mounted() {
    const id = this.$route.params.id;

    this.product = this.storeProduct.getProductById(Number(id)) ?? this.product;
    this.selectedColor = this.product.colors[0].id;
  },
});
</script>

<style scoped>
.checked-label {
  box-shadow: 0 0 0 2px;
  border-radius: 50%;
  padding: 2px;
}

@media (max-width: 1310px) {
  .thumbnail-item {
    width: 100px;
  }
}

@media (max-width: 1190px) {
  .thumbnail-item {
    width: 80px;
  }
}

@media (max-width: 990px) {
  .thumbnail-item {
    width: 60px;
  }
}

@media (max-width: 768px) {
  .thumbnail-item {
    width: 80px;
  }
}
</style>

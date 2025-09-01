<template>
  <div class="container">
    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
      v-if="!loading && product.id"
    >
      <div class="col-span-2">
        <swiper
          @swiper="setSwiper"
          :spaceBetween="10"
          :navigation="false"
          :autoplay="{
            delay: 2000,
            disableOnInteraction: false,
          }"
          :thumbs="{ swiper: thumbsSwiper }"
          :modules="modules"
          class="mb-4"
        >
          <swiper-slide v-for="image in product.images" :key="image.id">
            <Image :src="image.url" :alt="image.id.toString()" />
          </swiper-slide>
        </swiper>

        <div class="px-10 relative">
          <swiper
            @swiper="setThumbsSwiper"
            :spaceBetween="10"
            :slidesPerView="3"
            :navigation="false"
            :freeMode="true"
            :watchSlidesProgress="true"
            :modules="modules"
          >
            <swiper-slide v-for="image in product.images" :key="image.id">
              <Image :src="image.url" :alt="image.id.toString()" />
            </swiper-slide>
          </swiper>

          <Button
            icon="pi pi-chevron-left"
            class="absolute! left-0! top-1/2! -translate-y-1/2!"
            size="large"
            @click="slidePrev"
            variant="text"
          />
          <Button
            icon="pi pi-chevron-right"
            class="absolute! right-0! top-1/2! -translate-y-1/2!"
            size="large"
            @click="slideNext"
            variant="text"
          />
        </div>
      </div>

      <div>
        <h1 class="text-3xl font-bold mb-6 break-words">
          {{ product?.title }}
        </h1>
        <p class="text-2xl font-bold mb-6" v-if="!product.hasDiscount">
          {{ currencyFormat(Number(product.price)) }}
        </p>
        <div
          v-if="product.hasDiscount"
          class="flex items-center gap-4 flex-wrap mb-6"
        >
          <p class="text-xl font-bold line-through text-gray-500">
            {{ currencyFormat(Number(product.price)) }}
          </p>
          <p class="text-2xl font-bold text-green-500">
            {{ currencyFormat(Number(product.discountPrice!)) }}
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
          ref="form"
          v-slot="$form"
          :initialValues
          :resolver="resolver"
          @submit="onFormSubmit"
          class="flex flex-col gap-4 w-full!"
          v-if="product.status"
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
              <Select
                name="state"
                :options="zrExpress"
                fluid
                optionLabel="wilaya"
                size="large"
                placeholder="الولاية"
                scrollHeight="18rem"
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
                  <RadioButton inputId="home" name="delivery" value="home" />
                  <label for="home" class="text-lg">🏠 توصيل الى المنزل</label>
                </div>
                <span class="font-bold">{{
                  currencyFormat($form.state?.value?.home)
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <RadioButton inputId="point" name="delivery" value="point" />
                  <label for="point" class="text-lg"
                    >📍 توصيل الى نقطة <br class="hidden md:block" />
                    (ZR Express)</label
                  >
                </div>
                <span class="font-bold">{{
                  currencyFormat($form.state?.value?.point)
                }}</span>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-50! p-6! rounded-lg! shadow-md!"
            v-if="
              $form.state?.value &&
              $form.quantity?.value &&
              $form.delivery?.value
            "
          >
            <div class="flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-lg">
                <i class="pi pi-tag text-xl!"></i>
                سعر المنتج
              </h3>
              <span class="font-bold">
                {{
                  product.hasDiscount
                    ? currencyFormat(
                        Number(product.discountPrice!) * $form.quantity.value
                      )
                    : currencyFormat(
                        Number(product.price) * $form.quantity.value
                      )
                }}
              </span>
            </div>
            <Divider class="bg-gray-200!" />
            <div class="flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-lg">
                <i class="pi pi-truck text-xl!"></i>
                سعر التوصيل
              </h3>
              <span class="font-bold">
                {{
                  $form.delivery.value === "home"
                    ? currencyFormat($form.state?.value?.home)
                    : currencyFormat($form.state?.value?.point)
                }}
              </span>
            </div>
            <Divider class="bg-gray-200!" />
            <div class="flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-lg">
                <i class="pi pi-tag text-xl!"></i>
                إجمالي
              </h3>
              <span class="font-bold">
                {{ currencyFormat(getTotalPrice(product, $form)) }}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            severity="success"
            label="اشتري الآن"
            size="large"
            :loading="loadingSubmit"
            :disabled="loadingSubmit"
          />
          <Button
            label="اضف للسلة"
            variant="outlined"
            size="large"
            @click="addToCart(product, $form)"
            :disabled="loadingSubmit"
          />
        </Form>

        <h2 v-else class="text-2xl font-bold text-center mt-10 text-red-500">
          غير متوفر
        </h2>
      </div>
    </div>

    <div v-if="loading">
      <h2 class="text-2xl font-bold text-center">جاري التحميل...</h2>
    </div>

    <Dialog
      v-model:visible="visible"
      modal
      :closable="false"
      :style="{ width: '25rem' }"
    >
      <div class="flex flex-col gap-4 items-center">
        <Image :src="check" alt="Check" width="150" height="150" />
        <h3 class="text-2xl font-bold">تم عملية الشراء بنجاح</h3>
        <p class="text-lg">شكراً لاستخدامك متجرنا</p>
        <Button
          type="button"
          label="اغلاق"
          severity="secondary"
          @click="visible = false"
        />
      </div>
    </Dialog>

    <Toast
      position="bottom-center"
      dir="rtl"
      class="w-2xs! md:w-1/4! text-lg! md:text-xl!"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import axios from "axios";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";

import { useProductStore } from "@/store/product";
import { useCartStore } from "@/store/cart";
import { currencyFormat } from "@/utilities/currencyFormat";
import type { Product } from "@/types/Product";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import {
  checkoutSchema,
  type CheckoutSchemaType,
} from "@/schemas/checkout.schema";

import zrExpress from "@/zr-express.json";

import check from "@/assets/images/check.png";

export default defineComponent({
  name: "Product",

  components: {
    Swiper,
    SwiperSlide,
  },

  data() {
    return {
      product: {
        id: 0,
        title: "",
        price: 0,
        hasDiscount: false,
        status: true,
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
        delivery: "home" as "home" | "point",
      } as CheckoutSchemaType,

      selectedColor: 0 as number,
      thumbsSwiper: null as SwiperType | null,

      swiper: null as SwiperType | null,

      visible: false,

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
      ] as {
        breakpoint: string;
        numVisible: number;
      }[],

      loading: false,
      loadingSubmit: false,

      resolver: zodResolver(checkoutSchema),
    };
  },

  methods: {
    async onFormSubmit({ valid, states, reset }: FormSubmitEvent) {
      if (valid) {
        this.loadingSubmit = true;
        try {
          const order = {
            fullname: states.fullname.value,
            phone: states.phone.value,
            address: states.address.value,
            state: {
              id: states.state.value.id,
              state: states.state.value.wilaya,
              home: states.state.value.home,
              point: states.state.value.point,
            },
            delivery: states.delivery.value,
            total: this.getTotalPrice(this.product, states),
            products: [
              {
                quantity: states.quantity.value,
                price: this.product.hasDiscount
                  ? Number(this.product.discountPrice!)
                  : Number(this.product.price),
                productId: this.product.id,
                title: this.product.title,
                colorId: this.selectedColor,
              },
            ],
          };

          await axios.post(`${import.meta.env.VITE_API_URL}orders`, order);

          this.visible = true;
          reset();
        } catch (error: any) {
          this.$toast.add({
            severity: "error",
            summary: "خطأ",
            detail: error.response?.data?.message || "حدث خطأ",
            life: 3000,
          });
        } finally {
          this.loadingSubmit = false;
        }
      } else {
        const formRef = this.$refs.form as {
          $el: HTMLElement;
        };
        const top =
          formRef.$el.getBoundingClientRect().top + window.scrollY - 100;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    },

    async fetchProductById() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}products/${this.$route.params.id}`
        );

        this.product = response.data?.product;
        this.storeProduct.product = response.data?.product;
        this.selectedColor = this.product.colors[0].id;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      } finally {
        this.loading = false;
      }
    },

    slidePrev() {
      this.swiper?.slidePrev();
    },

    slideNext() {
      this.swiper?.slideNext();
    },

    getTotalPrice(product: Product, form: any) {
      return (
        (product.hasDiscount
          ? Number(product.discountPrice!)
          : Number(product.price)) *
          form.quantity.value +
          (form.delivery.value === "home"
            ? Number(form.state?.value?.home)
            : Number(form.state?.value?.point)) || 0
      );
    },

    addToCart(product: Product, form: any) {
      this.storeCart.addToCart({
        ...product,
        quantity: form.quantity.value,
        colorId: this.selectedColor,
      });

      this.$toast.add({
        detail: "تم اضافة المنتج للسلة",
        styleClass: "toast",
        life: 2500,
      });
    },

    setThumbsSwiper(swiper: SwiperType) {
      this.thumbsSwiper = swiper;
      console.log(this.thumbsSwiper);
    },

    setSwiper(swiper: SwiperType) {
      this.swiper = swiper;
      console.log(this.swiper);
    },
  },

  setup() {
    const storeProduct = useProductStore();
    const storeCart = useCartStore();

    return {
      storeProduct,
      storeCart,
      currencyFormat,
      zrExpress,
      modules: [FreeMode, Navigation, Thumbs, Autoplay],

      check,
    };
  },

  async mounted() {
    await this.fetchProductById();
  },

  head() {
    return {
      title: computed(() =>
        this.loading ? "جاري التحميل..." : `${this.product.title} | MySouqDz`
      ),
      meta: [
        { name: "description", content: this.product?.description },
        { name: "keywords", content: this.product?.title },
        { name: "author", content: "MySouqDz" },
        { name: "application-name", content: "MySouqDz" },
        { name: "robots", content: "index, follow" },
        { rel: "canonical", href: "https://mysouqdz.store" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: this.product?.title },
        { property: "og:description", content: this.product?.description },
        { property: "og:image", content: this.product?.images[0]?.url },
        { property: "og:url", content: "https://mysouqdz.store" },
        { property: "og:site_name", content: "MySouqDz" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: this.product?.title },
        { name: "twitter:description", content: this.product?.description },
        { name: "twitter:image", content: this.product?.images[0]?.url },
      ],
    };
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

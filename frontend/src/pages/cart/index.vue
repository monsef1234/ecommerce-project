<template>
  <div class="container">
    <h1 class="text-2xl text-center font-bold">سلة المشتريات</h1>
    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-4 my-10"
      v-if="storeCart.cart.length"
    >
      <div>
        <div
          v-for="item in storeCart.cart"
          :key="item.id"
          class="relative flex justify-center flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg mb-4 shadow-md"
        >
          <InputNumber
            v-model="item.quantity"
            showButtons
            buttonLayout="vertical"
            :allowEmpty="false"
            inputClass="text-center w-full text-xl!"
            :min="1"
            :max="99"
            class="w-16!"
          />
          <Image
            :src="item.images.find((image) => image.isMain)?.url"
            :alt="item.title"
            width="100"
          />
          <div class="flex-1">
            <router-link :to="`/products/${item.id}`">
              <h3>{{ item.title }}</h3>
            </router-link>
            <span class="text-sm text-gray-500"> اللون: الاخضر </span>
          </div>
          <p class="text-lg font-bold">
            {{ currencyFormat(storeCart.getTotalPriceOneProduct(item)) }}
          </p>

          <Button
            type="button"
            icon="pi pi-times"
            class="absolute! top-0! right-0! hover:bg-transparent!"
            variant="text"
            severity="danger"
            @click="storeCart.removeProduct(item)"
          />
        </div>
      </div>

      <Form
        dir="rtl"
        ref="form"
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
          v-if="$form.state?.value && $form.delivery?.value"
        >
          <div class="flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-lg">
              <i class="pi pi-tag text-xl!"></i>
              سعر المنتجات
            </h3>
            <span class="font-bold">
              {{ currencyFormat(storeCart.getTotalPrice()) }}
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
              {{
                currencyFormat(
                  storeCart.getTotalPrice() +
                    ($form.delivery.value === "home"
                      ? $form.state?.value?.home
                      : $form.state?.value?.point)
                )
              }}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          severity="success"
          label="اشتري الآن"
          size="large"
        />
      </Form>
    </div>
    <div v-else>
      <p class="text-center text-lg">سلة المشتريات فارغة</p>

      <Button
        label="انتقال للتسوق"
        icon="pi pi-arrow-left"
        @click="$router.push('/products')"
        variant="outlined"
        class="flex! mx-auto! mb-10 hover:bg-black! hover:text-white! mt-6"
      />
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useCartStore } from "@/store/cart";
import { currencyFormat } from "@/utilities/currencyFormat";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { checkoutSchema } from "@/schemas/checkout.schema";
import zrExpress from "@/zr-express.json";

import check from "@/assets/images/check.png";

export default defineComponent({
  name: "Cart",

  data() {
    return {
      quantity: 1,

      initialValues: {
        fullname: "",
        phone: "",
        address: "",
        state: null,
        quantity: 1,
        delivery: "home" as "home" | "point",
      },

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

      visible: false as boolean,

      resolver: zodResolver(checkoutSchema),
    };
  },

  methods: {
    onFormSubmit({ valid, states, reset }: FormSubmitEvent) {
      if (valid) {
        console.log(states);

        this.visible = true;
        this.storeCart.reset;
        reset();
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
  },

  setup() {
    const storeCart = useCartStore();
    return {
      storeCart,
      currencyFormat,
      zrExpress,

      check,
    };
  },
});
</script>

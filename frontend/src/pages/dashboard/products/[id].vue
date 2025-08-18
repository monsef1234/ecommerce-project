<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Edit Product</h1>

    <Form
      v-if="initialValues.id"
      dir="rtl"
      ref="form"
      v-slot="$form"
      :initialValues
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-col gap-1">
        <InputText name="title" type="text" placeholder="اسم المنتج" fluid />

        <Message
          v-if="$form.title?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.title.error.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <Textarea name="description" placeholder="وصف المنتج" fluid rows="10" />

        <Message
          v-if="$form.description?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.description.error.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <InputText name="price" type="text" placeholder="سعر المنتج" fluid />

        <Message
          v-if="$form.price?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.price.error.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <MultiSelect
          name="colors"
          :options="initialValues.colors"
          :option-value="(option) => option"
          option-label="name"
          placeholder="اختر الألوان"
          fluid
        >
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <span
                class="w-4 h-4"
                :style="{ backgroundColor: slotProps.option.code }"
              ></span>
              <span>{{ slotProps.option.name }}</span>
            </div>
          </template>
        </MultiSelect>

        <Message
          v-if="$form.colors?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.colors.error.message }}</Message
        >
      </div>

      <div class="flex items-center gap-4">
        <label for="hasDiscount" class="text-lg">هل هناك خصم؟</label>
        <ToggleSwitch name="hasDiscount" input-id="hasDiscount" />
      </div>

      <div v-if="$form.hasDiscount?.value" class="flex flex-col gap-1">
        <InputText
          name="discountPrice"
          type="text"
          placeholder="سعر الخصم"
          fluid
        />

        <Message
          v-if="$form.discountPrice?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.discountPrice.error.message }}</Message
        >
      </div>

      <Button
        type="submit"
        label="تعديل المنتج"
        icon="pi pi-pencil"
        variant="filled"
        :disabled="isProductUpdated($form)"
      />
      <Button
        type="button"
        label="العودة للمنتجات"
        icon="pi pi-arrow-left"
        variant="text"
        @click="goToHome"
      />
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { addProductSchema } from "@/schemas/add-product.schema";
import type { Color, Product } from "@/types/Product";
import { useProductStore } from "@/store/product";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";

export default defineComponent({
  name: "EditProduct",

  data() {
    return {
      initialValues: {
        id: 0,
        title: "",
        price: "",
        hasDiscount: false,
        discountPrice: "",
        description: "",
        colors: [],
        images: [],
      } as Product,

      colors: [
        {
          id: 1,
          name: "Red",
          code: "#FF0000",
        },
        {
          id: 2,
          name: "Green",
          code: "#00FF00",
        },
        {
          id: 3,
          name: "Blue",
          code: "#0000FF",
        },
      ] as Color[],

      resolver: zodResolver(addProductSchema),
    };
  },

  methods: {
    onFormSubmit({ valid, states }: FormSubmitEvent) {
      if (valid) {
        const product: Product = {
          id: Number(this.$route.params.id),
          title: states.title.value,
          price: states.price.value,
          hasDiscount: states.hasDiscount.value,
          description: states.description.value,
          discountPrice: states.discountPrice.value,
          colors: states.colors.value,
          images: [
            {
              id: 1,
              url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
              isMain: true,
            },
          ],
        };

        this.storeProduct.editProduct(product);
      }
    },

    goToHome() {
      this.$router.push("/dashboard/products");
    },

    isProductUpdated(form: any) {
      const filterFormValues = {
        id: Number(this.$route.params.id),
        title: form.title?.value,
        price: form.price?.value,
        hasDiscount: form.hasDiscount?.value,
        discountPrice: form.discountPrice?.value,
        description: form.description?.value,
        colors: form.colors?.value,
        images: [
          {
            id: 1,
            url: "https://avradz.store/cdn/shop/files/main-2.png?v=1753221387",
            isMain: true,
          },
        ],
      };

      return isEqual(
        this.normalizeProduct(filterFormValues),
        this.normalizeProduct(this.initialValues)
      );
    },

    normalizeProduct(product: Product) {
      return {
        ...product,
        colors: sortBy(product.colors, "id"), // ✅ ترتيب حسب id
      };
    },
  },

  setup() {
    const storeProduct = useProductStore();

    return {
      storeProduct,
    };
  },

  mounted() {
    const id = this.$route.params.id;

    this.initialValues =
      this.storeProduct.getProductById(Number(id)) ?? this.initialValues;
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

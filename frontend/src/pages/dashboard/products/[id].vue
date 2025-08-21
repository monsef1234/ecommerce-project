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
          this.initialValues.logo.id
          variant="simple"
          >{{ $form.discountPrice.error.message }}</Message
        >
      </div>

      <FileUpload
        mode="basic"
        @select="onFileSelect"
        customUpload
        auto
        severity="secondary"
        class="p-button-outlined"
        accept="image/jpeg, image/png, image/webp, image/jpg"
        multiple
        choose-label="اضافة صورة"
      >
      </FileUpload>

      <div class="flex flex-wrap gap-4 mt-4" v-if="previewedImages.length">
        <div
          v-for="(image, index) in previewedImages"
          :key="index"
          class="flex items-center gap-2"
        >
          <Image
            :src="image"
            alt="Image"
            class="shadow-md rounded-xl sm:w-80 w-full"
          />

          <Button
            icon="pi pi-times"
            @click="removeImage(index)"
            variant="outlined"
            severity="danger"
          />
        </div>
      </div>

      <Button
        type="submit"
        label="تعديل المنتج"
        icon="pi pi-pencil"
        variant="filled"
        :disabled="isProductUpdated($form) && isImagesUpdated"
      />
      <Button
        type="button"
        label="العودة للمنتجات"
        icon="pi pi-arrow-left"
        variant="text"
        @click="goToHome"
      />
    </Form>

    <Toast dir="rtl" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import {
  productSchema,
  type ProductSchemaType,
} from "@/schemas/product.schema";
import type { Image, Product } from "@/types/Product";
import { useProductStore } from "@/store/product";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";
import type { FileUploadSelectEvent } from "primevue";

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
      } as ProductSchemaType,    

      images: [] as Image[],

      files: [] as File[],
      previewedImages: [] as string[],

      product: null as Product | null,

      resolver: zodResolver(productSchema),
    };
  },

  methods: {
    onFormSubmit({ valid, states }: FormSubmitEvent) {
      if (!this.files.length) {
        return this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "يجب إضافة على الأقل صورة",
          life: 3000,
        });
      }

      if (valid) {
        const product = {
          id: Number(this.$route.params.id),
          title: states.title.value,
          price: states.price.value,
          hasDiscount: states.hasDiscount.value,
          description: states.description.value,
          discountPrice: states.discountPrice.value,
          colors: states.colors.value,
          images: this.images,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.storeProduct.editProduct(product);
      }
    },

    goToHome() {
      this.$router.push("/dashboard/products");
    },

    onFileSelect(event: FileUploadSelectEvent) {
      this.files.push(...event.files);

      event.files.forEach((file: File) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.previewedImages.push(e.target?.result as string);
        };

        reader.readAsDataURL(file);
      });
    },

    removeImage(id: number) {
      this.images = this.images.filter((image) => image.id !== id);
    },

    normalizeProduct(product: ProductSchemaType) {
      return {
        ...product,
        colors: sortBy(product.colors, "id"), // ✅ ترتيب حسب id
      };
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
      } as ProductSchemaType;

      return isEqual(
        this.normalizeProduct(filterFormValues),
        this.normalizeProduct(this.initialValues)
      );
    },
  },

  computed: {
    isImagesUpdated() {
      return isEqual(this.images, this.product?.images);
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

    this.product = this.storeProduct.getProductById(Number(id)) || null;

    this.initialValues = {
      id: this.product?.id,
      title: this.product?.title,
      price: this.product?.price,
      hasDiscount: this.product?.hasDiscount,
      discountPrice: this.product?.discountPrice,
      description: this.product?.description,
      colors: this.product?.colors,
    } as ProductSchemaType;

    this.images = this.product?.images || [];
    this.previewedImages = this.product?.images.map((image) => image.url) || [];
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

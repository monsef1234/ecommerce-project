<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">تعديل المنتج</h1>

    <h2
      v-if="!initialValues.id && !loading"
      class="text-center text-lg font-bold"
    >
      المنتج غير موجود
    </h2>
    <h2 v-else-if="loading" class="text-center text-lg font-bold">
      جاري التحميل...
    </h2>

    <Form
      v-if="initialValues.id && !loading"
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
          :options="colors"
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
        <span class="text-lg">{{
          $form.hasDiscount?.value ? "نعم" : "لا"
        }}</span>
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

      <div class="flex items-center gap-4">
        <label for="status" class="text-lg">هل المنتج متاح؟</label>
        <ToggleSwitch name="status" input-id="status" />
        <span class="text-lg">{{ $form.status?.value ? "نعم" : "لا" }}</span>
      </div>

      <FileUpload
        mode="basic"
        @select="onFileSelect"
        auto
        severity="secondary"
        class="p-button-outlined"
        accept="image/jpeg, image/png, image/webp, image/jpg"
        multiple
        choose-label="اضافة صورة"
        :disabled="updateLoading"
      >
      </FileUpload>

      <div class="flex flex-wrap gap-4 mt-4" v-if="previewedImages.length">
        <div
          v-for="(image, index) in previewedImages"
          :key="index"
          class="flex items-center gap-2"
        >
          <Image
            :src="image.url"
            v-if="image.url"
            alt="Image"
            class="shadow-md rounded-xl sm:w-80 w-full"
          />

          <span
            v-if="image.progress && image.progress < 100"
            class="text-xs ml-1 font-bold"
            >{{ image.progress }}%</span
          >

          <Button
            icon="pi pi-times"
            @click="removeImage(index, image)"
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
        :disabled="
          (isProductUpdated($form) && isImagesUpdated) || updateLoading
        "
        :loading="updateLoading"
      />
      <Button
        type="button"
        label="العودة للمنتجات"
        icon="pi pi-arrow-left"
        variant="text"
        @click="goToHome"
        :disabled="updateLoading"
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
import type { Product } from "@/types/Product";
import { useProductStore } from "@/store/product";
import { isEqual } from "lodash";
import { sortBy } from "lodash";
import axios from "axios";
import type { FileUploadSelectEvent } from "primevue";
import type { Color } from "@/types/color";
import imageCompression from "browser-image-compression";

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
        status: true,
        colors: [],
      } as ProductSchemaType,

      newImages: [] as File[],
      deletedImages: [] as { id: number }[],

      previewedImages: [] as { url: string; progress: number }[],

      product: null as Product | null,
      colors: [] as Color[],

      loading: true as boolean,
      updateLoading: false as boolean,

      resolver: zodResolver(productSchema),
    };
  },

  methods: {
    async onFormSubmit({ valid, states }: FormSubmitEvent) {
      if (!this.previewedImages.length) {
        return this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "يجب إضافة على الأقل صورة",
          life: 3000,
        });
      }

      if (valid) {
        this.updateLoading = true;
        try {
          const formData = new FormData();

          formData.append("title", states.title.value);
          formData.append("price", states.price.value);
          formData.append("hasDiscount", String(states.hasDiscount.value));
          formData.append("status", String(states.status.value));
          if (states.discountPrice?.value) {
            formData.append("discountPrice", states.discountPrice.value);
          }
          formData.append("description", states.description.value);

          states.colors.value.forEach((color: Color) => {
            formData.append("colors[]", color.id.toString());
          });

          if (this.newImages.length) {
            this.newImages.forEach((image: File) => {
              formData.append("images", image);
            });
          }

          if (this.deletedImages.length) {
            this.deletedImages.forEach((image: { id: number }) => {
              formData.append("deletedImages[]", image.id.toString());
            });
          }

          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}products/${this.$route.params.id}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          this.$router.push("/dashboard/products").then(() => {
            this.$toast.add({
              severity: "success",
              summary: "نجاح",
              detail: response.data.message || "تم تعديل المنتج بنجاح",
              life: 3000,
            });
          });
        } catch (error: any) {
          this.$toast.add({
            severity: "error",
            summary: "خطأ",
            detail: error.response?.data?.message || "حدث خطأ",
            life: 3000,
          });
        } finally {
          this.updateLoading = false;
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

    async loadColors() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}colors`
        );

        this.colors = response.data?.colors || [];
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    async fetchProductById() {
      try {
        this.loading = true;
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}products/${this.$route.params.id}`
        );

        this.product = response.data?.product || null;
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

    goToHome() {
      this.$router.push("/dashboard/products");
    },

    onFileSelect(event: FileUploadSelectEvent) {
      if (this.newImages.length >= 10 || event.files.length > 10) {
        return this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "لا يمكن إضافة أكثر من 10 صور",
          life: 3000,
        });
      }

      event.files.forEach(async (file: File) => {
        const imageEntry = reactive({
          url: "",
          progress: 0,
        } as { url: string; progress: number });

        this.previewedImages.push(imageEntry);

        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          onProgress: (progress) => {
            imageEntry.progress = progress;
          },
        });

        imageEntry.url = URL.createObjectURL(compressedFile);

        this.newImages.push(compressedFile);
      });
    },

    removeImage(index: number, image: { url: string }) {
      if (!this.previewedImages[index].url.startsWith("data:image")) {
        const findId = this.product?.images.find(
          (img) => img.url === image.url
        )?.id;

        this.deletedImages.push({ id: findId! });
      } else {
        const newIdx = index - (this.product?.images?.length ?? 0);
        if (newIdx >= 0 && newIdx < this.newImages.length) {
          this.newImages.splice(newIdx, 1);
        }
      }

      this.previewedImages.splice(index, 1);
    },

    normalizeProduct(product: ProductSchemaType) {
      return {
        ...product,
        colors: sortBy(product.colors, "id"),
      };
    },

    isProductUpdated(form: any) {
      const filterFormValues = {
        id: Number(this.$route.params.id),
        title: form.title?.value,
        price: form.price?.value,
        hasDiscount: form.hasDiscount?.value,
        discountPrice: form.discountPrice?.value,
        status: form.status?.value,
        description: form.description?.value,
        colors: form.colors?.value,
      } as ProductSchemaType;

      return isEqual(
        this.normalizeProduct(filterFormValues),
        this.normalizeProduct(this.initialValues)
      );
    },

    setInitialValues() {
      if (this.product) {
        this.initialValues = {
          id: this.product?.id,
          title: this.product?.title,
          price: String(this.product?.price),
          hasDiscount: this.product?.hasDiscount,
          status: this.product?.status,
          discountPrice:
            this.product?.discountPrice === null
              ? undefined
              : String(this.product?.discountPrice),
          description: this.product?.description,
          colors: this.product?.colors,
        } as ProductSchemaType;

        this.previewedImages =
          this.product?.images.map((image) => ({
            url: image.url,
            progress: 0,
          })) || [];
      }
    },
  },

  computed: {
    isImagesUpdated() {
      const images = this.product?.images.map((image) => image.url);
      return isEqual(
        this.previewedImages.map((image) => image.url),
        images
      );
    },
  },

  setup() {
    const storeProduct = useProductStore();

    return {
      storeProduct,
    };
  },

  async mounted() {
    await this.loadColors();
    await this.fetchProductById();

    this.setInitialValues();
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
  requiresAuth: true
</route>

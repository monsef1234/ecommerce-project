<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Add Product</h1>

    <Form
      dir="rtl"
      ref="form"
      v-slot="$form"
      :initialValues
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 mb-6"
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
      </div>

      <div class="flex flex-col gap-1" v-if="$form.hasDiscount?.value">
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

      <FileUpload
        mode="basic"
        auto
        severity="secondary"
        class="p-button-outlined"
        accept="image/jpeg, image/png, image/webp, image/jpg"
        @select="onFileSelect"
        multiple
        choose-label="اضافة صورة"
        :disabled="loading"
      />

      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4"
        v-if="previewedImages.length"
      >
        <div
          v-for="(image, index) in previewedImages"
          :key="index"
          class="flex items-center gap-2 previewedImages"
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
            @click="removeImage(index)"
            variant="outlined"
            severity="danger"
          />
        </div>
      </div>

      <Button
        type="submit"
        label="اضافة المنتج"
        icon="pi pi-plus"
        variant="filled"
        :loading="loading"
        :disabled="
          loading || previewedImages.some((image) => image.progress < 100)
        "
      />
    </Form>
    <Toast dir="rtl" class="w-3xs! md:w-1/4! text-lg! md:text-xl!" />
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
import type { Color } from "@/types/color";
import axios from "axios";
import type { FileUploadSelectEvent } from "primevue";
import imageCompression from "browser-image-compression";

export default defineComponent({
  name: "AddProduct",

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
      } as ProductSchemaType,

      resolver: zodResolver(productSchema),

      colors: [] as Color[],

      files: [] as File[],
      previewedImages: [] as { url: string; progress: number }[],

      loading: false,
      loadingColors: false,
    };
  },

  methods: {
    async onFormSubmit({ valid, states, reset }: FormSubmitEvent) {
      if (!this.files.length) {
        return this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "يجب إضافة على الأقل صورة",
          life: 3000,
        });
      }

      if (valid) {
        this.loading = true;
        try {
          const formData = new FormData();

          formData.append("title", states.title.value);
          formData.append("price", states.price.value);
          formData.append("hasDiscount", String(states.hasDiscount.value));
          if (states.discountPrice?.value) {
            formData.append("discountPrice", states.discountPrice.value);
          }
          formData.append("description", states.description.value);

          states.colors.value.forEach((color: Color) => {
            formData.append("colors[]", color.id.toString());
          });

          this.files.forEach((file: File) => {
            formData.append("images", file);
          });

          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}products`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          this.$toast.add({
            severity: "success",
            summary: "تم الاضافة",
            detail: response.data.message || "تم الاضافة المنتج بنجاح",
            life: 3000,
          });

          reset();
          this.files = [];
          this.previewedImages = [];
          this.loading = false;
        } catch (error: any) {
          this.loading = false;

          this.$toast.add({
            severity: "error",
            summary: "خطأ",
            detail: error.response?.data?.message || "حدث خطأ",
            life: 3000,
          });
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

        this.colors = response.data.colors;
      } catch (error: any) {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: error.response?.data?.message || "حدث خطأ",
          life: 3000,
        });
      }
    },

    onFileSelect(event: FileUploadSelectEvent) {
      if (this.files.length >= 10 || event.files.length > 10) {
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

        this.files.push(compressedFile);
      });
    },

    removeImage(index: number) {
      this.previewedImages.splice(index, 1);
      this.files.splice(index, 1);
    },
  },

  async mounted() {
    this.loadingColors = true;
    await this.loadColors();
    this.loadingColors = false;
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
  requiresAuth: true
</route>

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
        label="اضافة المنتج"
        icon="pi pi-plus"
        variant="filled"
        :loading="loading"
        :disabled="loading"
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

      files: [] as File[],
      previewedImages: [] as string[],

      loading: false,
    };
  },

  methods: {
    async onFormSubmit({ valid, states, reset }: FormSubmitEvent) {
      console.log(this.files);

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

          this.files.forEach((file) => {
            formData.append("images", file);
          });

          const response = await axios.post(
            "http://192.168.1.42:4000/products",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (response.status === 201) {
            this.$toast.add({
              severity: "success",
              summary: "تم الاضافة",
              detail: "تم الاضافة المنتج بنجاح",
              life: 3000,
            });

            reset();
            this.files = [];
            this.previewedImages = [];
            this.loading = false;
          }
        } catch (error) {
          this.loading = false;
          console.log(error);
          this.$toast.add({
            severity: "error",
            summary: "خطأ",
            detail: "حدث خطأ",
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

    removeImage(index: number) {
      this.previewedImages.splice(index, 1);
      this.files.splice(index, 1);
    },
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

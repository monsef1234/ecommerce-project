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

      <div class="flex flex-col gap-1">
        <FileUpload
          name="images"
          @select="onSelect"
          @remove="onRemove"
          @clear="onClear"
          customUpload
          :multiple="true"
          accept="image/*"
          :maxFileSize="1000000"
        >
          <template #empty>
            <span>إسحب وأسقط الصور هنا أو إضغط للرفع.</span>
          </template>
        </FileUpload>

        <Message
          v-if="$form.images?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.images.error.message }}</Message
        >
      </div>

      <Button
        type="submit"
        label="اضافة المنتج"
        icon="pi pi-plus"
        variant="filled"
      />
    </Form>
    <Toast />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import {
  addProductSchema,
  type ProductForm,
} from "@/schemas/add-product.schema";
import type { Color } from "@/types/Product";

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
      } as ProductForm,

      resolver: zodResolver(addProductSchema),

      images: [],

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
    };
  },

  methods: {
    onFormSubmit({ valid, states }: FormSubmitEvent) {
      if (!this.images.length) {
        return this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "يجب إضافة على الأقل صورة",
          life: 3000,
        });
      }

      if (valid) {
        console.log(states);
      }
    },

    onSelect(event: any) {
      this.images = event.files;
    },

    onRemove(event: any) {
      this.images = this.images.filter(
        (image: any) => image.name !== event.name
      );
    },

    onClear() {
      this.images = [];
    },
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

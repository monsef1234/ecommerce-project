<template>
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
      <InputText name="name" type="text" placeholder="اسم المنتج" fluid />

      <Message
        v-if="$form.name?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form.name.error.message }}</Message
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
        option-value="id"
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
      <label for="checked" class="text-lg">هل هناك خصم؟</label>
      <ToggleSwitch name="checked" input-id="checked" />
    </div>

    <div v-if="$form.checked?.value" class="flex flex-col gap-1">
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
      label="اضافة المنتج"
      icon="pi pi-plus"
      variant="filled"
    />
  </Form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { addProductSchema } from "@/schemas/add-product.schema";
import type { Color } from "@/types/Product";

export default defineComponent({
  name: "AddProduct",

  data() {
    return {
      initialValues: {
        name: "",
        price: "",
        checked: false,
        discountPrice: "",
        colors: [],
      },

      resolver: zodResolver(addProductSchema),

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
      if (valid) {
        console.log(states);
      }
    },
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Add Color</h1>

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
        <InputText name="name" type="text" placeholder="اسم اللون" fluid />

        <Message
          v-if="$form.name?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.name.error.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <label for="code" class="text-lg">اللون :</label>
          <ColorPicker name="code" inputId="code" />
        </div>

        <Message
          v-if="$form.code?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.code.error?.message }}</Message
        >
      </div>

      <Button
        type="submit"
        label="اضافة اللون"
        icon="pi pi-plus"
        variant="filled"
        :loading="loading"
        :disabled="loading"
      />
    </Form>
    <Toast dir="rtl" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { colorSchema, type ColorSchemaType } from "@/schemas/color.schema";
import axios from "axios";

export default defineComponent({
  name: "AddColor",

  data() {
    return {
      initialValues: {
        code: "",
        name: "",
      } as ColorSchemaType,

      loading: false as boolean,

      resolver: zodResolver(colorSchema),
    };
  },

  methods: {
    async onFormSubmit({ valid, states, reset }: FormSubmitEvent) {
      if (valid) {
        this.loading = true;
        try {
          const color = {
            name: states.name.value,
            code: "#" + states.code.value,
          };

          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}colors`,
            color
          );

          this.$toast.add({
            severity: "success",
            summary: "نجاح",
            detail: response?.data?.message || "تم اضافة اللون بنجاح",
            life: 3000,
          });

          reset();
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
      }
    },
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
  requiresAuth: true
</route>

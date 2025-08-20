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
import { useColorStore } from "@/store/color";
import { emitter } from "@/events";

export default defineComponent({
  name: "AddColor",

  data() {
    return {
      initialValues: {
        code: "",
        name: "",
      } as ColorSchemaType,

      resolver: zodResolver(colorSchema),
    };
  },

  methods: {
    onFormSubmit({ valid, states }: FormSubmitEvent) {
      if (valid) {
        const color = {
          id: this.colorStore.colors.length + 1,
          name: states.name.value,
          code: "#" + states.code.value,
        };

        this.colorStore.addColor(color);

        // this.$toast.add({
        //   severity: "success",
        //   summary: "تم الاضافة",
        //   detail: "تم الاضافة بنجاح",
        //   life: 3000,
        // });
      }
    },
  },

  setup() {
    const colorStore = useColorStore();

    return {
      colorStore,
    };
  },

  mounted() {
    emitter.on("already-exists", (data) => {
      this.$toast.add({
        severity: data.type,
        summary: "خطأ",
        detail: data.message,
        life: 3000,
      });
    });
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

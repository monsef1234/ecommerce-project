<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Settings</h1>

    <Form
      dir="rtl"
      ref="form"
      v-slot="$form"
      v-if="initialValues.id"
      :initialValues
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-col gap-1">
        <InputText name="name" type="text" placeholder="اسم المتجر" fluid />

        <Message
          v-if="$form.name?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.name.error.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <InputText
          name="email"
          type="email"
          placeholder="البريد الالكتروني"
          fluid
        />

        <Message
          v-if="$form.email?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.email.error.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <InputText
          name="phone_one"
          type="text"
          placeholder="رقم الهاتف"
          fluid
        />

        <Message
          v-if="$form.phone_one?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.phone_one.error.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <InputText
          name="phone_two"
          type="text"
          placeholder="رقم الهاتف (اختياري)"
          fluid
        />

        <Message
          v-if="$form.phone_two?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.phone_two.error.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <InputText
          name="phone_three"
          type="text"
          placeholder="رقم الهاتف (اختياري)"
          fluid
        />

        <Message
          v-if="$form.phone_three?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.phone_three.error.message }}</Message
        >
      </div>

      <FileUpload
        mode="basic"
        @select="onFileSelect"
        customUpload
        auto
        severity="secondary"
        class="p-button-outlined"
        accept="image/*"
      />

      <div v-if="src" class="flex items-center gap-2">
        <Image :src="src" alt="Logo" width="150" height="150" />
        <i
          v-if="src.startsWith('data:image')"
          class="pi pi-times cursor-pointer"
          @click="
            src = settingsStore.settings.logo;
            imageChanged = false;
          "
        />
      </div>
      <Button
        type="submit"
        label="حفظ"
        icon="pi pi-save"
        variant="filled"
        :disabled="isUpdated($form) && !imageChanged"
      />
    </Form>

    <Toast dir="rtl" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import {
  settingsSchema,
  type SettingsSchemaType,
} from "@/schemas/settings.schema";
import type { FormSubmitEvent } from "@primevue/forms";
import { useSettingsStore } from "@/store/settings";
import { isEqual } from "lodash";
import type { FileUploadSelectEvent } from "primevue";

export default defineComponent({
  name: "Settings",

  data() {
    return {
      initialValues: {
        id: 0,
        name: "",
        email: "",
        phone_one: "",
        phone_two: "",
        phone_three: "",
      } as SettingsSchemaType,

      src: "",
      file: null as File | null,

      imageChanged: false,

      resolver: zodResolver(settingsSchema),

      newPhone: "",
    };
  },

  methods: {
    isUpdated(form: any) {
      const filterFormValues = {
        id: this.initialValues.id,
        name: form.name?.value,
        email: form.email?.value,
        phone_one: form.phone_one?.value,
      } as SettingsSchemaType;

      if (form.phone_two?.value) {
        filterFormValues.phone_two = form.phone_two?.value;
      }
      if (form.phone_three?.value) {
        filterFormValues.phone_three = form.phone_three?.value;
      }
      console.log(filterFormValues);
      console.log(this.initialValues);

      console.log(isEqual(filterFormValues, this.initialValues));

      return isEqual(filterFormValues, this.initialValues);
    },

    onFileSelect(event: FileUploadSelectEvent) {
      const file = event.files?.[0];
      const reader = new FileReader();

      this.file = file;

      reader.onload = async (e) => {
        this.src = e.target?.result as string;
        this.imageChanged = true;
      };

      reader.readAsDataURL(file);
    },

    onFormSubmit({ valid, states }: FormSubmitEvent) {
      if (valid) {
        console.log(states);
      }
    },
  },

  setup() {
    const settingsStore = useSettingsStore();

    return {
      settingsStore,
    };
  },

  mounted() {
    const { logo, ...settings } = this.settingsStore.settings;
    this.initialValues = settings;
    this.src = this.settingsStore.settings.logo;
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

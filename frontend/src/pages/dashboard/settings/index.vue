<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Settings</h1>

    <h2 v-if="settingsStore.loading" class="text-center text-lg font-bold">
      جاري التحميل...
    </h2>
    <Form
      v-else
      dir="rtl"
      ref="form"
      v-slot="$form"
      v-if="settingsStore.settings.id"
      :initialValues="settingsStore.initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 mb-6"
    >
      <div class="flex flex-col gap-1">
        <InputText
          name="storeName"
          type="text"
          placeholder="اسم المتجر"
          fluid
        />

        <Message
          v-if="$form.storeName?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.storeName?.error?.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <InputText name="phone1" type="text" placeholder="رقم الهاتف" fluid />

        <Message
          v-if="$form.phone1?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.phone1?.error?.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <InputText
          name="phone2"
          type="text"
          placeholder="رقم الهاتف (اختياري)"
          fluid
        />

        <Message
          v-if="$form.phone2?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.phone2?.error?.message }}</Message
        >
      </div>

      <div class="flex flex-col gap-1">
        <InputText
          name="phone3"
          type="text"
          placeholder="رقم الهاتف (اختياري)"
          fluid
        />

        <Message
          v-if="$form.phone3?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.phone3?.error?.message }}</Message
        >
      </div>

      <FileUpload
        mode="basic"
        @select="onFileSelect"
        auto
        severity="secondary"
        class="p-button-outlined"
        accept="image/jpeg, image/png, image/webp, image/jpg"
        choose-label="اضافة صورة"
        :disabled="loading"
      >
      </FileUpload>

      <div
        class="flex flex-wrap gap-4 mt-4"
        v-if="settingsStore.previewedImage"
      >
        <div class="flex items-center gap-2">
          <Image
            :src="settingsStore.previewedImage"
            :alt="settingsStore.settings.storeName"
            class="shadow-md rounded-xl sm:w-80 w-fit!"
          />

          <Button
            icon="pi pi-times"
            variant="outlined"
            severity="danger"
            @click="
              settingsStore.previewedImage = '';
              imageChanged = true;
            "
            aria-label="حذف الصورة"
          />
        </div>
      </div>
      <Button
        type="submit"
        label="حفظ"
        icon="pi pi-save"
        variant="filled"
        :disabled="(isUpdated($form) && !imageChanged) || loading"
        :loading="loading"
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
import axios from "axios";

export default defineComponent({
  name: "Settings",

  data() {
    return {
      file: null as File | null,

      imageChanged: false,
      loading: false,

      resolver: zodResolver(settingsSchema),
    };
  },

  methods: {
    isUpdated(form: any) {
      const filterFormValues = {
        id: this.settingsStore.settings.id,
        storeName: form.storeName?.value,
        phone1: form.phone1?.value,
        phone2: form.phone2?.value,
        phone3: form.phone3?.value,
      } as SettingsSchemaType;

      if (form.phone2?.value) {
        filterFormValues.phone2 = form.phone2?.value;
      }
      if (form.phone3?.value) {
        filterFormValues.phone3 = form.phone3?.value;
      }

      return (
        isEqual(filterFormValues, this.settingsStore.initialValues) ||
        this.imageChanged
      );
    },

    onFileSelect(event: FileUploadSelectEvent) {
      const file = event.files?.[0];
      const reader = new FileReader();

      this.file = file;

      reader.onload = async (e) => {
        this.settingsStore.previewedImage = e.target?.result as string;
        this.imageChanged = true;
      };

      reader.readAsDataURL(file);
    },

    async onFormSubmit({ valid, states }: FormSubmitEvent) {
      if (this.settingsStore.previewedImage.trim() === "") {
        this.$toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "يجب إضافة صورة",
          life: 3000,
        });
        return;
      }

      if (valid) {
        this.loading = true;
        try {
          const formData = new FormData();

          formData.append("storeName", states.storeName.value);
          formData.append("phone1", states.phone1.value);
          if (states.phone2.value) {
            formData.append("phone2", states.phone2.value);
          }
          if (states.phone3.value) {
            formData.append("phone3", states.phone3.value);
          }
          if (this.file) {
            formData.append("logo", this.file);
          }

          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}settings`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          await this.settingsStore.fetchSetting();

          this.$toast.add({
            severity: "success",
            summary: "تم",
            detail: response.data.message || "تم تحديث الإعدادات بنجاح",
            life: 3000,
          });
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

  setup() {
    const settingsStore = useSettingsStore();

    return {
      settingsStore,
    };
  },
});
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>

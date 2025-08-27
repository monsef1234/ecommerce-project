import type { SettingsSchemaType } from "@/schemas/settings.schema";
import type { Setting } from "@/types/settings";
import axios from "axios";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    settings: {
      id: 0,
      storeName: "",
      logoUrl: "",
      phone: "",
      phone2: "",
      phone3: "",
    } as Setting,

    initialValues: {
      id: 0,
      storeName: "",
      phone1: "",
      phone2: "",
      phone3: "",
    } as SettingsSchemaType,

    logoUrl: "",
    previewedImage: "",

    loading: false,
  }),

  actions: {
    async fetchSetting() {
      this.loading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}settings`
        );

        this.settings = response.data.setting;

        this.setInitialValues();
      } catch (error: any) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    setInitialValues() {
      this.initialValues = {
        id: this.settings.id,
        storeName: this.settings.storeName,
        phone1: this.settings.phone,
        phone2:
          this.settings.phone2 === null ? undefined : this.settings.phone2,
        phone3:
          this.settings.phone3 === null ? undefined : this.settings.phone3,
      };

      this.logoUrl = this.settings.logoUrl;
      this.previewedImage = this.settings.logoUrl;
    },
  },
});

import { createApp } from "vue";

import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Tooltip from "primevue/tooltip";
import { inject } from "@vercel/analytics";

import "primeicons/primeicons.css";
import "./style/global.css";

const BlackWhitePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#ffffff",
      100: "#f0f0f0",
      200: "#d9d9d9",
      300: "#bfbfbf",
      400: "#a6a6a6",
      500: "#8c8c8c",
      600: "#737373",
      700: "#595959",
      800: "#404040",
      900: "#000000",
    },
    colorScheme: {
      light: {
        primary: {
          color: "#000000", // button bg, highlight color
          contrastColor: "#ffffff", // text color on primary
          hoverColor: "#000000",
          activeColor: "#000000",
        },
        surface: {
          0: "#ffffff", // card/input bg
          50: "#f9f9f9",
          100: "#f0f0f0",
          200: "#d9d9d9",
          300: "#bfbfbf",
          400: "#a6a6a6",
          500: "#8c8c8c",
          600: "#737373",
          700: "#595959",
          800: "#404040",
          900: "#000000",
        },
      },
      //   dark: {
      //     primary: {
      //       color: "#ffffff",
      //       contrastColor: "#000000",
      //       hoverColor: "#ffffff",
      //       activeColor: "#ffffff",
      //     },
      //     surface: {
      //       0: "#000000", // dark bg
      //       50: "#1a1a1a",
      //       100: "#262626",
      //       200: "#404040",
      //       300: "#595959",
      //       400: "#737373",
      //       500: "#8c8c8c",
      //       600: "#a6a6a6",
      //       700: "#bfbfbf",
      //       800: "#d9d9d9",
      //       900: "#ffffff", // text color on dark
      //     },
      //   },
    },
  },
});

inject();

const app = createApp(App);

app.directive("tooltip", Tooltip);

app
  .use(createPinia())
  .use(router)
  .use(PrimeVue, {
    theme: {
      preset: BlackWhitePreset,
      options: {
        darkModeSelector: "light",
      },
    },
  })
  .use(ToastService)
  .use(ConfirmationService)
  .mount("#app");

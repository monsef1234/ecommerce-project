import { defineStore } from "pinia";

import type { Color } from "@/types/color";
import { emitter } from "@/events";

export const useColorStore = defineStore("color", {
  state: () => ({
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
      {
        id: 4,
        name: "Black",
        code: "#000000",
      },
    ] as Color[],
  }),

  actions: {
    removeColor(color: Color) {
      this.colors = this.colors.filter((c) => c.id !== color.id);
    },

    addColor(color: Color) {
      const find = this.colors.find((c) => c.code === color.code);

      if (find) {
        emitter.emit("already-exists", {
          message: "اللون موجود بالفعل",
          type: "error",
        });

        return;
      }

      this.colors.push(color);
    },
  },
});

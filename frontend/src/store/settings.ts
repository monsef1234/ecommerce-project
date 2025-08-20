import type { Setting } from "@/types/settings";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    settings: {
      id: 1,
      name: "monsef",
      email: "monsef4566@gmail.com",
      logo: "https://imgs.search.brave.com/UszzEkcE-A0fs0U5dgAoFXYDCJf-BDGvhSV7cfWLoNs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/ZnJvbnQuZnJlZXBp/ay5jb20vaG9tZS9h/bm9uLXJ2bXAvY3Jl/YXRpdmUtc3VpdGUv/YXVkaW8tY3JlYXRp/b24vdmlzdWFscy1z/b25ncy53ZWJw",
      phone_one: "0123456789",
      phone_two: "0123456789",
    } as Setting,
  }),
});

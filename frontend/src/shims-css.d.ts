/// <reference types="vite/client" />

// Allow importing CSS and common style files
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.less";
declare module "*.styl";

// Explicit declarations for Swiper CSS entry points used in the app
declare module "swiper/css";
declare module "swiper/css/free-mode";
declare module "swiper/css/navigation";
declare module "swiper/css/thumbs";

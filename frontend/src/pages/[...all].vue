<template>
  <section class="flex flex-col items-center justify-center text-center py-20">
    <h1 class="text-6xl font-bold text-gray-800">404</h1>
    <p class="mt-4 text-gray-600 text-lg">الصفحة التي تبحث عنها غير موجودة.</p>
    <div class="mt-8 flex gap-3">
      <Button label="العودة للرئيسية" icon="pi pi-home" @click="goHome" />
      <Button
        label="عودة للخلف"
        severity="secondary"
        icon="pi pi-arrow-left"
        @click="goBack"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const router = useRouter();

const goHome = () => router.push("/");
const goBack = () => router.back();
</script>

<route lang="yaml">
meta:
  layout: default
</route>

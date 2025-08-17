<template>
  <div class="h-screen flex items-center justify-center">
    <Form
      dir="rtl"
      ref="form"
      v-slot="$form"
      :initialValues
      :resolver="resolver"
      @submit="onFormSubmit"
      class="flex flex-col gap-4 bg-gray-200! p-6! rounded-lg! shadow-md!"
    >
      <div class="flex flex-col gap-1">
        <InputText
          name="email"
          type="email"
          placeholder="البريد الالكتروني"
          fluid
          size="small"
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
          name="password"
          type="password"
          placeholder="كلمة السر"
          fluid
          size="small"
        />

        <Message
          v-if="$form.password?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.password.error.message }}</Message
        >
      </div>

      <Button
        type="submit"
        label="تسجيل الدخول"
        icon="pi pi-user"
        variant="filled"
        class="w-full"
      />
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { loginSchema } from "@/schemas/login.schema";
import { useAuthStore } from "@/store/auth";

export default defineComponent({
  data() {
    return {
      initialValues: {
        email: "",
        password: "",
      },

      resolver: zodResolver(loginSchema),
    };
  },

  methods: {
    onFormSubmit({ valid, states }: FormSubmitEvent) {
      if (valid) {
        console.log(states);

        this.authStore.setUser(states);
        this.$router.push("/dashboard");
      }
    },
  },

  setup() {
    const authStore = useAuthStore();

    return {
      authStore,
    };
  },
});
</script>

<route lang="yaml">
meta:
  layout: false
</route>

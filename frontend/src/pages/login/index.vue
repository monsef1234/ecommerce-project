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
        :loading="loading"
        :disabled="loading"
      />
    </Form>

    <Toast dir="rtl" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { loginSchema, type LoginSchemaType } from "@/schemas/login.schema";
import { useAuthStore } from "@/store/auth";
import supabase from "@/supabase";

export default defineComponent({
  data() {
    return {
      initialValues: {
        email: "",
        password: "",
      } as LoginSchemaType,

      loading: false,

      resolver: zodResolver(loginSchema),
    };
  },

  methods: {
    async onFormSubmit({ valid, states }: FormSubmitEvent) {
      if (valid) {
        this.loading = true;
        try {
          const {
            data: { user },
            error,
          } = await supabase.auth.signInWithPassword({
            email: states.email.value,
            password: states.password.value,
          });

          if (error) throw error;

          this.authStore.setUser(user!);
          this.$router.push("/dashboard");
        } catch (error: any) {
          this.$toast.add({
            severity: "error",
            summary: "فشل تسجيل الدخول",
            detail: "يرجى التحقق من بياناتك",
          });
        } finally {
          this.loading = false;
        }
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

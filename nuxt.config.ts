// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxt/eslint", "@nuxtjs/tailwindcss", "shadcn-nuxt"],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || "",
    },
  },
});

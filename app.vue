<script setup lang="ts">
import "@fontsource-variable/noto-sans-jp";

import FullscreenImageViewer from "./components/FullscreenImageViewer.vue";
import { SET_FULLSCREEN_KEY } from "./components/keys";

const navItems: { name: string; path: string }[] = [
  { name: "タイムライン", path: "/" },
];

const imageViewer = ref<InstanceType<typeof FullscreenImageViewer> | null>(
  null
);

provide(SET_FULLSCREEN_KEY, (items: string[], index = 0) => {
  imageViewer.value?.setFullscreen(items, index);
});

const url = useRequestURL();
const baseUrl = url.origin;

useSeoMeta({
  title: "Shion",
  description: "ゆゆゆ勇者部アーカイブビューアー",
  ogImage: {
    url: `${baseUrl}/logo_orig.webp`,
  },
});
</script>

<template>
  <Link rel="icon" href="/favicon.ico" />

  <div class="flex flex-col items-center p-2 sm:p-4">
    <div class="max-w-3xl w-full space-y-2 sm:space-y-4">
      <nav
        class="bg-primary text-primary-foreground text-sm px-2 py-1 shadow rounded flex flex-wrap gap-x-2 z-10 sticky top-2 sm:top-4"
      >
        <NuxtLink to="/" class="font-bold">
          Shion・ゆゆゆ勇者部アーカイブビューアー
        </NuxtLink>

        <ul class="flex gap-2">
          <li v-for="item in navItems" :key="item.name">
            <NuxtLink :to="item.path" class="hover:underline">{{
              item.name
            }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <main>
        <NuxtPage />
      </main>
    </div>
  </div>

  <FullscreenImageViewer ref="imageViewer" />
</template>

<style scoped></style>

<script lang="ts" setup>
import { DOMParser as LinkeDOMParser } from "linkedom";

import { singleValue, siteTitle } from "~/lib/utils";
import type { ArchiveItem } from "~/types";

const route = useRoute();

const { data: item, error } = await useFetch<ArchiveItem>("/api/getItemData", {
  query: { type: "information", id: route.params.id },
});

if (error.value) {
  if (error.value.statusCode === 404)
    throw createError({ statusCode: 404, message: "Item not found" });
  else throw createError({ statusCode: 500, message: "Server error" });
}

const title = ref<string>();
const html = ref<string>();

const runtimeConfig = useRuntimeConfig();

await fetchContentHtml();

useSeoMeta({
  title: title.value ? siteTitle(title.value) : undefined,
});

async function fetchContentHtml() {
  if (!item.value) return;

  const { data, error } = await useFetch("/api/getItemContent", {
    query: {
      type: "information",
      id: item.value.id,
      filename: "content.html",
    },
  });

  if (!error.value) {
    const dom = new LinkeDOMParser().parseFromString(data.value!, "text/html");

    dom.querySelectorAll("[src]").forEach((el: Element) => {
      const origSrc = el.getAttribute("src")!;

      el.setAttribute(
        "src",
        `${runtimeConfig.public.baseUrl}/data/information/${
          item.value!.id
        }/${origSrc}`
      );
    });

    title.value = dom.querySelector("title")?.textContent ?? undefined;
    html.value = dom.querySelector("body")?.innerHTML ?? undefined;
  }
}
</script>

<template>
  <article v-if="item" class="space-y-4">
    <header class="flex flex-col items-start">
      <NuxtLink
        to="/information"
        class="text-sm text-muted-foreground flex items-center transition-colors hover:text-primary"
      >
        <Icon name="lucide:chevron-left" class="text-lg" />
        <span>最新情報</span>
      </NuxtLink>

      <div class="font-bold text-2xl">
        {{ title }}
      </div>
    </header>

    <article class="bg-card rounded shadow p-4 space-y-4">
      <div class="flex items-center gap-2">
        <Badge
          v-if="item.relationships?.category?.data"
          :style="{
            backgroundColor: singleValue(item.relationships.category.data)
              .attributes?.color,
          }"
          >{{
            singleValue(item.relationships.category.data).attributes?.name
          }}</Badge
        >
        <time
          v-if="item.attributes?.announcedDate"
          :datetime="item.attributes.announcedDate"
          class="text-sm"
        >
          {{
            new Date(item.attributes.announcedDate).toLocaleDateString("ja-JP")
          }}
        </time>
      </div>

      <div class="prose video-content" v-html="html" />
    </article>
  </article>
</template>

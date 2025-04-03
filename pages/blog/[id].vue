<script lang="ts" setup>
import { DOMParser as LinkeDOMParser } from "linkedom";

import { singleValue, siteTitle, withBaseUrl } from "~/lib/utils";
import type { ArchiveItem } from "~/types";

const route = useRoute();

const { data: item, error } = await useFetch<ArchiveItem>("/api/getItemData", {
  query: { type: "article", id: route.params.id },
});

if (error.value) {
  if (error.value.statusCode === 404)
    throw createError({ statusCode: 404, message: "Item not found" });
  else throw createError({ statusCode: 500, message: "Server error" });
}

const title = ref<string>();
const html = ref<string>();

const artist = computed(() =>
  singleValue(item.value!.relationships?.artist?.data)
);

await fetchContentHtml();

useSeoMeta({
  title: title.value ? siteTitle(title.value) : undefined,
});

async function fetchContentHtml() {
  if (!item.value) return;

  const { data, error } = await useFetch("/api/getItemContent", {
    query: {
      type: "article",
      id: item.value.id,
      filename: "content.html",
    },
  });

  if (!error.value) {
    const dom = new LinkeDOMParser().parseFromString(data.value!, "text/html");

    dom.querySelectorAll("[src]").forEach((el: Element) => {
      const origSrc = el.getAttribute("src");

      if (origSrc)
        el.setAttribute("src", `/data/article/${item.value!.id}/${origSrc}`);
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
        to="/blog"
        class="text-sm text-muted-foreground flex items-center transition-colors hover:text-primary"
      >
        <Icon name="lucide:chevron-left" class="text-lg" />
        <span>ブログ</span>
      </NuxtLink>

      <div class="font-bold text-2xl">
        {{ title }}
      </div>
    </header>

    <article class="bg-card rounded shadow p-4 space-y-4">
      <div class="flex items-center gap-2">
        <div v-if="artist" class="flex gap-2 items-center">
          <Avatar class="size-8">
            <AvatarImage
              :src="withBaseUrl(`/data/user/${artist.id}/medium.jpg`)"
            />
            <AvatarFallback>{{ artist.attributes?.name }}</AvatarFallback>
          </Avatar>
          <div class="font-bold text-sm">
            {{ artist.attributes?.name }}
          </div>
        </div>

        <time
          v-if="item.attributes?.publishDate"
          :datetime="item.attributes.publishDate"
          class="text-sm"
        >
          {{
            new Date(item.attributes.publishDate).toLocaleDateString("ja-JP")
          }}
        </time>
      </div>

      <div class="prose" v-html="html" />
    </article>
  </article>
</template>

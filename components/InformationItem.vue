<script lang="ts" setup>
import { DOMParser as LinkeDOMParser } from "linkedom";

import { singleValue, withBaseUrl } from "~/lib/utils";
import type { ArchiveItem } from "~/types";

const props = defineProps<{
  item: ArchiveItem;
}>();

const { item } = toRefs(props);

const title = ref<string>();

await fetchContentHtml();

async function fetchContentHtml() {
  const { data, error } = await useFetch("/api/getItemContent", {
    query: {
      type: "information",
      id: item.value.id,
      filename: "content.html",
    },
  });

  if (!error.value) {
    const dom = new LinkeDOMParser().parseFromString(data.value!, "text/html");

    title.value = dom.querySelector("title")?.textContent ?? undefined;
  }
}
</script>

<template>
  <NuxtLink :to="`/information/${item.id}`">
    <article
      class="bg-card shadow rounded p-4 flex items-center gap-4 transition-transform hover:scale-[102%]"
    >
      <img
        :src="
          item.relationships?.thumbnail?.data
            ? withBaseUrl(
                `/data/thumbnail/${
                  singleValue(item.relationships.thumbnail.data).id
                }/medium.jpg`
              )
            : 'placeholder_icon.webp'
        "
        class="rounded-full aspect-square object-cover h-20"
      />
      <div class="space-y-2">
        <Badge
          v-if="item.relationships?.category?.data"
          :style="{
            backgroundColor: singleValue(item.relationships.category.data)
              .attributes?.color,
          }"
        >
          {{ singleValue(item.relationships.category.data).attributes?.name }}
        </Badge>
        <div class="text-sm">{{ title }}</div>
        <time
          v-if="item.attributes?.announcedDate"
          :datetime="item.attributes.announcedDate"
          class="text-xs text-muted-foreground"
        >
          {{
            new Date(item.attributes.announcedDate).toLocaleDateString("ja-JP")
          }}
        </time>
      </div>
    </article>
  </NuxtLink>
</template>

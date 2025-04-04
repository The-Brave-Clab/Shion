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
      type: "video",
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
  <NuxtLink :to="`/video/${item.id}`">
    <article
      class="bg-card rounded shadow overflow-hidden transition-transform hover:scale-[102%]"
    >
      <div class="aspect-video relative">
        <img
          v-if="item.relationships?.thumbnail?.data"
          :src="
            withBaseUrl(
              `/data/thumbnail/${
                singleValue(item.relationships.thumbnail.data).id
              }/medium.jpg`
            )
          "
          class="size-full object-cover"
        />
        <Icon
          name="mdi:play"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-primary-foreground shadow"
        />
      </div>
      <div class="p-4 font-bold text-xs">{{ title }}</div>
    </article>
  </NuxtLink>
</template>

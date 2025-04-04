<script lang="ts" setup>
import { DOMParser as LinkeDOMParser } from "linkedom";

import { singleValue, withBaseUrl } from "~/lib/utils";
import type { ArchiveItem } from "~/types";

const props = defineProps<{
  item: ArchiveItem;
}>();

const { item } = toRefs(props);

const title = ref<string>();
const textContent = ref<string>();

const description = computed(() => {
  if (textContent.value) {
    return (
      textContent.value.substring(0, 50) +
      (textContent.value.length > 50 ? "..." : "")
    );
  } else return "";
});

const artist = computed(() =>
  singleValue(item.value.relationships?.artist?.data)
);

await fetchContentHtml();

async function fetchContentHtml() {
  const { data, error } = await useFetch("/api/getItemContent", {
    query: {
      type: "article",
      id: item.value.id,
      filename: "content.html",
    },
  });

  if (!error.value) {
    const dom = new LinkeDOMParser().parseFromString(data.value!, "text/html");

    title.value = dom.querySelector("title")?.textContent ?? undefined;
    textContent.value = dom.querySelector("body")?.textContent ?? undefined;
  }
}
</script>

<template>
  <NuxtLink :to="`/blog/${item.id}`">
    <article
      class="bg-card rounded shadow p-4 grid grid-cols-[auto_7rem] gap-x-2 gap-y-4 transition-transform hover:scale-[102%]"
    >
      <div class="flex-1 space-y-2">
        <div class="font-bold text-sm">{{ title }}</div>
        <div class="text-xs">
          {{ description }}
        </div>
      </div>
      <div>
        <img
          v-if="item.relationships?.thumbnail?.data"
          :src="
            withBaseUrl(
              `/data/thumbnail/${
                singleValue(item.relationships.thumbnail.data).id
              }/small.png`
            )
          "
          class="w-full aspect-square object-cover rounded"
        />
      </div>

      <div class="flex-1 flex gap-2 items-center">
        <template v-if="artist">
          <Avatar class="size-6">
            <AvatarImage
              :src="withBaseUrl(`/data/user/${artist.id}/medium.jpg`)"
            />
            <AvatarFallback>{{ artist.attributes?.name }}</AvatarFallback>
          </Avatar>
          <div class="font-bold text-xs text-muted-foreground">
            {{ artist.attributes?.name }}
          </div>
        </template>
      </div>
      <div class="text-xs">
        <time
          v-if="item.attributes?.publishDate"
          :datetime="item.attributes.publishDate"
          >{{
            new Date(item.attributes.publishDate).toLocaleDateString("ja-JP")
          }}</time
        >
      </div>
    </article>
  </NuxtLink>
</template>

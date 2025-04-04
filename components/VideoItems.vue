<script lang="ts" setup>
import type { ArchiveItem } from "@/types";
import { videoCategories } from "./common";

const items = ref<ArchiveItem[]>([]);

const currentCategory = ref<string | undefined>();

const filteredItems = computed(() => {
  if (currentCategory.value) {
    return items.value.filter(
      (item) => item.attributes!.categoryID === currentCategory.value
    );
  } else return items.value;
});

await fetchItems();

async function fetchItems() {
  const { data } = await useFetch("/api/items/video");

  if (data.value) items.value = data.value;
}
</script>

<template>
  <div class="space-y-4">
    <p class="font-bold text-4xl px-2">動画</p>
    <CategoryFilterSelector
      v-model="currentCategory"
      :categories="videoCategories"
      class="px-2"
    />
    <div
      :key="currentCategory"
      class="grid grid-cols-2 gap-2 items-start md:grid-cols-3 sm:gap-4"
    >
      <VideoItem v-for="item in filteredItems" :key="item.id" :item />
    </div>
  </div>
</template>

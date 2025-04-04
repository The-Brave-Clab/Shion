<script lang="ts" setup>
import type { ArchiveItem } from "@/types";

const categories = [
  { label: "ラジオ", value: "e0a03a02-c90a-476e-ae03-acfc80503a0a" },
  { label: "PV", value: "752d6469-f447-43ec-bf22-77bf88e7d13c" },
];

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
  const { data } = await useFetch("/api/items/video", { retry: 3 });

  if (data.value) items.value = data.value;
}
</script>

<template>
  <div class="space-y-4">
    <p class="font-bold text-4xl px-2">動画</p>
    <CategoryFilterSelector
      v-model="currentCategory"
      :categories
      class="px-2"
    />
    <div :key="currentCategory" class="grid grid-cols-2 gap-2 items-start md:grid-cols-3 sm:gap-4">
      <VideoItem v-for="item in filteredItems" :key="item.id" :item />
    </div>
  </div>
</template>

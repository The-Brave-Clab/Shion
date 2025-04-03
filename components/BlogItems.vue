<script lang="ts" setup>
import type { ArchiveItem } from "@/types";

const categories = [
  { label: "ブログ", value: "2622ab87-92d9-4114-ac72-5489e8888586" },
  { label: "KV", value: "999a0e4a-a8d8-48e7-8b7c-d39c6da4f286" },
];

const items = ref<ArchiveItem[]>([]);
const loading = ref(true);

const currentCategory = ref<string | undefined>();

const filteredItems = computed(() => {
  if (currentCategory.value) {
    return items.value.filter(
      (item) => item.attributes!.categoryID === currentCategory.value
    );
  } else return items.value;
});

// await fetchItems();

async function fetchItems() {
  const { data } = await useFetch("/api/items/article", { retry: 3 });

  if (data.value) items.value = data.value;
  loading.value = false;
}
</script>

<template>
  <div class="space-y-4">
    <p class="font-bold text-4xl px-2">ブログ</p>
    <CategoryFilterSelector
      v-model="currentCategory"
      :categories
      class="px-2"
    />
    <div :key="currentCategory" class="flex flex-col gap-4">
      <BlogItem v-for="item in filteredItems" :key="item.id" :item />
    </div>
  </div>
</template>

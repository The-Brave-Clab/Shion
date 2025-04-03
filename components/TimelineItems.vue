<script setup lang="ts">
import type { ArchiveItem } from "@/types";

const items = ref<ArchiveItem[]>([]);
const loading = ref(true);

// await fetchItems();

async function fetchItems() {
  const { data } = await useFetch("/api/items/tlPost", { retry: 3 });

  if (data.value) items.value = data.value;
  loading.value = false;
}
</script>

<template>
  <div class="space-y-4">
    <p class="font-bold text-4xl px-2">タイムライン</p>
    <div class="flex flex-col gap-4">
      <TimelineItem v-for="item in items" :key="item.id" :item />
    </div>
  </div>
</template>

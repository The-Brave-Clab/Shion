<script lang="ts" setup>
import type { ArchiveItem } from "@/types";
import { singleValue } from "~/lib/utils";

const items = ref<ArchiveItem[]>([]);
const informationCategories = ref<ArchiveItem[]>([]);

const currentCategory = ref<string | undefined>();

const filteredItems = computed(() => {
  if (currentCategory.value) {
    return items.value.filter(
      (item) =>
        singleValue(item.relationships?.category?.data)?.id ===
        currentCategory.value
    );
  } else return items.value;
});

const informationCategoryItems = computed(() =>
  informationCategories.value.map((c) => ({
    label: c.attributes!.name,
    value: c.id,
  }))
);

{
  const { data } = await useFetch("/api/items/information");
  const { data: categories } = await useFetch("/api/items/informationCategory");

  if (data.value) items.value = data.value;
  if (categories.value) informationCategories.value = categories.value;
}
</script>

<template>
  <div class="space-y-4">
    <p class="font-bold text-4xl px-2">最新情報</p>
    <CategoryFilterSelector
      v-model="currentCategory"
      :categories="informationCategoryItems"
      class="px-2"
    />
    <div :key="currentCategory" class="flex flex-col gap-2">
      <InformationItem v-for="item in filteredItems" :key="item.id" :item />
    </div>
  </div>
</template>

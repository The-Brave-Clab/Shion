<script lang="ts" setup>
import Badge from "./ui/badge/Badge.vue";

type Category = { label: string; value: string | undefined };

const props = defineProps<{
  categories: Category[];
}>();

const { categories } = toRefs(props);

const model = defineModel<string | undefined>();

const filterBadges = computed(() => {
  return [{ label: "すべて", value: undefined }, ...categories.value];
});
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="item in filterBadges"
      :key="item.value"
      @click="model = item.value"
    >
      <Badge :variant="item.value === model ? 'default' : 'outline'">
        {{ item.label }}
      </Badge>
    </button>
  </div>
</template>

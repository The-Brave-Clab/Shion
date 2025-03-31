<script lang="ts" setup>
import { inject } from "vue";

import { withBaseUrl } from "~/lib/utils";
import type { ArchiveItem } from "~/types";

import { SET_FULLSCREEN_KEY } from "./keys";

const props = defineProps<{
  items: ArchiveItem[];
}>();

const setFullscreen = inject(SET_FULLSCREEN_KEY);

const onSetFullscreen = (index: number = 0) => {
  setFullscreen?.(
    props.items.map((item) =>
      withBaseUrl(
        `/data/photo/${item.id}/original.${item.attributes?.path
          .split(".")
          .pop()}`
      )
    ),
    index
  );
};
</script>

<template>
  <div class="h-64 md:h-96">
    <img
      v-if="items.length === 1"
      :src="withBaseUrl(`/data/photo/${items[0].id}/large.jpg`)"
      class="size-full object-cover cursor-pointer"
      loading="lazy"
      @click="onSetFullscreen()"
    />
    <div
      v-else-if="items.length === 2"
      class="size-full grid grid-cols-2 gap-1"
    >
      <img
        v-for="(item, i) in items"
        :key="item.id"
        :src="withBaseUrl(`/data/photo/${item.id}/large.jpg`)"
        class="size-full object-cover cursor-pointer"
        loading="lazy"
        @click="onSetFullscreen(i)"
      />
    </div>
    <div
      v-else-if="items.length === 3"
      class="size-full grid grid-cols-2 grid-rows-2 gap-1"
    >
      <img
        v-for="(item, i) in items"
        :key="item.id"
        :src="withBaseUrl(`/data/photo/${item.id}/large.jpg`)"
        :class="[
          'size-full object-cover cursor-pointer',
          {
            'row-span-2': i === 0,
          },
        ]"
        loading="lazy"
        @click="onSetFullscreen(i)"
      />
    </div>
    <div v-else-if="items.length >= 4" class="size-full grid grid-cols-2 gap-1">
      <img
        v-for="(item, i) in items.slice(0, 4)"
        :key="item.id"
        :src="withBaseUrl(`/data/photo/${item.id}/large.jpg`)"
        class="size-full object-cover cursor-pointer"
        loading="lazy"
        @click="onSetFullscreen(i)"
      />
    </div>
  </div>
</template>

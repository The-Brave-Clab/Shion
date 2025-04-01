<script lang="ts" setup>
import { computed, ref, toRefs } from "vue";

import Avatar from "./ui/avatar/Avatar.vue";
import AvatarImage from "./ui/avatar/AvatarImage.vue";
import AvatarFallback from "./ui/avatar/AvatarFallback.vue";
import Progress from "./ui/progress/Progress.vue";
import TimelinePostPhotos from "./TimelinePostPhotos.vue";

import { arrayValue, singleValue, withBaseUrl } from "~/lib/utils";
import type { ArchiveItem } from "@/types";

const props = defineProps<{
  item: ArchiveItem;
}>();

const { item } = toRefs(props);

const postText = ref<string>();
const postTextLoading = ref(true);

const artist = computed(() =>
  singleValue(item.value.relationships?.artist?.data)
);

const choices = computed(() =>
  arrayValue(
    singleValue(item.value.relationships?.poll?.data)?.relationships?.choices
      ?.data
  )
    .filter((choice) => choice !== undefined && choice !== null)
    .sort((a, b) => a.attributes!.position - b.attributes!.position)
);

const totalVotes = computed(() =>
  choices.value.reduce((a, b) => a + b.attributes!.count, 0)
);

const mostVoted = computed(
  () =>
    [...choices.value].sort(
      (a, b) => b.attributes!.count - a.attributes!.count
    )[0]
);

await fetchText();

async function fetchText() {
  const { data, error } = await useFetch("/api/getTlPostText", {
    query: {
      id: item.value.id,
    },
  });

  if (!error.value) postText.value = data.value ?? undefined;

  postTextLoading.value = false;
}
</script>

<template>
  <article class="bg-card rounded shadow">
    <div v-if="artist" class="px-4 py-1.5 flex gap-2 items-center">
      <Avatar class="size-8">
        <AvatarImage :src="withBaseUrl(`/data/user/${artist.id}/medium.jpg`)" />
        <AvatarFallback>{{ artist.attributes?.name }}</AvatarFallback>
      </Avatar>
      <div class="font-bold text-sm">
        {{ artist.attributes?.name }}
      </div>
      <time
        v-if="item.attributes?.publishedAt"
        class="text-xs"
        :datetime="item.attributes.publishedAt"
      >
        {{
          new Date(item.attributes.publishedAt).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        }}
      </time>
    </div>

    <TimelinePostPhotos
      v-if="
        item.relationships?.photos?.data &&
        arrayValue(item.relationships.photos.data).length
      "
      :items="arrayValue(item.relationships.photos.data)"
    />

    <div
      v-if="postText"
      class="p-4 text-sm whitespace-pre-wrap"
      v-text="postText"
    />
    <Icon
      v-else-if="postTextLoading"
      name="svg-spinners:3-dots-bounce"
      class="mx-auto my-4"
    />

    <div v-if="choices.length" class="p-4">
      <ul class="space-y-2">
        <li v-for="choice in choices" :key="choice.id" class="space-y-1">
          <div class="flex justify-between items-center text-sm">
            <span>{{ choice.attributes!.label }}</span>
            <span>{{
              `${
                Math.round((choice.attributes!.count / totalVotes) * 100 * 10) /
                10
              } %`
            }}</span>
          </div>
          <Progress
            :model-value="(choice.attributes!.count / totalVotes) * 100"
            :class="{ grayscale: choice.id !== mostVoted.id }"
          />
        </li>
      </ul>
    </div>
  </article>
</template>

<script lang="ts" setup>
const isFullscreen = ref(false);

const items = ref<string[]>();
const currentIndex = ref(0);

const setFullscreen = (_items: string[], index: number = 0) => {
  isFullscreen.value = true;

  items.value = _items;
  currentIndex.value = index;
};

const closeFullscreen = () => {
  isFullscreen.value = false;
  items.value = undefined;
  currentIndex.value = 0;
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % items.value!.length;
};

const prevImage = () => {
  currentIndex.value =
    (currentIndex.value - 1 + items.value!.length) % items.value!.length;
};

defineExpose({
  setFullscreen,
});
</script>

<template>
  <Teleport to="body">
    <Transition>
      <div
        v-if="items && isFullscreen"
        class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20"
      >
        <div
          v-if="items.length > 1"
          class="absolute top-0 left-4 bottom-0 flex items-center"
        >
          <button class="z-30 fullscreen-widget-style">
            <Icon
              name="lucide:chevron-left"
              class="text-3xl"
              @click="prevImage"
            />
          </button>
        </div>

        <div
          v-if="items.length > 1"
          class="absolute top-0 right-4 bottom-0 flex items-center"
        >
          <button class="z-30 fullscreen-widget-style">
            <Icon
              name="lucide:chevron-right"
              class="text-3xl"
              @click="nextImage"
            />
          </button>
        </div>

        <button
          class="absolute left-4 top-4 z-30 fullscreen-widget-style"
          @click="closeFullscreen"
        >
          <Icon name="lucide:x" class="text-xl" />
        </button>

        <div
          class="absolute right-4 top-4 z-30 text-sm fullscreen-widget-style !py-1.5"
        >
          {{ `${currentIndex + 1} / ${items.length}` }}
        </div>

        <div class="absolute inset-0 bg-black/30" @click="closeFullscreen()" />

        <img
          v-for="(src, i) in items"
          v-show="i === currentIndex"
          :key="src"
          :src
          class="max-w-full max-h-full z-20"
        />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fullscreen-widget-style {
  @apply bg-black/50 text-primary-foreground rounded-full p-2 flex justify-center items-center;
}

button.fullscreen-widget-style {
  @apply transition-colors hover:bg-black/60;
}

.v-enter-active,
.v-leave-active {
  @apply transition-all;
}

.v-enter-from,
.v-leave-to {
  @apply -translate-y-24 opacity-0;
}
</style>

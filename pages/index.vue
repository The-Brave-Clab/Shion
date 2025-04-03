<script lang="ts" setup>
import { siteTitle } from "~/lib/utils";

useSeoMeta({
  title: siteTitle("タイムライン"),
});
</script>

<template>
  <TimelineItems />
</template>

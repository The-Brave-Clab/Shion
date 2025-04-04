<script lang="ts" setup>
import { siteTitle } from "~/lib/utils";

useSeoMeta({
  title: siteTitle("動画"),
});
</script>

<template>
  <VideoItems />
</template>

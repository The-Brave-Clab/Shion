<script lang="ts" setup>
import { siteTitle } from "~/lib/utils";

useSeoMeta({
  title: siteTitle("ブログ"),
});
</script>

<template>
  <BlogItems />
</template>

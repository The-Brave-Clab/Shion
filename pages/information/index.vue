<script lang="ts" setup>
import { siteTitle } from "~/lib/utils";

useSeoMeta({
  title: siteTitle("最新情報"),
});
</script>

<template>
  <InformationItems />
</template>

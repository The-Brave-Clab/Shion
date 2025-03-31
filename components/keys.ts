import type { InjectionKey } from "vue";
import type FullscreenImageViewer from "./FullscreenImageViewer.vue";

export const SET_FULLSCREEN_KEY: InjectionKey<
  InstanceType<typeof FullscreenImageViewer>["setFullscreen"]
> = Symbol();

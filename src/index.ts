import { createApp } from "vue";
import { router } from "./routing/router.ts";
import ui from "@nuxt/ui/vue-plugin";
import App from "./App.vue";
import "../css/main.css";
import { registerSW } from "virtual:pwa-register";
import { Icon } from '@iconify/vue'

if (import.meta.env.PROD) {
    registerSW({
        immediate: true,
    });
}


createApp(App)
    .use(router)
    .use(ui)
    .component('Icon', Icon)
    .mount("#app");

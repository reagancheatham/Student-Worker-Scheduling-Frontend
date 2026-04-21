import { createApp } from "vue";
import { router } from "./routing/router.ts";
import ui from "@nuxt/ui/vue-plugin";
import App from "./App.vue";
import "../css/main.css";
import { Icon } from '@iconify/vue'

createApp(App)
    .use(router)
    .use(ui)
    .component('Icon', Icon)
    .mount("#app");

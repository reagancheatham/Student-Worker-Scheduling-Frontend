import { createApp } from "vue";
import { router } from "./routing/router.ts";
import ui from "@nuxt/ui/vue-plugin";
import App from "./App.vue";

createApp(App)
.use(router)
.use(ui)
.mount("#app");

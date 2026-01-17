import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";

export default defineConfig(({ mode }) => {
    let baseURL = "";

    if (mode === "development") baseURL = "/";
    else baseURL = "whatever we need here";

    return {
        plugins: [vue(), ui()],
        server: {
            host: "localhost",
            port: 8081,
        },
        base: baseURL,
    };
});

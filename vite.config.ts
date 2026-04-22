import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";

export default defineConfig(({ mode }) => {
    let baseURL = "";

    if (mode === "development") baseURL = "/";
    else baseURL = "/sev2026/t6/";

    return {
        plugins: [
            vue(),
            ui({
                theme: {
                    colors: [
                        "primary",
                        "secondary",
                        "info",
                        "success",
                        "warning",
                        "error",
                        "event-blue",
                        "event-orange",
                        "event-red",
                        "event-yellow",
                        "event-purple",
                    ],
                },
                ui: {
                    icons: {
                        collections: ["simple-icons"],
                    },
                    colors: {
                        "event-blue": "sky",
                        "event-orange": "orange",
                        "event-red": "red",
                        "event-yellow": "yellow",
                        "event-purple": "purple",
                    },
                },
                autoImport: {},
            }),
        ],
        server: {
            host: "localhost",
            port: 8081,
        },
        base: baseURL,
        resolve: {
            alias: {
                "@components": fileURLToPath(
                    new URL("./src/components", import.meta.url),
                ),
                "@classes": fileURLToPath(
                    new URL("./src/classes", import.meta.url),
                ),
            },
        },
    };
});

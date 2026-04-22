import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
    let baseURL = "";

    if (mode === "development") {
        baseURL = "/";
    } else {
        baseURL = "/sev2026/t6/";
    }

    return {
        plugins: [
            vue(),
            ui({
                icons: {
                    collections: ["simple-icons"],
                },
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
                        "event-mist",
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
                        "event-mist": "mist",
                    },
                },
                autoImport: {},
            }),
            VitePWA({
                registerType: "autoUpdate",
                includeAssets: ["avatar.png", "OC.png", "mobileOC.png"],
                manifest: false,
                workbox: {
                    globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
                },
                devOptions: {
                    enabled: false,
                },
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

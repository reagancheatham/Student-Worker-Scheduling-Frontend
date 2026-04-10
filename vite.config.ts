import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
    let baseURL = "";
    let pwaStartURL = "";

    if (mode === "development") {
        baseURL = "/";
        pwaStartURL = "/mobile/homePage";
    } else {
        baseURL = "/sev2026/t6/";
        pwaStartURL = "/sev2026/t6/mobile/homePage";
    }

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
                    colors: {
                        "event-blue": "sky",
                        "event-orange": "orange",
                        "event-red": "red",
                        "event-yellow": "yellow",
                        "event-purple": "purple",
                    },
                },
                autoImport: true,
            }),
            VitePWA({
                registerType: "autoUpdate",
                includeAssets: ["avatar.png", "OC.png", "mobileOC.png"],
                manifest: {
                    name: "Student Worker Scheduling",
                    short_name: "SWS",
                    description:
                        "Manage student worker scheduling on desktop or mobile.",
                    theme_color: "#0b1220",
                    background_color: "#ffffff",
                    display: "standalone",
                    start_url: pwaStartURL,
                    scope: baseURL,
                    icons: [
                        {
                            src: "avatar.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "any maskable",
                        },
                    ],
                },
                workbox: {
                    globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
                },
                devOptions: {
                    enabled: false,
                },
            }),
        ],
        server: {
            host: "0.0.0.0",
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

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
    let baseURL = "";

    if (mode === "development") baseURL = "/";
    else baseURL = "whatever we need here";

    return {
        plugins: [
            vue(),
            ui(),
            VitePWA({
                devOptions: {
                    enabled: true,
                },
                registerType: "autoUpdate",
                includeAssets: [
                    "favicon.ico",
                    "apple-touch-icon.png",
                    "mask-icon.svg",
                ],
                manifest: {
                    name: "Student Worker Scheduling",
                    short_name: "MyApp",
                    description: "Student Worker Scheduling",
                    theme_color: "#ffffff",
                    start_url: "/",
                    icons: [
                        {
                            src: "/media/test_photo.png",
                            sizes: "192x192",
                            type: "image/png",
                        },
                        {
                            src: "/media/test_photo.png",
                            sizes: "512x512",
                            type: "image/png",
                        },
                    ],
                    screenshots: [
                        {
                            src: "/media/test_photo.png",
                            sizes: "1280x720",
                            type: "image/png",
                            form_factor: "wide",
                        },
                        {
                            src: "/media/test_photo.png",
                            sizes: "390x844",
                            type: "image/png",
                        },
                    ],
                },
            }),
        ],
    };
});

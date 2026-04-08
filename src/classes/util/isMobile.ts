import { ref, onMounted, onUnmounted } from "vue";

/*
TODO: rewrite to use 
const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone === true; // iOS support

Right now i dont have an emulator so im doing this which technically works but i think that other solution is better at times
*/
export function isMobileApp() {
    const isMobile = ref(false);

    const update = () => {
        isMobile.value = window.innerWidth <= 768;
    };

    onMounted(() => {
        update();
        window.addEventListener("resize", update);
    });

    onUnmounted(() => {
        window.removeEventListener("resize", update);
    });

    return isMobile;
}

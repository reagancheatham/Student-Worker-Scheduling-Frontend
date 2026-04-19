import { ref } from "vue";

export class TempStore {
    public static refIsLoading = ref<boolean>(false);

    public static get isLoading() {
        return TempStore.refIsLoading.value;
    }

    public static set isLoading(value: boolean) {
        TempStore.refIsLoading.value = value;
    }
}
import { EventStyleData } from "./eventStyleData.ts";

export type GetClassFunc = (styleData: EventStyleData) => string;
export type GetStyleFunc = (styleData: EventStyleData) => any;
export type GetLabelFunc = (styleData: EventStyleData) => string;
export type UpdateBackendFunc = (styleData: EventStyleData) => void;
import { createRouter, createWebHistory } from "vue-router";
import { Routes } from './routes.ts';

export const router = createRouter({
    history: createWebHistory(),
    routes: Routes,
});

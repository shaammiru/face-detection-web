import { createRouter, createWebHistory } from "vue-router";
import FaceList from "./pages/FaceList.vue";
import RegisterFace from "./pages/RegisterFace.vue";

const routes = [
  { path: "/", name: "FaceList", component: FaceList },
  { path: "/register", name: "RegisterFace", component: RegisterFace },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

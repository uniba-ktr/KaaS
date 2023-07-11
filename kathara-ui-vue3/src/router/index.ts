import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home Page",
      component: () => import("../views/HomePage.vue"),
      /*meta: {
        requireLogin: true,
      },*/
    },
    {
      path: "/login",
      name: "Login Page",
      component: () => import("../views/LoginPage.vue"),
    },
    {
      path: "/register",
      name: "Register Page",
      component: () => import("../views/RegisterPage.vue"),
    },
    // Always leave this as last one,
    // but you can also remove it
    {
      path: "/:catchAll(.*)*",
      component: () => import("../views/PageNotFound.vue"),
    },
  ],
});

export default router;

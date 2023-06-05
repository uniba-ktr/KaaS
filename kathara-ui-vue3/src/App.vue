<script setup lang="ts">
import { useAppOptionStore } from "@/stores/app-option";
import { useAuthStore } from "@/stores/app-auth";
import AppSidebar from "@/components/app/Sidebar.vue";
import AppHeader from "@/components/app/Header.vue";
import AppFooter from "@/components/app/Footer.vue";
import router from "./router";

const appOption = useAppOptionStore();
const store = useAuthStore();

router.beforeEach(async (to, from, next) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  await store.CHECK_TOKEN().catch(() => {});
  const destination = to.name;
  const requiresLogin = to.meta.requireLogin;
  const isAuthenticated = store.isAuthenticated;

  // routing rules
  if (destination === "Login Page" || destination === "Register Page") {
    if (isAuthenticated) next({ name: "Home Page" });
    else next();
  } else {
    if (requiresLogin) {
      if (isAuthenticated) next();
      else next({ path: "/login", query: { to: to.path } });
    } else next();
  }
});

document.querySelector("body")?.classList.add("app-init");
</script>

<template>
  <div
    class="app"
    v-bind:class="{
      'app-header-menu-search-toggled': appOption.appHeaderSearchToggled,
      'app-sidebar-toggled': appOption.appSidebarToggled,
      'app-sidebar-collapsed': appOption.appSidebarCollapsed,
      'app-sidebar-mobile-toggled': appOption.appSidebarMobileToggled,
      'app-sidebar-mobile-closed': appOption.appSidebarMobileClosed,
      'app-content-full-height': appOption.appContentFullHeight,
      'app-content-full-width': appOption.appSidebarHide,
      'app-without-sidebar': appOption.appSidebarHide,
      'app-without-header': appOption.appHeaderHide,
      'app-boxed-layout': appOption.appBoxedLayout,
      'app-footer-fixed': appOption.appFooterFixed,
    }"
  >
    <vue3-progress-bar />
    <app-header v-if="!appOption.appHeaderHide" />
    <app-sidebar v-if="!appOption.appSidebarHide" />
    <div class="app-content" v-bind:class="appOption.appContentClass">
      <router-view></router-view>
    </div>
    <app-footer v-if="appOption.appFooter" />
  </div>
</template>

<script setup lang="ts">
import { useAppOptionStore } from "@/stores/app-option";
import { RouterLink } from "vue-router";

const appOption = useAppOptionStore();
const app_title = import.meta.env.VITE_APP_TITLE;
const notificationData = [
  {
    icon: "bi bi-bag text-theme",
    title: "NEW ORDER RECEIVED ($1,299)",
    time: "JUST NOW",
  },
  {
    icon: "bi bi-person-circle text-theme",
    title: "3 NEW ACCOUNT CREATED",
    time: "2 MINUTES AGO",
  },
  {
    icon: "bi bi-gear text-theme",
    title: "SETUP COMPLETED",
    time: "3 MINUTES AGO",
  },
  {
    icon: "bi bi-grid text-theme",
    title: "WIDGET INSTALLATION DONE",
    time: "5 MINUTES AGO",
  },
  {
    icon: "bi bi-credit-card text-theme",
    title: "PAYMENT METHOD ENABLED",
    time: "10 MINUTES AGO",
  },
];

function toggleAppSidebarCollapsed() {
  if (appOption.appSidebarCollapsed) {
    appOption.appSidebarToggled = !appOption.appSidebarToggled;
  } else if (appOption.appSidebarToggled) {
    appOption.appSidebarToggled = !appOption.appSidebarToggled;
  }
  appOption.appSidebarCollapsed = !appOption.appSidebarCollapsed;
}
function toggleAppSidebarMobileToggled() {
  appOption.appSidebarMobileToggled = !appOption.appSidebarMobileToggled;
}
function toggleAppHeaderSearch(event) {
  event.preventDefault();

  appOption.appHeaderSearchToggled = !appOption.appHeaderSearchToggled;
}
function checkForm(event) {
  event.preventDefault();
  this.$router.push({ path: "/extra/search" });
}
</script>
<template>
  <div id="header" class="app-header">
    <!-- BEGIN desktop-toggler -->
    <div class="desktop-toggler">
      <button
        type="button"
        class="menu-toggler"
        v-on:click="toggleAppSidebarCollapsed"
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
    <!-- BEGIN desktop-toggler -->

    <!-- BEGIN mobile-toggler -->
    <div class="mobile-toggler">
      <button
        type="button"
        class="menu-toggler"
        v-on:click="toggleAppSidebarMobileToggled"
      >
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
    <!-- END mobile-toggler -->

    <!-- BEGIN brand -->
    <div class="brand">
      <RouterLink to="/" class="brand-logo">
        <span class="brand-img">
          <span class="brand-img-text text-theme">KE</span>
        </span>
        <span class="brand-text">{{ app_title }}</span>
      </RouterLink>
    </div>
    <!-- END brand -->

    <!-- BEGIN menu -->
    <div class="menu">
      <div class="menu-item dropdown dropdown-mobile-full">
        <a
          href="#"
          data-bs-toggle="dropdown"
          data-bs-display="static"
          class="menu-link"
        >
          <div class="menu-img online">
            <img src="/assets/img/user/profile.jpg" alt="Profile" height="60" />
          </div>
          <div class="menu-text d-sm-block d-none">username@account.com</div>
        </a>
        <div class="dropdown-menu dropdown-menu-end me-lg-3 fs-11px mt-1">
          <RouterLink
            to="/profile"
            class="dropdown-item d-flex align-items-center"
            >PROFILE
            <i class="bi bi-person-circle ms-auto text-theme fs-16px my-n1"></i
          ></RouterLink>
          <RouterLink
            to="/email/inbox"
            class="dropdown-item d-flex align-items-center"
            >INBOX
            <i class="bi bi-envelope ms-auto text-theme fs-16px my-n1"></i
          ></RouterLink>
          <RouterLink
            to="/calendar"
            class="dropdown-item d-flex align-items-center"
            >CALENDAR
            <i class="bi bi-calendar ms-auto text-theme fs-16px my-n1"></i
          ></RouterLink>
          <RouterLink
            to="/settings"
            class="dropdown-item d-flex align-items-center"
            >SETTINGS <i class="bi bi-gear ms-auto text-theme fs-16px my-n1"></i
          ></RouterLink>
          <div class="dropdown-divider"></div>
          <RouterLink
            to="/page/login"
            class="dropdown-item d-flex align-items-center"
            >LOGOUT
            <i class="bi bi-toggle-off ms-auto text-theme fs-16px my-n1"></i
          ></RouterLink>
        </div>
      </div>
    </div>
    <!-- END menu -->

    <!-- BEGIN menu-search -->
    <form class="menu-search" name="header_search_form" v-on:submit="checkForm">
      <div class="menu-search-container">
        <div class="menu-search-icon"><i class="bi bi-search"></i></div>
        <div class="menu-search-input">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Search menu..."
          />
        </div>
        <div class="menu-search-icon">
          <a href="#" v-on:click="toggleAppHeaderSearch"
            ><i class="bi bi-x-lg"></i
          ></a>
        </div>
      </div>
    </form>
    <!-- END menu-search -->
  </div>
</template>

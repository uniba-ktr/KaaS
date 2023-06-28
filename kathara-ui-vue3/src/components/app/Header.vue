<script setup lang="ts">
import { useAppOptionStore } from "@/stores/app-option";
import { RouterLink } from "vue-router";

const appOption = useAppOptionStore();
const app_title = import.meta.env.VITE_APP_TITLE;
const notificationData = [
  {
    icon: "far fa-folder-open text-theme",
    title: "New kathara lab has been created",
    time: "JUST NOW",
  },
  {
    icon: "fas fa-laptop text-theme",
    title: "New firewall add to 'SDN bgp test' lab",
    time: "2 MINUTES AGO",
  },
  {
    icon: "bi bi-gear text-theme",
    title: "'SDN bgp test' lab successfully deployed",
    time: "3 MINUTES AGO",
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
        <a href="#" data-bs-toggle="dropdown" data-bs-display="static" class="menu-link">
          <div class="menu-icon"><i class="bi bi-bell nav-icon"></i></div>
          <div class="menu-badge bg-theme" v-if="notificationData && notificationData.length > 0"></div>
        </a>
        <div class="dropdown-menu dropdown-menu-end mt-1 w-300px fs-11px pt-1">
          <h6 class="dropdown-header fs-10px mb-1">NOTIFICATIONS</h6>
          <div class="dropdown-divider mt-1"></div>
          <template v-if="notificationData && notificationData.length > 0">
            <a href="#" class="d-flex align-items-center py-10px dropdown-item text-wrap" v-for="(notification, index) in notificationData" v-bind:key="index">
              <div class="fs-20px">
                <i v-if="notification.icon" v-bind:class="notification.icon"></i>
              </div>
              <div class="flex-1 flex-wrap ps-3">
                <div class="mb-1 text-white">{{ notification.title }}</div>
                <div class="small">{{ notification.time }}</div>
              </div>
              <div class="ps-2 fs-16px">
                <i class="bi bi-chevron-right"></i>
              </div>
            </a>
          </template>
          <template v-else>
            <div class="dropdown-notification-item">
              No record found
            </div>
          </template>
          <hr class="bg-white-transparent-5 mb-0 mt-2" />
          <div class="py-10px mb-n2 text-center">
            <a href="#" class="text-decoration-none fw-bold">SEE ALL</a>
          </div>
        </div>
      </div>
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
          <div class="menu-text d-sm-block d-none">admin@uni-bamberg.de</div>
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
            >MY LABS
            <i class="far fa-folder-open ms-auto text-theme fs-16px my-n1"></i
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

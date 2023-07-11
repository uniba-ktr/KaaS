<script setup lang="ts">
import { useAppOptionStore } from "@/stores/app-option";
import { useAppVariableStore } from "@/stores/app-variable";
import { onMounted } from "vue";
import { Tooltip } from "bootstrap";
import {useEmitter} from "@/composables/useEmitter";

const appOption = useAppOptionStore();
const appVariable = useAppVariableStore();
const emitter = useEmitter();

const themeList = [
  { name: "Pink", bgClass: "bg-pink", themeClass: "theme-pink" },
  { name: "Red", bgClass: "bg-red", themeClass: "theme-red" },
  { name: "Orange", bgClass: "bg-warning", themeClass: "theme-warning" },
  { name: "Yellow", bgClass: "bg-yellow", themeClass: "theme-yellow" },
  { name: "Lime", bgClass: "bg-lime", themeClass: "theme-lime" },
  { name: "Green", bgClass: "bg-green", themeClass: "theme-green" },
  { name: "Default", bgClass: "bg-teal", themeClass: "theme-teal" },
  { name: "Cyan", bgClass: "bg-info", themeClass: "theme-info" },
  { name: "Blue", bgClass: "bg-primary", themeClass: "theme-primary" },
  { name: "Purple", bgClass: "bg-purple", themeClass: "theme-purple" },
  { name: "Indigo", bgClass: "bg-indigo", themeClass: "theme-indigo" },
  { name: "Gray", bgClass: "bg-gray-200", themeClass: "theme-gray-200" },
];

const coverList = [
  {
    name: "Default",
    coverThumbImage: "/assets/img/cover/cover-thumb-1.jpg",
    coverClass: "",
  },
  {
    name: "Cover 2",
    coverThumbImage: "/assets/img/cover/cover-thumb-2.jpg",
    coverClass: "bg-cover-2",
  },
  {
    name: "Cover 3",
    coverThumbImage: "/assets/img/cover/cover-thumb-3.jpg",
    coverClass: "bg-cover-3",
  },
  {
    name: "Cover 4",
    coverThumbImage: "/assets/img/cover/cover-thumb-4.jpg",
    coverClass: "bg-cover-4",
  },
  {
    name: "Cover 5",
    coverThumbImage: "/assets/img/cover/cover-thumb-5.jpg",
    coverClass: "bg-cover-5",
  },
];

function appThemePanelToggled(event) {
  event.preventDefault();

  appOption.appThemePanelToggled = !appOption.appThemePanelToggled;

  if (localStorage) {
    localStorage.appThemePanelToggled = appOption.appThemePanelToggled;
  }
}

function toggleTheme(event, themeClass) {
  event.preventDefault();

  appOption.appThemeClass = themeClass;

  if (localStorage) {
    localStorage.appThemeClass = appOption.appThemeClass;
  }
  setThemeClass(localStorage.appThemeClass);
}

function toggleCover(event, coverClass) {
  event.preventDefault();

  appOption.appCoverClass = coverClass;

  if (localStorage) {
    localStorage.appCoverClass = appOption.appCoverClass;
  }
  setCoverClass(appOption.appCoverClass);
}

function setCoverClass(coverClass) {
  const htmlElm = document.querySelector("html");
  for (let x = 0; x < document.documentElement.classList.length; x++) {
    const targetClass = document.documentElement.classList[x];
    if (targetClass.search("bg-cover-") > -1) {
      htmlElm.classList.remove(targetClass);
    }
  }
  htmlElm.classList.add(coverClass);
}

function setThemeClass(themeClass) {
  for (let x = 0; x < document.body.classList.length; x++) {
    const targetClass = document.body.classList[x];
    if (targetClass.search("theme-") > -1) {
      document.body.classList.remove(targetClass);
    }
  }
  document.body.classList.add(themeClass);
  appVariable.color.theme = getComputedStyle(document.body)
    .getPropertyValue("--bs-theme")
    .trim();
  appVariable.color.themeRgb = getComputedStyle(document.body)
    .getPropertyValue("--bs-theme-rgb")
    .trim();

  emitter.emit("theme-reload", true);
}

onMounted(() => {
  const elm = document.querySelectorAll('[data-bs-toggle="tooltip"]');

  for (let i = 0; i < elm.length; i++) {
    new Tooltip(elm[i]);
  }

  if (localStorage) {
    if (localStorage.appThemePanelToggled) {
      appOption.appThemePanelToggled = JSON.parse(
        localStorage.appThemePanelToggled
      );
    }
    if (localStorage.appThemeClass) {
      appOption.appThemeClass = localStorage.appThemeClass;
      setThemeClass(localStorage.appThemeClass);
    }
    if (localStorage.appCoverClass) {
      appOption.appCoverClass = localStorage.appCoverClass;
      setCoverClass(appOption.appCoverClass);
    }
  }
});
</script>
<template>
  <div
    class="app-theme-panel"
    v-bind:class="{ active: appOption.appThemePanelToggled }"
  >
    <div class="app-theme-panel-container">
      <a href="#" v-on:click="appThemePanelToggled" class="app-theme-toggle-btn"
        ><i class="bi bi-sliders"></i
      ></a>
      <div class="app-theme-panel-content">
        <div class="small fw-bold text-white mb-1">Theme Color</div>
        <card class="mb-3">
          <card-body class="p-2">
            <div class="app-theme-list">
              <div
                class="app-theme-list-item"
                v-bind:class="{
                  active:
                    appOption.appThemeClass == theme.themeClass ||
                    (!appOption.appThemeClass && theme.name == 'Default'),
                }"
                v-for="theme in themeList"
              >
                <a
                  href="javascript:;"
                  class="app-theme-list-link"
                  v-bind:class="theme.bgClass"
                  v-on:click="(event) => toggleTheme(event, theme.themeClass)"
                  data-bs-toggle="tooltip"
                  data-bs-trigger="hover"
                  data-bs-container="body"
                  v-bind:data-bs-title="theme.name"
                  >&nbsp;</a
                >
              </div>
            </div>
          </card-body>
        </card>

        <div class="small fw-bold text-white mb-1">Theme Cover</div>
        <card>
          <card-body class="p-2">
            <div class="app-theme-cover">
              <div
                class="app-theme-cover-item"
                v-bind:class="{
                  active:
                    appOption.appCoverClass == cover.coverClass ||
                    (!appOption.appCoverClass && cover.name == 'Default'),
                }"
                v-for="cover in coverList"
              >
                <a
                  href="javascript:;"
                  class="app-theme-cover-link"
                  v-bind:style="{
                    backgroundImage: 'url(' + cover.coverThumbImage + ')',
                  }"
                  v-on:click="(event) => toggleCover(event, cover.coverClass)"
                  data-bs-toggle="tooltip"
                  data-bs-trigger="hover"
                  data-bs-container="body"
                  v-bind:data-bs-title="cover.name"
                  >&nbsp;</a
                >
              </div>
            </div>
          </card-body>
        </card>
      </div>
    </div>
  </div>
</template>

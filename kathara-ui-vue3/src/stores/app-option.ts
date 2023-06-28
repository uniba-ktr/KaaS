import { defineStore } from "pinia";

export const useAppOptionStore = defineStore({
  id: "appOption",
  state: () => {
    return {
      appThemeClass: "",
      appCoverClass: "",
      appBoxedLayout: false,
      appHeaderHide: false,
      appHeaderSearchToggled: false,
      appSidebarCollapsed: true,
      appSidebarMobileToggled: false,
      appSidebarMobileClosed: false,
      appSidebarHide: false,
      appContentFullHeight: false,
      appContentClass: "",
      appFooter: true,
      appFooterFixed: true,
      appThemePanelToggled: false,
      appSidebarToggled: false,
    };
  },
});

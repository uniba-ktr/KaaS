import { defineStore } from "pinia";

export const useAppSidebarMenuStore = defineStore({
  id: "appSidebarMenu",
  state: () => {
    return [
      {
        text: "Navigation",
        is_header: true,
      },
      {
        url: "/",
        icon: "bi bi-house-door",
        text: "Home",
      },
      {
        url: "/labs",
        text: "Kathara Labs",
        icon: "far fa-folder-open",
        children: [
            {
              url: '/labs/detail',
              action: 'Detail',
              text: 'Current Lab'
            }
        ]
      }
    ];
  },
});

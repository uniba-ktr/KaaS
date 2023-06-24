import {defineStore} from "pinia";
import type {KatharaLab} from "@/models/lab-models";
import {LabState} from "@/models/lab-states";

export type RootState = {
    katharaLab: KatharaLab;
    currentState: LabState;
};

export const useLabStore = defineStore("lab", {
    state: () =>
      ({
          katharaLab: {
            name: "Simple lab",
            description: "A simple Kathara Lab",
            version: "1.0.0",
            author: "Thanh Le",
            email: "thanhledev@gmail.com",
            topo: [],
          },
          currentState: LabState.EDITING,
      } as RootState),
    actions: {

    },
    getters: {
        getLabName: (state) => state.katharaLab.name,
        getLabDescription: (state) => state.katharaLab.description,
        getLabVersion: (state) => state.katharaLab.version,
        getLabAuthor: (state) => state.katharaLab.author,
        getLabEmail: (state) => state.katharaLab.email,
        getLabTopo: (state) => state.katharaLab.topo,
        getLabState: (state) => state.currentState,
    },
    persist: true,
});
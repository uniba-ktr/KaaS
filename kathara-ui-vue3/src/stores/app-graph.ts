import {defineStore} from "pinia";
import type {Layouts} from "v-network-graph";
import type {CollisionDomain, GraphLink, NetworkDevice, TopologyModel} from "@/models/graph-models";

export type RootState = {
  nodes: Record<string, CollisionDomain | NetworkDevice>;
  edges: Record<string, GraphLink>;
  usedCdCodes: string[];
  nextEdgeIndex: number;
  layout: Layouts;
};

export const useGraphStore = defineStore("graph", {
  state: () =>
    ({
      nodes: {
      },
      edges: {
      },
      usedCdCodes: [],
      nextEdgeIndex: 0,
      layout: {
        nodes: {
        }
      }
    } as RootState),
  actions: {
    updateNodePosition(nodeName: string, pos_X: number, pos_Y: number) {
      this.layout.nodes[nodeName].x = pos_X;
      this.layout.nodes[nodeName].y = pos_Y;
    },
    resetGraph() {
      this.nodes = {};
      this.edges = {};
      this.usedCdCodes = [];
      this.nextEdgeIndex = 0;
      this.layout = {nodes: {}}
    },
    importGraph(graphObject: any) {
      this.nodes = graphObject.model.nodes;
      this.edges = graphObject.model.edges;
      this.layout = graphObject.model.layout;
      this.usedCdCodes = graphObject.model.usedCdCodes;
      this.nextEdgeIndex = graphObject.model.nextEdgeIndex;
    }
  },
  getters: {
    getNodes: (state) => state.nodes,
    getEdges: (state) => state.edges,
    getNextEdgeIndex: (state) => state.nextEdgeIndex,
    getLayout: (state) => state.layout,
  },
  persist: true,
});

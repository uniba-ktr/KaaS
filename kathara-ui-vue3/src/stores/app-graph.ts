import { defineStore } from "pinia";
import type { Layouts } from "v-network-graph";
import type {
  DeviceInterface,
  CollisionDomain,
  NetworkDevice,
  KatharaLink,
} from "@/models/graph-models";

export type RootState = {
  nodes: Record<string, CollisionDomain | NetworkDevice>;
  edges: Record<string, KatharaLink>;
  layout: Layouts;
};

export const useGraphStore = defineStore("graph", {
  state: () =>
    ({
      nodes: {
        cd1: {
          name: "A",
          code: "A",
          node_type: "collision_domain",
          // pos_X: 80,
          // pos_Y: 80,
        },
        nd1: {
          name: "pc1",
          docker_image: "unibaktr/alpine",
          interfaces: [
            {
              index: "0",
              cd: "A",
            },
          ],
          node_type: "network_device",
          type: "client",
          // pos_X: 0,
          // pos_Y: 0,
        },
        nd2: {
          name: "pc2",
          docker_image: "unibaktr/alpine",
          interfaces: [
            {
              index: "0",
              cd: "B",
            },
          ],
          node_type: "network_device",
          type: "client",
          // pos_X: 160,
          // pos_Y: 0,
        },
        cd2: {
          name: "B",
          code: "B",
          node_type: "collision_domain",
          // pos_X: 160,
          // pos_Y: 200,
        },
      },
      edges: {
        edge1: { source: "cd1", target: "nd1", info: { index: "0", cd: "A" } },
        edge2: { source: "nd2", target: "cd2", info: { index: "0", cd: "B" } },
      },
      layout: {
        nodes: {
          cd1: { x: 80, y: 80 },
          cd2: { x: 160, y: 200 },
          nd1: { x: 0, y: 0 },
          nd2: { x: 160, y: 0 }
        }
      }
    } as RootState),
  actions: {
    updateNodePosition(nodeName: string, pos_X: number, pos_Y: number) {
      this.layout.nodes[nodeName].x = pos_X;
      this.layout.nodes[nodeName].y = pos_Y;
    }
  },
  getters: {
    getNodes: (state) => state.nodes,
    getEdges: (state) => state.edges,
    getLayout: (state) => state.layout,
  },
});

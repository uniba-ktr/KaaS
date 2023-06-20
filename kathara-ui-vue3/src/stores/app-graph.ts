import {defineStore} from "pinia";
import type {Layouts} from "v-network-graph";
import type {CollisionDomain, DeviceInterface, GraphLink, NetworkDevice,} from "@/models/graph-models";

import type {KatharaLab, LabDevice, Network} from "@/models/lab-models";

export type RootState = {
  nodes: Record<string, CollisionDomain | NetworkDevice>;
  edges: Record<string, GraphLink>;
  layout: Layouts;
};

export const useGraphStore = defineStore("graph", {
  state: () =>
    ({
      nodes: {
        cd_A: {
          name: "A",
          code: "A",
          node_type: "collision_domain",
          icon: "collision-domain.png",
          // pos_X: 80,
          // pos_Y: 80,
        },
        pc1: {
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
          icon: "network-pc.png",
          // pos_X: 0,
          // pos_Y: 0,
        },
        pc2: {
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
          icon: "network-pc.png",
          // pos_X: 160,
          // pos_Y: 0,
        },
        cd_B: {
          name: "B",
          code: "B",
          node_type: "collision_domain",
          icon: "collision-domain.png",
          // pos_X: 160,
          // pos_Y: 200,
        },
      },
      edges: {
        edge1: { source: "cd_A", target: "pc1", info: { index: "0", cd: "A" } },
        edge2: { source: "pc2", target: "cd_B", info: { index: "0", cd: "B" } },
      },
      layout: {
        nodes: {
          cd_A: { x: 80, y: 80 },
          cd_B: { x: 160, y: 200 },
          pc1: { x: 0, y: 0 },
          pc2: { x: 160, y: 0 }
        }
      }
    } as RootState),
  actions: {
    updateNodePosition(nodeName: string, pos_X: number, pos_Y: number) {
      this.layout.nodes[nodeName].x = pos_X;
      this.layout.nodes[nodeName].y = pos_Y;
    },
    convertGraphToJson(): KatharaLab {
      let labJson: KatharaLab = {
        name: "Simple Lab",
        description: "A simple Kathara Lab",
        version: "1.0.0",
        author: "Thanh Le",
        email: "thanhledev@gmail.com",
        topo: [],
      }

      for (const k in this.$state.nodes) {
        const node = this.$state.nodes[k];
        switch (node.node_type) {
          case 'collision_domain':
            break;
          case 'network_device':
            labJson.topo.push(this.convertGraphNodeToLabDevice(k, <NetworkDevice>node));
        }
      }

      return labJson;
    },
    convertGraphNodeToLabDevice(node_name: string, node: NetworkDevice): LabDevice {
      return {
        name: node_name,
        image: node.docker_image,
        mem: node.memory,
        cpus: node.cpus,
        bridged: node.bridged,
        ipv6: node.ipv6,
        net: node.interfaces ? this.convertGraphNodeInterfacesToNetworks(node.interfaces) : [],
      };
    },
    convertGraphNodeInterfacesToNetworks(interfaces: DeviceInterface[]): Network[] {
      let deviceNetworks: Network[] = [];
      for (let i in interfaces) {
        deviceNetworks.push({
          interface: Number(interfaces[i].index),
          domain: interfaces[i].cd,
        })
      }
      return deviceNetworks;
    }
  },
  getters: {
    getNodes: (state) => state.nodes,
    getEdges: (state) => state.edges,
    getLayout: (state) => state.layout,
  },
  persist: true,
});

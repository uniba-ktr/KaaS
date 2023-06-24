import {defineStore} from "pinia";
import type {KatharaLab} from "@/models/lab-models";
import {LabState} from "@/models/lab-states";
import type {LabDevice, MountedFile, Network} from "@/models/lab-models";
import type {DeviceInterface, NetworkDevice, CollisionDomain} from "@/models/graph-models";
import {kathara_api} from "@/support/httpCommon";

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
        convertGraphToTopo(graphNodes: Record<string, CollisionDomain | NetworkDevice>) {
            // clean old topo values
            this.katharaLab.topo = []
            for (const k in graphNodes) {
                const node = graphNodes[k];
                switch (node.node_type) {
                    case 'collision_domain':
                        break;
                    case 'network_device':
                        this.katharaLab.topo.push(this.convertNodeToLabDevice(k, <NetworkDevice>node));
                }
            }
        },
        convertNodeToLabDevice(node_name: string, node: NetworkDevice): LabDevice {
            let labDevice: LabDevice = {
                name: node_name,
                net: node.interfaces ? this.convertNodeInterfacesToNetworks(node.interfaces) : [],
            }

            if (node.docker_image) {
                labDevice.image = node.docker_image;
            }

            if (node.memory) {
                labDevice.mem = node.memory;
            }

            if (node.cpus) {
                labDevice.cpus = node.cpus;
            }

            if (node.bridged) {
                labDevice.bridged = node.bridged;
            }

            if (node.ipv6) {
                labDevice.ipv6 = node.ipv6;
            }

            if (node.env && node.env !== "") {
                labDevice.env = node.env.split("\n");
            }

            let scriptFiles: MountedFile[] = [];
            if (node.startup_script && node.startup_script !== "") {
                scriptFiles.push({
                    name: `${node_name}.startup`,
                    content: node.startup_script
                })
            }

            if (node.shutdown_script && node.shutdown_script !== "") {
                scriptFiles.push({
                    name: `${node_name}.shutdown`,
                    content: node.shutdown_script
                })
            }

            if (scriptFiles.length > 0) {
                labDevice.files = Array.from(scriptFiles);
            }

            return labDevice;
        },
        convertNodeInterfacesToNetworks(interfaces: DeviceInterface[]): Network[] {
            let deviceNetworks: Network[] = [];
            for (let i in interfaces) {
                deviceNetworks.push({
                    interface: Number(interfaces[i].index),
                    domain: interfaces[i].cd,
                })
            }
            return deviceNetworks;
        },
        async createLab(): Promise<string> {
            return await kathara_api
                .post(`/lcreate`, this.katharaLab)
                .then(resp => resp.data);
        }
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
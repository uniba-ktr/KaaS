import {defineStore} from "pinia";
import type {KatharaLab, LabDevice, MountedFile, Network} from "@/models/lab-models";
import {LabState} from "@/models/lab-states";
import type {CollisionDomain, DeviceInterface, NetworkDevice} from "@/models/graph-models";
import {kathara_api} from "@/support/httpCommon";
import {Convert} from "@/support/convertHelper";
import type {ApiResponse, Info} from "@/models/api-models";

import {poll} from "poll";

export type RootState = {
    katharaLab: KatharaLab;
    currentState: LabState;
    labHash: string;
    labMachines: {[k: string]: Info},
    visibleConsoleFrames: string[],
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
          labHash: "",
          labMachines: {},
          visibleConsoleFrames: [],
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
        async createLab() {
            const resp = await kathara_api
                .post(`/lcreate`, this.katharaLab)
                .then(resp => resp.data);

            const apiResponse: ApiResponse = Convert.toApiResponse(JSON.stringify(resp));

            // NOTE: jumping from submitted ==> created
            this.currentState = typeof apiResponse.lab_status !== "undefined" ?
                LabState.CREATED : LabState.EDITING;

            this.labHash = typeof apiResponse.lab_hash !== "undefined" ?
                apiResponse.lab_hash : "";
        },
        async runLab() {
            const resp = await kathara_api
                .post(`/lstart`, {
                    lab_name: this.katharaLab.name
                })
                .then((resp) => resp.data)

            const apiResponse: ApiResponse = Convert.toApiResponse(JSON.stringify(resp));

            if (apiResponse.success) {
                this.currentState = LabState.STARTING;
            }

            // begin to polling for lab create
            let stopPolling = false;
            const shouldStopPolling = () => stopPolling

            setTimeout(async () => {
                await poll(async () => {
                    const resp = await kathara_api
                        .post(`/linfo`, {
                            lab_name: this.katharaLab.name,
                            lab_hash: this.labHash,
                        })
                        .then((resp) => {
                            const apiResponse: ApiResponse = Convert.toApiResponse(JSON.stringify(resp.data));
                            if (apiResponse.info) {
                                stopPolling = true;
                            }

                            return apiResponse;
                        })
                        .catch(err => {
                            console.log(err)
                            return err;
                        })

                    if (resp.info) {
                        this.currentState = LabState.RUNNING;
                        this.labMachines = resp.info;
                    }

                }, 15000, shouldStopPolling)
            }, 15000)
        },
        async stopLab() {
            const cleanResp = await kathara_api
                .post(`/lclean`, {
                    lab_name: this.katharaLab.name,
                    lab_hash: this.labHash,
                })
                .then((resp) => resp.data)

            const cleanApiResponse = Convert.toApiResponse(JSON.stringify(cleanResp));

            if (cleanApiResponse.success) {
                this.currentState = LabState.CLEANING;
            }

            // begin to polling for lab wipe
            let stopPolling = false;
            const shouldStopPolling = () => stopPolling

            setTimeout(async () => {
                await poll(async () => {
                    const resp = await kathara_api
                        .post(`/wipe`, {
                            lab_name: this.katharaLab.name,
                            lab_hash: this.labHash,
                        })
                        .then((resp) => {
                            const apiResponse: ApiResponse = Convert.toApiResponse(JSON.stringify(resp.data));
                            if (apiResponse.success) {
                                stopPolling = true;
                            }

                            return apiResponse;
                        })
                        .catch(err => {
                            console.log(err)
                            return err;
                        })

                    if (resp.success) {
                        this.currentState = LabState.REMOVED;
                        // remove lab_hash & labMachines
                        this.labHash = "";
                        this.labMachines = {};
                    }

                }, 5000, shouldStopPolling)
            }, 1000);
        },
        checkConsoleIframeVisibility(machineName: string): boolean {
            return this.visibleConsoleFrames.indexOf(machineName) >= 0;
        },
        showMachineConsoleIframe(machineName: string) {
            this.visibleConsoleFrames.push(machineName);
        },
        hideMachineConsoleIframe(machineName: string) {
            const idx = this.visibleConsoleFrames.indexOf(machineName);

            if (idx >= 0) {
                this.visibleConsoleFrames.splice(idx , 1);
            }
        },
        removeAllMachineConsoleIframe() {
            this.visibleConsoleFrames = [];
        },
        getMachineInfo(machineName: string): Info | undefined {
            let keys = Object.keys(this.labMachines);

            for (let k of keys) {
                if (this.labMachines[k].name === machineName) {
                    return this.labMachines[k];
                }
            }
            return undefined;
        },
        async resetLabState() {
            setTimeout(() => {
                this.currentState = LabState.EDITING;
            }, 1000);
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
        getLabHash: (state) => state.labHash,
        getLabMachines: (state) => state.labMachines,
        getVisibleConsoleIframes: (state) => state.visibleConsoleFrames,
    },
    persist: true,
});
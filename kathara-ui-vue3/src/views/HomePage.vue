<template>
  <ul class="breadcrumb">
    <li class="breadcrumb-item"><a href="#">BREADCRUMB</a></li>
    <li class="breadcrumb-item active">HOME PAGE</li>
  </ul>
  <h1 class="page-header">
    KaaS <small>build your topology here</small>
  </h1>
  <p>
    <button
      type="button"
      class="btn btn-pink mb-1 me-1 btn-lg"
      data-bs-toggle="modal"
      data-bs-target="#modalCollisionDomain"
      id="openCollisionDomainModal"
      :disabled="labState !== LabState.EDITING"
    >
      Add Collision Domain
    </button>
    <button
      type="button"
      class="btn btn-info mb-1 me-1 btn-lg"
      data-bs-toggle="modal"
      data-bs-target="#modalNetworkDevice"
      id="openNetworkDeviceModal"
      :disabled="labState !== LabState.EDITING"
    >
      Add Network Device
    </button>
    <button
        type="button"
        class="btn btn-lg me-1 btn-success"
        :disabled="!isEdgeEligible(selectedNodes)"
        data-bs-toggle="modal"
        data-bs-target="#modalEdge"
        @click="openEdgeModal(true)"
    >
      Add link
    </button>
    <button
        type="button"
        class="btn btn-lg me-1 btn-success"
        :disabled="labState !== LabState.EDITING || selectedEdges.length === 0"
        data-bs-toggle="modal"
        data-bs-target="#modalEdge"
        @click="openEdgeModal(false)"
    >
      Edit link
    </button>
    <button
        type="button"
        class="btn btn-lg me-1 btn-danger"
        :disabled="labState !== LabState.EDITING || selectedEdges.length === 0"
        @click="removeEdge"
    >
      Remove link
    </button>
    <button
        type="button"
        class="btn btn-warning mb-1 me-1 btn-lg"
        @click="showGraphJson"
    >
      Show graph in json
    </button>
  </p>
  <p>
    <button
        type="button"
        class="btn btn-success mb-1 me-1 btn-lg"
        @click="createLab"
        :disabled="labState !== LabState.EDITING"
    >
      Create Kathara Lab
    </button>

    <button
        type="button"
        class="btn btn-primary mb-1 me-1 btn-lg"
        @click="runLab"
        :disabled="labState !== LabState.CREATED"
    >
      Run Kathara Lab
    </button>
    <button
        type="button"
        class="btn btn-warning mb-1 me-1 btn-lg"
        data-bs-toggle="modal"
        data-bs-target="#anotherIframe"
        @click="showIframeInModal"
    >
      Open iframe modal
    </button>
  </p>
  <v-network-graph
    class="graph"
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    :nodes="nodes"
    :edges="edges"
    :layouts="layout"
    :configs="configs"
    :event-handlers="eventHandlers"
  >
    <defs>
      <!--
        Define the path for clipping the face image.
        To change the size of the applied node as it changes,
        add the `clipPathUnits="objectBoundingBox"` attribute
        and specify the relative size (0.0~1.0).
      -->
      <clipPath id="iconCircle" clipPathUnits="objectBoundingBox">
        <circle cx="0.5" cy="0.5" r="0.5" />
      </clipPath>
    </defs>
    <!-- Replace the node component -->
    <template #override-node="{ nodeId, scale, config, ...slotProps }">
      <!-- circle for filling background -->
      <circle
        class="icon-circle"
        :r="config.radius * scale"
        fill="#ffffff"
        v-bind="slotProps"
      />
      <!--
        The base position of the <image /> is top left. The node's
        center should be (0,0), so slide it by specifying x and y.
      -->
      <image
        class="icon-picture"
        :x="-config.radius * scale"
        :y="-config.radius * scale"
        :width="config.radius * scale * 2"
        :height="config.radius * scale * 2"
        :xlink:href="`./icons/${nodes[nodeId].icon}`"
        clip-path="url(#iconCircle)"
      />
      <!-- circle for drawing stroke -->
      <circle
        class="icon-circle"
        :r="config.radius * scale"
        fill="none"
        stroke="#808080"
        :stroke-width="1 * scale"
        v-bind="slotProps"
      />
    </template>
  </v-network-graph>
  <!-- BEGIN #modalCollisionDomain -->
  <div class="modal fade" id="modalCollisionDomain">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Collision Domain</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="closeCollisionDomainModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Code:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Collision Domain Code (e.g., A, B, C ...)"
                  v-model="newCdCode"
                  @keypress="isCollisionDomainName($event)"
                />
              </div>
            </div>
          </div>
          <div class="alert alert-muted">
            <b>Note:</b>
            Character only. For example: A, B, C, ..., AA, BB, ...
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-default"
            data-bs-dismiss="modal"
            id="closeModalCollisionDomain"
            @click="closeCollisionDomainModal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-outline-theme"
            :disabled="!isCdCodeEligible(newCdCode)"
            @click="addEditCollisionDomain"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- END #modalCollisionDomain -->
  <!-- BEGIN #modalNetworkDevice -->
  <div class="modal fade" id="modalNetworkDevice">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add/Edit Network Device</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="closeNetworkDeviceModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Device Type (*):</label>
            <div class="row row-space-10">
              <div class="col-12">
                <select
                  v-model="selectedDeviceType"
                  class="form-select-lg"
                  @change="onDeviceTypeChange"
                  :disabled="!nodeMode"
                >
                  <option disabled value="">Please select one</option>
                  <option value="client">PC Client</option>
                  <option value="web-server">Web Server</option>
                  <option value="linux-switch">Linux Switch</option>
                  <option value="traefik-balancer">Traefik Balancer</option>
                  <option value="dns-server">DNS Server</option>
                  <option value="vpn-device">VPN (Client/Server)</option>
                  <option value="vyatta-router">Vyatta Router</option>
                  <option value="frr-router">FRR Router</option>
                </select>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device Name (*):</label>
            <div class="row row-space-10">
              <div class="col-12">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Device name (e.g., pc1, linux_switch...)"
                  v-model="deviceName"
                  @keypress="isDeviceName($event)"
                />
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device Image (*):</label>
            <div class="row row-space-10">
              <div class="col-12">
                <input
                  class="form-control"
                  type="text"
                  v-model="deviceDockerImage"
                />
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device Startup Script:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <textarea
                  class="form-control"
                  v-model="deviceStartupScript"
                  rows="10"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device Shutdown Script:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <textarea
                    class="form-control"
                    v-model="deviceShutdownScript"
                    rows="10"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device Memory:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Allocated memory for device. Format: xxx[b/k/m/g] (e.g., 128m, 1g ...)"
                  v-model="deviceMemory"
                />
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device CPUs:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Allocated CPU shares (e.g., 0.5, 1.5, 2...)."
                  v-model="deviceCPUShare"
                />
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device Bridged:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <div class="form-check form-switch">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="deviceBridgeEnabled"
                    v-model="deviceBridgeEnabled"
                  />
                  <label class="form-check-label" for="deviceBridgeEnabled">
                    Connect device to host?
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Support IPv6:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <div class="form-check form-switch">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="deviceIPv6Enabled"
                    v-model="deviceIPv6Enabled"
                  />
                  <label class="form-check-label" for="deviceIPv6Enabled">
                    Device supports IPv6
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device shell cmds:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <textarea
                  class="form-control"
                  v-model="deviceExecCmds"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device sysctl options:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <textarea
                  class="form-control"
                  v-model="deviceSysctlOptions"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device envs:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <textarea
                  class="form-control"
                  v-model="deviceEnv"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Device shell:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Default shell used when connecting to device (e.g., bash, sh)"
                  v-model="deviceShell"
                />
              </div>
            </div>
          </div>
          <div class="alert alert-muted">
            <b>Note:</b>
            Device name must be unique. Kathara cannot have two devices with the
            same name. Fields with (*) are mandatory. Otherwise, they are
            optional.
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-default"
            data-bs-dismiss="modal"
            id="closeModalNetworkDevice"
            @click="closeNetworkDeviceModal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-outline-theme"
            :disabled="!isDeviceNameEligible(deviceName)"
            @click="addEditNetworkDevice"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- END #modalNetworkDevice -->
  <!-- BEGIN #modalEdge -->
  <div class="modal fade" id="modalEdge">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add/Edit Link</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Eth:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <input
                  class="form-control"
                  type="text"
                  placeholder="Interface Index (e.g., 0, 1, 2 ...)"
                  v-model="selectedDeviceInterfaceIndex"
                  @keypress="isNumber($event)"
                />
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Collision Domain Code:</label>
            <div class="row row-space-10">
              <div class="col-12">
                <input
                  class="form-control"
                  type="text"
                  v-model="selectedCDValue"
                  readonly
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-default"
            data-bs-dismiss="modal"
            id="closeModalEdge"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-outline-theme"
            @click="addEditEdge"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- END #modalCollisionDomain -->
  <!-- BEGIN #labToast -->
  <div class="toasts-container">
    <div :class="['toast', 'text-black', toastType === 0 ? 'bg-info' : 'bg-danger']" data-autohide="false" id="lab-toast">
      <div class="d-flex">
        <div class="toast-body">
          {{ toastMessage }}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  </div>
  <!-- END #labToast -->
  <LabMachineConsole />
</template>

<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useGraphStore} from "@/stores/app-graph";
import {useLabStore} from "@/stores/app-lab";
import {Toast} from "bootstrap";
import LabMachineConsole from "@/components/custom/LabMachineConsole.vue";
import type {CollisionDomain, DeviceInterface, NetworkDevice,} from "@/models/graph-models";

import * as vNG from "v-network-graph";
import {VNetworkGraph} from "v-network-graph";

// worker
import {LabState} from "@/models/lab-states";

// get pinia stores
const labStore = useLabStore();

// v-network-graph variables
const { nodes, edges, layout } = storeToRefs(useGraphStore());

const { updateNodePosition } = useGraphStore();

const configs = reactive(
  vNG.defineConfigs({
    node: {
      selectable: 2, // up to 2 nodes
      normal: {
        radius: 20,
      },
      hover: {
        radius: 22,
      },
      label: {
        visible: true,
        fontSize: 14,
        lineHeight: 1.1,
        color: "#000",
        margin: 4,
        direction: "south",
        text: "name",
      },
    },
    edge: {
      selectable: 1,
      normal: {
        width: 1,
        color: "#2222aa",
      },
      hover: {
        width: 2,
        color: "#0000aa",
      },
      gap: 20,
      type: "curve",
      margin: 6,
      marker: {
        source: {
          type: "circle",
          width: 8,
          height: 8,
        },
        target: {
          type: "circle",
          width: 8,
          height: 8,
        },
      },
    },
  })
);

// lab variables
const { katharaLab, currentState: labState, labMachines } = storeToRefs(useLabStore());

watch(labState, async (value, oldValue) => {
  if (value !== oldValue) {
    if (oldValue === LabState.EDITING && value === LabState.CREATED) {
      toastMessage.value = "Successfully created lab...";
      showToast();
    }
    if (oldValue === LabState.CREATED && value === LabState.STARTING) {
      toastMessage.value = "Lab is starting...";
      showToast();
    }

    if (oldValue === LabState.STARTING && value === LabState.RUNNING) {
      toastMessage.value = "Lab is running...";
      showToast();
    }
  }
})

// toast variables
const toastMessage = ref("");
const toastType = ref(0);

// iframe variables
const showIframe = ref(false);

const eventHandlers: vNG.EventHandlers = {
  "node:dragend": (draggedNode) => {
    const draggedNodeId = Object.keys(draggedNode)[0];
    console.log(
      `Drag node ${draggedNodeId} with x-pos: ${JSON.stringify(
        draggedNode[draggedNodeId].x
      )} and y-pos: ${JSON.stringify(draggedNode[draggedNodeId].y)}`
    );
    updateNodePosition(draggedNodeId,
      draggedNode[draggedNodeId].x,
      draggedNode[draggedNodeId].y);
    //nodes[draggedNodeId].pos_X = draggedNode[draggedNodeId].x;
    //nodes[draggedNodeId].pos_Y = draggedNode[draggedNodeId].y;
  },
  "node:dblclick": (clickedNode) => {
    if (clickedNode.event.detail == 2) {
      //console.log(`dblclick on ${JSON.stringify(clickedNode)}`)
      // node can only be edited when lab is in EDITING mode
      if (labState.value === LabState.EDITING &&
          nodes.value[clickedNode.node].node_type === "network_device") {
        nodeMode.value = false;
        editedNode.value = clickedNode.node;
        selectedDeviceType.value = nodes.value[clickedNode.node].type;
        deviceName.value = nodes.value[clickedNode.node].name!;
        deviceDockerImage.value = nodes.value[clickedNode.node].docker_image;
        deviceStartupScript.value = nodes.value[clickedNode.node].startup_script;
        deviceShutdownScript.value= nodes.value[clickedNode.node].shutdown_script;
        deviceMemory.value = nodes.value[clickedNode.node].memory;
        deviceCPUShare.value = nodes.value[clickedNode.node].cpus;
        deviceBridgeEnabled.value = nodes.value[clickedNode.node].bridged;
        deviceIPv6Enabled.value = nodes.value[clickedNode.node].ipv6;
        deviceExecCmds.value = nodes.value[clickedNode.node].exec;
        deviceSysctlOptions.value = nodes.value[clickedNode.node].sysctl;
        deviceEnv.value = nodes.value[clickedNode.node].env;
        deviceShell.value = nodes.value[clickedNode.node].shell;
        //console.log(`editedNode = ${editedNode.value}`);
        document.getElementById("openNetworkDeviceModal")!.click();
      }

      // node web-tty iframe can only be opened when lab is in RUNNING mode.
      if (labState.value === LabState.RUNNING) {
        console.log(`Open machine ${clickedNode.node} web-tty iframe`);
      }
    }
  },
  /*"node:click": (clickedNode) => {
    if (
      clickedNode.event.detail === 1 &&
      nodes[clickedNode.node].type === "collision_domain"
    ) {
      selectedCDValue.value = nodes[clickedNode.node].code;
      console.log(`Update CD value to ${selectedCDValue.value}`);
    }
  },*/
  "node:select": (selectedNodes) => {
    if (selectedNodes.length === 0) return;
    // update the selectedCD
    if (
      selectedNodes.length === 1 &&
        nodes.value[selectedNodes[0]].node_type === "collision_domain"
    ) {
      selectedCDValue.value = nodes.value[selectedNodes[0]].code;
      //console.log(`Update CD value to ${selectedCDValue.value}`);
    }
    if (selectedNodes.length === 2) {
      if (
          nodes.value[selectedNodes[0]].node_type !== nodes.value[selectedNodes[1]].node_type
      ) {
        selectedCDValue.value =
            nodes.value[selectedNodes[0]].node_type === "collision_domain"
            ? nodes.value[selectedNodes[0]].code
            : nodes.value[selectedNodes[1]].code;
        //console.log(`Update CD value to ${selectedCDValue.value}`);
      }
    }
  },
  "edge:select": (selectedEdges) => {
    if (selectedEdges.length === 0) return;
    //console.log(`Select the edge: ${JSON.stringify(selectedEdges)}`);
    edgeMode = false;
    selectedDeviceInterfaceIndex.value = edges.value[selectedEdges[0]].info.index;
    selectedCDValue.value = edges.value[selectedEdges[0]].info.cd;
  },
};

// v-network-graph system
const selectedNodes = ref<string[]>([]);
const selectedEdges = ref<string[]>([]);
const nextCDIndex = ref(
  Object.keys(nodes).filter((n) => n.indexOf("cd") >= 0).length + 1
);
const nextNDIndex = ref(
  Object.keys(nodes).filter((n) => n.indexOf("nd") >= 0).length + 1
);
const nextEdgeIndex = ref(Object.keys(edges).length + 1);
const selectedDeviceType = ref("");

// used CD codes
const newCdCode = ref("");
const usedCdCodes = ref<string[]>(["A", "B"]);

// new network device properties
const nodeMode = ref(true); // true => add new cd/device, false => edit dbl cd/device
const editedNode = ref("");
const deviceName = ref("");
const deviceDockerImage = ref("");
const deviceStartupScript = ref("");
const deviceShutdownScript = ref("");
const deviceMemory = ref("");
const deviceCPUShare = ref(1);
const deviceBridgeEnabled = ref(false);
const deviceIPv6Enabled = ref(false);
const deviceExecCmds = ref("");
const deviceSysctlOptions = ref("");
const deviceEnv = ref("");
const deviceShell = ref("");

// node functions
const isCollisionDomainName = (e: KeyboardEvent) => {
  const char = e.key;
  if (/^[A-Za-z]+$/.test(char)) return true;
  else e.preventDefault();
};

const isDeviceName = (e: KeyboardEvent) => {
  const char = e.key;
  if (/^[A-Za-z0-9_]+$/.test(char)) return true;
  else e.preventDefault();
};

const isCdCodeEligible = (newCode: string): boolean => {
  if (newCode === "") return false;
  return !usedCdCodes.value.some((code) => code === newCode);
};

const isDeviceNameEligible = (newName: string): boolean => {
  if (!nodeMode.value) return true;
  if (newName === "" && nodeMode) return false;
  return !(Object.keys(nodes) as Array<string>).some(
    (deviceName) => deviceName === newName
  );
};

const isNumber = (e: KeyboardEvent) => {
  const char = e.key;
  if (/^[0-9]+$/.test(char)) return true;
  else e.preventDefault();
};

const addEditCollisionDomain = () => {
  if (nodeMode.value) {
    const newCollisionDomain: CollisionDomain = {
      code: newCdCode.value,
      node_type: "collision_domain",
      name: newCdCode.value,
      icon: "collision-domain.png"
      // pos_X: 100,
      // pos_Y: 100,
    };
    const nodeId = `cd_${newCdCode.value}`;
    nodes.value[nodeId] = newCollisionDomain;
    usedCdCodes.value.push(newCdCode.value);
    document.getElementById("closeModalCollisionDomain")!.click();
  }
};

const closeCollisionDomainModal = () => {
  newCdCode.value = "";
};

function deviceIcon(deviceType: string): string {
  switch (deviceType) {
    case "linux-switch":
      return "network-switch.png";
    case "traefik-balancer":
      return "network-balancer.png";
    case "dns-server":
      return "network-dns.png";
    case "vyatta-router":
    case "frr-router":
      return "network-router.png";
    default:
      return "network-pc.png";
  }
}

const addEditNetworkDevice = () => {
  if (nodeMode.value) {
    const newNetworkDevice: NetworkDevice = {
      name: deviceName.value,
      node_type: "network_device",
      type: selectedDeviceType.value,
      docker_image: deviceDockerImage.value,
      icon: deviceIcon(selectedDeviceType.value),
      interfaces: [],
      startup_script:
        deviceStartupScript.value !== ""
          ? deviceStartupScript.value
          : undefined,
      shutdown_script:
          deviceShutdownScript.value !== ""
              ? deviceShutdownScript.value
              : undefined,
      memory: deviceMemory.value !== "" ? deviceMemory.value : undefined,
      cpus: deviceCPUShare.value !== 1 ? deviceCPUShare.value : undefined,
      bridged: deviceBridgeEnabled.value,
      ipv6: deviceIPv6Enabled.value,
      exec: deviceExecCmds.value !== "" ? deviceExecCmds.value : undefined,
      sysctl:
        deviceSysctlOptions.value !== ""
          ? deviceSysctlOptions.value
          : undefined,
      env: deviceEnv.value !== "" ? deviceEnv.value : undefined,
      shell: deviceShell.value !== "" ? deviceShell.value : undefined,
      // pos_X: 100,
      // pos_Y: 100,
    };
    const nodeId = deviceName.value;
    nodes.value[nodeId] = newNetworkDevice;
  } else {
    nodes.value[editedNode.value].docker_image = deviceDockerImage.value;
    nodes.value[editedNode.value].startup_script =
      deviceStartupScript.value !== "" ? deviceStartupScript.value : undefined;
    nodes.value[editedNode.value].shutdown_script =
        deviceShutdownScript.value !== "" ? deviceShutdownScript.value : undefined;
    nodes.value[editedNode.value].memory =
      deviceMemory.value !== "" ? deviceMemory.value : undefined;
    nodes.value[editedNode.value].cpus =
      deviceCPUShare.value !== 1 ? deviceCPUShare.value : undefined;
    nodes.value[editedNode.value].bridged = deviceBridgeEnabled.value;
    nodes.value[editedNode.value].ipv6 = deviceIPv6Enabled.value;
    nodes.value[editedNode.value].exec =
      deviceExecCmds.value !== "" ? deviceExecCmds.value : undefined;
    nodes.value[editedNode.value].sysctl =
      deviceSysctlOptions.value !== "" ? deviceSysctlOptions.value : undefined;
    nodes.value[editedNode.value].env =
      deviceEnv.value !== "" ? deviceEnv.value : undefined;
    nodes.value[editedNode.value].shell =
      deviceShell.value !== "" ? deviceShell.value : undefined;
    console.log("Update the selected network device");
  }
  document.getElementById("closeModalNetworkDevice")!.click();
};

const closeNetworkDeviceModal = () => {
  // reset value
  deviceName.value = "";
  deviceMemory.value = "";
  deviceCPUShare.value = 1;
  deviceBridgeEnabled.value = false;
  deviceIPv6Enabled.value = false;
  deviceExecCmds.value = "";
  //deviceSysctlOptions.value = "";
  deviceEnv.value = "";
  //deviceShell.value = "";
  nodeMode.value = true;
  editedNode.value = "";
};

// edge functions
let edgeMode = false; // true => add new edge, false => edit selected edge
const selectedDeviceInterfaceIndex = ref("0");
const selectedCDValue = ref("");

const isEdgeEligible = (selected: string[]): boolean => {
  if (selected.length !== 2) return false;
  if (labState.value !== LabState.EDITING) return false;
  const sourceName = selected[0];
  const targetName = selected[1];
  return nodes.value[sourceName].node_type !== nodes.value[targetName].node_type;
};

const openEdgeModal = (mode: boolean) => {
  edgeMode = mode;
};

const addEditEdge = () => {
  // create new link between device and CD
  if (edgeMode) {
    const [sourceName, targetName] = selectedNodes.value;
    let newDeviceInterface: DeviceInterface;
    // add new interface to device
    if (nodes.value[sourceName].node_type === "network_device") {
      newDeviceInterface = {
        index: selectedDeviceInterfaceIndex.value,
        cd: nodes.value[targetName].code,
      };
      nodes.value[sourceName].interfaces.push(newDeviceInterface);
    } else {
      newDeviceInterface = {
        index: selectedDeviceInterfaceIndex.value,
        cd: nodes.value[sourceName].code,
      };
      nodes.value[targetName].interfaces.push(newDeviceInterface);
    }
    // add edge to graph
    const edgeId = `edge${nextEdgeIndex.value}`;
    edges.value[edgeId] = {
      source: sourceName,
      target: targetName,
      info: newDeviceInterface,
    };
    nextEdgeIndex.value++;
  } else {
    // edit the current selected link
    console.log(`Edit the link ${edges.value[selectedEdges.value[0]]}`);
  }

  // close modal
  document.getElementById("closeModalEdge")!.click();
};

const removeEdge = () => {
  const edgeId = selectedEdges.value[0];
  const sourceNode = nodes.value[edges.value[edgeId].source];
  const targetNode = nodes.value[edges.value[edgeId].target];
  if (sourceNode.type === "network_device") {
    const cd_value = targetNode.code;
    sourceNode.interfaces = sourceNode.interfaces.filter(
      (int: DeviceInterface) => {
        return int.cd !== cd_value;
      }
    );
  } else {
    const cd_value = sourceNode.code;
    targetNode.interfaces = targetNode.interfaces.filter(
      (int: DeviceInterface) => {
        return int.cd !== cd_value;
      }
    );
  }
  delete edges.value[edgeId];
};

const onDeviceTypeChange = () => {
  switch (selectedDeviceType.value) {
    case "web-server":
      deviceDockerImage.value = "unibaktr/alpine:whoami";
      deviceSysctlOptions.value = "";
      deviceShell.value = "";
      break;
    case "traefik-balancer":
      deviceDockerImage.value = "unibaktr/alpine:traefik";
      deviceSysctlOptions.value = "";
      deviceShell.value = "";
      break;
    case "dns-server":
      deviceDockerImage.value = "unibaktr/alpine:coredns";
      deviceSysctlOptions.value = "";
      deviceShell.value = "";
      break;
    case "vpn-device":
      deviceDockerImage.value = "unibaktr/alpine:wireguard";
      deviceSysctlOptions.value = "";
      deviceShell.value = "";
      break;
    case "vyatta-router":
      deviceDockerImage.value = "unibaktr/vyos:1.4";
      deviceSysctlOptions.value = "net.ipv6.conf.all.disable_ipv6=0";
      deviceShell.value = "/bin/vyos";
      break;
    case "frr-router":
      deviceDockerImage.value = "unibaktr/alpine:frr";
      deviceSysctlOptions.value = "";
      deviceShell.value = "";
      break;
    case "client":
    case "linux-switch":
      deviceDockerImage.value = "unibaktr/alpine";
      deviceSysctlOptions.value = "";
      deviceShell.value = "";
      break;
    default:
      deviceDockerImage.value = "unibaktr/alpine";
      deviceSysctlOptions.value = "";
      deviceShell.value = "";
      break;
  }
};

const showToast = () => {
  const toast = new Toast(document.getElementById("lab-toast")!);
  toast.show();
}

const showIframeInModal= () => {
  showIframe.value = !showIframe.value;
}

const showGraphJson = () => {
  console.log(nodes.value);
  console.log(edges.value);
};

const createLab = async () => {
  labStore.convertGraphToTopo(nodes.value);
  // myWorker.send("Hello worker!").then((reply: any) => console.log(reply));
  await labStore.createLab();
}

const runLab = async () => {
  await labStore.runLab();
}

</script>

<style scoped>
.graph {
  width: 100%;
  height: 600px;
  border: 1px solid #fff;
  background-color: aliceblue;
}
.icon-circle,
.icon-picture {
  transition: all 0.1s linear;
}

.icon-picture {
  pointer-events: none;
}
</style>

import type {Node, Edge, Edges} from "v-network-graph";
import type {Layouts} from "v-network-graph";

export interface DeviceInterface {
  index: string;
  cd: string;
}

export interface CollisionDomain extends Node {
  node_type: string;
  code: string;
  icon: string;
  // pos_X: number;
  // pos_Y: number;
}

export interface NetworkDevice extends Node {
  node_type: string;
  type: string;
  docker_image: string;
  icon: string;
  interfaces?: DeviceInterface[];
  startup_script?: string;
  shutdown_script?: string;
  memory?: string;
  cpus?: number;
  bridged?: boolean;
  ipv6?: boolean;
  exec?: string;
  sysctl?: string;
  env?: string;
  shell?: string;
  // pos_X: number;
  // pos_Y: number;
}

export interface GraphLink extends Edge {
  info: DeviceInterface;
}

export interface TopologyModel {
  nodes: Record<string, CollisionDomain | NetworkDevice>;
  edges: Record<string, GraphLink>;
  usedCdCodes: string[];
  nextEdgeIndex: number;
  layout: Layouts;
}
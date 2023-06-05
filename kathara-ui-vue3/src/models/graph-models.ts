import type { Node, Edge } from "v-network-graph";

export interface DeviceInterface {
  index: string;
  cd: string;
}

export interface CollisionDomain extends Node {
  node_type: string;
  code: string;
  pos_X: number;
  pos_Y: number;
}

export interface NetworkDevice extends Node {
  node_type: string;
  type: string;
  docker_image: string;
  interfaces?: DeviceInterface[];
  startup_script?: string;
  memory?: string;
  cpus?: number;
  bridged?: boolean;
  ipv6?: boolean;
  exec?: string;
  sysctl?: string;
  env?: string;
  shell?: string;
  pos_X: number;
  pos_Y: number;
}

export interface KatharaLink extends Edge {
  info: DeviceInterface;
}

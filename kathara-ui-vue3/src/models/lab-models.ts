export interface KatharaLab {
    name: string;
    description?: string;
    version?: string;
    author?: string;
    email?: string;
    web?: string;
    topo: LabDevice[];
}

export interface LabDevice {
    name: string;
    image?: string;
    mem?: string;
    cpus?: number;
    port?: string[];
    ipv6?: boolean;
    exec?: string[];
    sysctl?: string[];
    env?: string[];
    shell?: string;
    num_terms?: number;
    net: Network[];
    bridged?: boolean;
    files?: MountedFile[];
}

export interface Network {
    interface: number;
    domain: string;
}

export interface MountedFile {
    name: string;
    location?: string;
    content: string;
}

export interface ConsoleIframe {
    component_name: string;
    machine_name: string;
}
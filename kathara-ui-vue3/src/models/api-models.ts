import type {LabState} from "@/models/lab-states";
import type {KatharaLab} from "@/models/lab-models";

export enum RequestType {
    CREATE_LAB = "CREATE_LAB",
    START_LAB = "START_LAB",
    GET_LAB_INFO = "GET_LAB_INFO",
    CLEAN_LAB = "CLEAN_LAB",
    WIPE_LAB = "WIPE_LAB"
}

interface BaseProperty {
    lab_name: string;
}

export interface Info {
    network_scenario_id: string;
    name:                string;
    container_id:        string;
    container_name:      string;
    user:                string;
    status:              string;
    image:               string;
    pids:                number;
    cpu_usage:           string;
    mem_usage:           string;
    mem_percent:         string;
    net_usage:           string;
}

export interface LabCreationRequest {
    lab: KatharaLab
}

export interface LabStartRequest extends BaseProperty {

}

export interface LabInfoRequest extends BaseProperty {
    lab_hash: string;
}

export interface LabCleanRequest extends BaseProperty {
    lab_hash: string;
}

export interface LabWipeRequest extends BaseProperty {
    lab_hash: string;
}

export interface ApiResponse extends BaseProperty {
    lab_hash?:   string;
    lab_status?: LabState;
    success?:    boolean | null;
    info?:       { [key: string]: Info } | null;
}

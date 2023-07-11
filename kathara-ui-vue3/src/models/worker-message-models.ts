import type {
    LabCleanRequest,
    LabCreationRequest,
    LabInfoRequest,
    LabStartRequest, LabWipeRequest,
    RequestType
} from "@/models/api-models";
import type {KatharaLab} from "@/models/lab-models";

export interface WorkerMessage {
    type: RequestType,
    data: KatharaLab | LabCreationRequest | LabStartRequest | LabInfoRequest | LabCleanRequest | LabWipeRequest | any;
}
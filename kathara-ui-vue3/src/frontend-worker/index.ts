import PromiseWorker from "promise-worker";
import MyWorker from './worker?worker';
import type {
    LabCreationRequest,
    LabInfoRequest
} from "@/models/api-models";
import {RequestType} from "@/models/api-models";

const worker = new MyWorker()
const promiseWorker = new PromiseWorker(worker);

const checkLabInfo = (request: LabInfoRequest) =>
    promiseWorker.postMessage({
        type: RequestType.GET_LAB_INFO,
        data: request
    })

export default {
    checkLabInfo,
};
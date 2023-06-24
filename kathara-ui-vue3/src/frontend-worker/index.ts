import PromiseWorker from "promise-worker";
import MyWorker from './worker?worker';
import type {LabCreationRequest} from "@/models/api-models";
import {RequestType} from "@/models/api-models";

const worker = new MyWorker()
const promiseWorker = new PromiseWorker(worker);

const createKatharaLab = (request: LabCreationRequest) =>
    promiseWorker.postMessage({
        type: RequestType.CREATE_LAB,
        data: request.lab
    })

export default {
    createKatharaLab,
};
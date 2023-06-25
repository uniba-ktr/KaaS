import registerPromiseWorker from 'promise-worker/register';

import type {WorkerMessage} from "@/models/worker-message-models";
import {RequestType} from "@/models/api-models";

import {kathara_api} from "@/support/httpCommon";

registerPromiseWorker((message: WorkerMessage) => {
    // if (message.type === 'message') {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(`Worker reply: ${JSON.stringify(message)}`);
    //         }, 10000);
    //     });
    // }
    if (message.type === RequestType.GET_LAB_INFO) {
        return new Promise((resolve, reject) => {
            kathara_api
                .post(`/linfo`, message.data)
                .then((resp) => resolve(resp.data))
                .catch((error) => reject(error))
        })
    }
})
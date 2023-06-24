import registerPromiseWorker from 'promise-worker/register';
import type {WorkerMessage} from "@/models/worker-message-models";
import {RequestType} from "@/models/api-models";

registerPromiseWorker((message: WorkerMessage) => {
    // if (message.type === 'message') {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(`Worker reply: ${JSON.stringify(message)}`);
    //         }, 10000);
    //     });
    // }
})
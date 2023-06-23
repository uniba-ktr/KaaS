import registerPromiseWorker from 'promise-worker/register'

registerPromiseWorker((message: any) => {
    if (message.type === 'message') {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(`Worker reply: ${JSON.stringify(message)}`);
            }, 10000);
        });
    }
})
import uvicorn
import json
from pathlib import Path
from random import random

from fastapi import FastAPI, Request, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import logging.config
from Kathara.manager.Kathara import Kathara
from Kathara.model.Lab import Lab
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi import status
from fastapi.responses import JSONResponse

from src.control.exceptions import InternalServerError
from src.control.lab_controller import LabController, KatharaWrapper
from src.model.enumerations import Schema, LabStatus
from src.model.lab_model import Laboratory
from src.model.message_model import Message
from src.control.validator import Validator

log = logging.getLogger(__name__)
LOGGING_CONFIG = Path(__file__).parent / '../res/logging.conf'
logging.config.fileConfig(LOGGING_CONFIG, disable_existing_loggers=False)

# TODO: need to adjust origins to docker container names!
origins = [
    "http://localhost",
    "http://localhost:8080",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def __error_handling__(ise: InternalServerError) -> dict:
    log.error(str(ise))
    resp_json = {"message": "error",
                 "error": ise.__json__()}
    Validator.validate_json(resp_json, Schema.message)
    return resp_json


@app.on_event("startup")
async def startup_event():
    log.info("Starting Up REST Service")
    LabController().__init__()


@app.on_event("shutdown")
def shutdown_event():
    log.debug("Shutting down. Wiping Kathara")
    KatharaWrapper.wipe()
    LabController().__init__()


@app.exception_handler(InternalServerError)
async def unicorn_exception_handler(request: Request, exc: InternalServerError):
    return JSONResponse(
        status_code=exc.status,
        content={"error_cause": exc.__class__.__name__,
                 "error_message": exc.message,
                 },
        media_type="application/json"
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder(
            {"error_cause": exc.__class__.__name__,
             "error_message": exc.errors(),
             "body": exc.body
             }),
        media_type="application/json"
    )


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    log.info("Awaiting WebSocket Connections")
    await websocket.accept()
    while True:
        try:
            info = await websocket.receive_json()
            info = Message(**info)
            # TODO: check if laboratory is in running state
            if info.lab_hash is not None:
                try:
                    stats = next(Kathara.get_instance().get_machines_stats(lab_hash=info.lab_hash, all_users=True))
                except Exception as e:
                    raise InternalServerError(e, "Can not find laboratory", status.HTTP_404_NOT_FOUND)
                log.info(stats)
                for key in stats:
                    stats[key] = stats[key].to_dict()
                info.success = True
                info.info = stats

            else:
                raise InternalServerError(IOError, "Hash value of the laboratory is required", status.HTTP_404_NOT_FOUND)

            # Send message to the client
            #resp = {'value': 'pong'}
            await websocket.send_json(info.dict())
        except Exception as e:
            raise InternalServerError(e, "Can not find laboratory", status.HTTP_404_NOT_FOUND)
    log.info("Closing WebSocket")


@app.get("/")
async def root():
    return {"title": "Kathara REST Interface",
            "content": "Go to /docs for REST endpoints"}


@app.get("/version")
async def version():
    version = Kathara.get_instance().get_release_version()
    log.info(version)
    return {
        "release_version": version
    }


@app.get("/vstart")
async def vstart():
    lab = Lab("kathara_vlab")
    # lab.add_option('hosthome_mount', args['no_hosthome'])
    lab.add_option('shared_mount', False)
    # lab.add_option('privileged_machines', args['privileged'])

    name = "test"
    device = lab.get_or_new_machine(name)

    lab.connect_machine_to_link(device.name, "A", machine_iface_number=int("0"))
    lab.check_integrity()

    Kathara.get_instance().deploy_lab(lab)
    return {
        "started": "new machine"
    }


@app.post("/wipe", response_model=Message)
async def wipe(info: Message) -> json:
    if info.lab_hash is not None:
        result = LabController().wipe_lab(info.lab_hash)
        result.success = True
        return result
    else:
        raise InternalServerError(IOError, "Can not find laboratory", status.HTTP_404_NOT_FOUND)


# TODO: Synchronous method!
@app.post("/linfo", response_model=Message)
async def lab_info(info: Message) -> json:
    log.info(info.json())
    if info.lab_hash is not None:
        try:
            stats = next(Kathara.get_instance().get_machines_stats(lab_hash=info.lab_hash, all_users=True))
        except Exception as e:
            raise InternalServerError(e, "Can not find laboratory", status.HTTP_404_NOT_FOUND)
        log.info(stats)
        for key in stats:
            stats[key] = stats[key].to_dict()
        info.success = True
        info.info = stats
        return info
    else:
        raise InternalServerError(IOError, "Hash value of the laboratory is required", status.HTTP_404_NOT_FOUND)


@app.post("/lstart", response_model=Message)
async def start_lab(info: Message) -> json:
    log.info(info.json())
    if info.lab_name is not None:
        result = LabController().start_lab(info.lab_name)
        result.success = True
        return result
    else:
        raise InternalServerError(IOError, "Can not find laboratory", status.HTTP_404_NOT_FOUND)


# TODO: lclean -> use lab_hash to clean up

# curl -X POST -H "Content-Type: application/json" -d "{\"message\": \"clean\", \"content\": {
# \"lab_name\":\"test\"}}" http://localhost:8000/lclean
@app.post("/lclean", response_model=Message)
async def clean_lab(info: Message):
    log.info(info.json())
    if info.lab_hash is not None:
        result = LabController().clean_lab(info.lab_hash)
        result.success = True
        return result
    else:
        raise InternalServerError(IOError, "Can not find laboratory", status.HTTP_404_NOT_FOUND)


# curl -X POST -H "Content-Type: application/json" -d @lab.json http://localhost:8000/lcreate
@app.post("/lcreate", response_model=Message)
async def create_lab(info: Laboratory):
    log.info("Creating Laboratory {}".format(info.json()))

    result = LabController().gen_lab(info)

    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

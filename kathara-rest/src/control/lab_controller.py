import logging
from concurrent.futures import Future

from concurrent.futures.thread import ThreadPoolExecutor
from typing import Dict, Any

import docker.errors
from Kathara.exceptions import MachineAlreadyExistsError

from src.control.borg import MetaBorg
from src.control.exceptions import InternalServerError
from src.control.kathara_wrapper import KatharaWrapper
from src.control.lab_wrapper import LabWrapper
from src.model.lab_model import Laboratory
from src.model.enumerations import LabStatus
from src.model.message_model import Message

log = logging.getLogger(__name__)


class LabController(metaclass=MetaBorg):
    def __init__(self, labs: Dict[str, LabWrapper] = {}):
        self.labs = labs
        self.executor = ThreadPoolExecutor(4)

    def __add_thread__(self, fn: (), *args: Any):
        log.debug("Adding thread to executor")
        image_future = self.executor.submit(fn, *args)
        image_future.add_done_callback(LabController().__callback__)

    def __callback__(self, future: Future):
        if future.exception() is not None:
            log.error("got exception: {0}".format(future.exception()))
        else:
            log.info("process returned {0}".format(future.result()))
            if LabStatus.running or LabStatus.created in future.result():
                lab = self.labs[future.result()[1]]
                lab.state = future.result()[0]
                log.info("Changed state of laboratory {}".format(str(lab)))

    @staticmethod
    def gen_lab(data: Laboratory) -> Dict[str, str]:
        lab_wrapper = LabWrapper(data.name)
        if not LabController().labs.__contains__(lab_wrapper.hash):
            LabController().labs[lab_wrapper.hash] = lab_wrapper
        else:
            return LabController().labs[lab_wrapper.hash].__json__()
        try:
            log.info("Deploying laboratory {}".format(str(data)))
            LabController().__add_thread__(lab_wrapper.gen_lab, data, lab_wrapper.hash)
        except Exception as e:
            raise InternalServerError(e, str(e))
        return lab_wrapper.__json__()

    @staticmethod
    def start_lab(lab_name: str) -> Message:
        lab = LabWrapper(lab_name)
        log.info(lab)
        if not LabController().labs.__contains__(lab.hash) and lab.state is LabStatus.created:
            lab = LabWrapper(lab_name, LabStatus.starting)
            LabController().labs[lab.hash] = lab
        elif LabController().labs[lab.hash].state is LabStatus.created:
            lab = LabController().labs[lab.hash]
        else:
            lab = LabController().labs[lab.hash]
            return lab.__message__()

        try:
            log.info("Deploying laboratory {}".format(str(lab)))
            LabController().__add_thread__(KatharaWrapper().deploy_lab, lab)
        except MachineAlreadyExistsError as e:
            log.error(str(e))
            raise InternalServerError(e, str(e))
        except docker.errors.APIError as ex:
            log.error(ex.explanation)
            raise InternalServerError(ex, str(ex))

        return lab.__message__()

    @staticmethod
    def clean_lab(lab_hash: str) -> Message:
        if not LabController().labs.__contains__(lab_hash):
            raise InternalServerError(IOError, "Laboratory was not found {}".format(lab_hash))
        lab = LabController().labs.get(lab_hash)
        if lab.state is LabStatus.running:
            lab.state = LabStatus.cleaning
        else:
            raise InternalServerError(IOError, "Laboratory can not be stopped {}".format(lab_hash))
        try:
            log.info("Cleaning laboratory {}".format(str(lab)))
            LabController().__add_thread__(KatharaWrapper.undeploy_lab, lab_hash)
        except Exception as e:
            log.error(str(e))
        return lab.__message__()

    @staticmethod
    def wipe_lab(lab_hash: str) -> Message:
        if not LabController().labs.__contains__(lab_hash):
            raise InternalServerError(IOError, "Laboratory was not found {}".format(lab_hash))
        lab = LabController().labs.get(lab_hash)
        if lab.state is LabStatus.created:
            lab.state = LabStatus.cleaning
        else:
            raise InternalServerError(IOError, "Laboratory can not be wiped {}".format(lab_hash))
        try:
            log.info("Wiping laboratory {}".format(str(lab)))
            lab.remove_lab()
            KatharaWrapper.wipe()
            LabController().labs.pop(lab_hash)
            log.info("Lab Hash {0} in {1}".format(lab_hash, LabController().labs))
            #LabController().__add_thread__(KatharaWrapper.undeploy_lab, lab_hash)
        except Exception as e:
            log.error(str(e))
        return lab.__message__()

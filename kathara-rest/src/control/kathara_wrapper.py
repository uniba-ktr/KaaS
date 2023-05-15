import logging
from typing import Tuple

from Kathara.manager.Kathara import Kathara

from src.control.lab_wrapper import LabWrapper
from src.model.enumerations import LabStatus

log = logging.getLogger(__name__)


class KatharaWrapper(object):

    @staticmethod
    def deploy_lab(lab: LabWrapper) -> Tuple[LabStatus, str]:
        log.info("Deployed in Thread")
        try:
            lab.__parse_lab__()
            Kathara.get_instance().deploy_lab(lab)
        except Exception as e:
            log.error(e)
        return LabStatus.running, lab.hash

    @staticmethod
    def undeploy_lab(lab_hash: str) -> Tuple[LabStatus, str]:
        log.info("Undeploying in Thread")
        Kathara.get_instance().undeploy_lab(lab_hash=lab_hash)
        return LabStatus.created, lab_hash

    @staticmethod
    def wipe():
        Kathara.get_instance().wipe(all_users=True)
        log.info("Wiping all laboratories")

import json
import os
import logging
import shutil
from typing import Tuple, AnyStr, Dict

from Kathara.parser.netkit.LabParser import LabParser
from Kathara.parser.netkit.FolderParser import FolderParser
from Kathara.model.Lab import Lab
from fastapi import status

from src.control.exceptions import InternalServerError
from src.model.enumerations import LabStatus
from src.model.lab_model import Laboratory, TopoItem, Files
from src.model.message_model import Message

log = logging.getLogger(__name__)


class LabWrapper(Lab):

    def __init__(self, lab_name: str, lab_state: LabStatus = LabStatus.submitted):
        self.state = lab_state
        super().__init__(name=lab_name, path=os.path.abspath(lab_name))

    def __parse_lab__(self):
        if self.state is LabStatus.created or LabStatus.starting or LabStatus.running or LabStatus.cleaning:
            if not os.path.isdir(os.path.abspath(self.name)):
                raise InternalServerError(IOError, "Laboratory Path not found for {}".format(self.name),
                                          status.HTTP_404_NOT_FOUND)
        else:
            raise InternalServerError(IOError, "Not able to start laboratory in state {}".format(self.state.value),
                                      status.HTTP_405_METHOD_NOT_ALLOWED)
        try:
            lab = LabParser.parse(self.path)
        except IOError as e:
            log.error(e.message)
            lab = FolderParser.parse(self.path)
        log.info("Parsed laboratory: {}".format(lab.hash))
        for item in lab.__slots__:
            self.__setattr__(item, lab.__getattribute__(item))

    def __str__(self) -> str:
        return "{0}: {1} - {2}".format(self.hash, self.name, self.state)

    def __json__(self) -> Dict[str, str]:
        return {"lab_name": self.name, "lab_hash": self.hash, "lab_status": self.state.value}

    def __message__(self) -> Message:
        return Message(lab_name=self.name, lab_hash=self.hash, lab_status=self.state)

    # TODO: ADD a proj_dir for saving the projects
    def gen_lab(self, data: Laboratory, lab_hash: str, proj_dir: str = None) -> Tuple[LabStatus, str]:
        log.info("Generating laboratory in the folder {}".format(data.name))
        log.info(data)
        os.makedirs(self.name, exist_ok=True)

        self.__save_json__(data.dict())

        lab_file = "LAB_NAME={}\n".format(repr(data.name))
        if data.description:
            lab_file += "LAB_DESCRIPTION={}\n".format(repr(data.description))
        if data.version:
            lab_file += "LAB_VERSION={}\n".format(repr(data.version))
        if data.author:
            lab_file += "LAB_AUTHOR={}\n".format(repr(data.author))
        if data.email:
            lab_file += "LAB_EMAIL={}\n".format(repr(data.email))
        if data.web:
            lab_file += "LAB_WEB={}\n".format(repr(data.web))

        lab_file += "\n"

        for host in data.topo:
            lab_file += self.__depac_host__(host)
            lab_file += "\n"

        with open(self.name + "/lab.conf", "w") as out:
            out.write(lab_file)

        if data.shared:
            self.__gen_files__(data.shared.files, "shared")

        return LabStatus.created, lab_hash

    def __depac_host__(self, topo_host: TopoItem) -> str:
        host_file = ""
        host = topo_host.dict()

        for key in host:
            if isinstance(host[key], str):
                host_file += "{0}[{1}]={2}\n".format(host["name"], key, repr(host[key]))
            elif isinstance(host[key], (bool, int, float)):
                host_file += "{0}[{1}]=\'{2}\'\n".format(host["name"], key, host[key])
            elif isinstance(host[key], list):
                for item in host[key]:
                    if isinstance(item, str):
                        host_file += "{0}[{1}]={2}\n".format(host["name"], key, repr(item))
                    elif isinstance(item, dict):
                        if key == "net":
                            host_file += "{0}[{1}]={2}\n".format(host['name'], item["interface"], repr(item["domain"]))
                        if key == "files":
                            self.__gen_files__(topo_host.files, topo_host.name)
        return host_file

    def __gen_files__(self, file_list: Files, name: str):
        log.info(file_list)
        for file in file_list.__root__:
            subdir = self.name
            if file.location:
                location = file.location if file.location[0] == "/" else "/{}".format(file.location)
                subdir = "{0}/{1}{2}".format(self.name, name, location)
                os.makedirs(subdir, exist_ok=True)
            with open(subdir + "/" + file.name, "w") as out:
                out.write(file.content)

    def __save_json__(self, data: json):
        os.makedirs(self.name, exist_ok=True)
        with open(self.name + "/lab.json", "w") as out:
            out.write(json.dumps(data))

    def __load_json__(self, name: str):
        try:
            with open(name + "/lab.json", "r") as f:
                self.__dict__ = json.load(f)
        except FileNotFoundError as e:
            log.error("File not found: {}".format(name))
            raise InternalServerError(e, str(e))

    def remove_lab(self):
        log.debug("Removing {}", format(self.name))
        shutil.rmtree(self.name)
        self.state = LabStatus.removed
        return LabStatus.removed, self.hash

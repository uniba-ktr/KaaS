from enum import Enum


class Schema(Enum):
    laboratory = 'laboratory'
    message = 'message'

    def __str__(self) -> str:
        return "{0}".format(self.name).lower()

    def __file__(self) -> str:
        return "../res/schemas/{}.json".format(self.name).lower()


class LabStatus(str, Enum):
    submitted = 'submitted'
    created = 'created'
    starting = 'starting'
    running = 'running'
    cleaning = 'cleaning'
    removed = 'removed'

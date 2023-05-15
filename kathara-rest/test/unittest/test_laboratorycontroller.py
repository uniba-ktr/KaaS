import os
from pathlib import Path
from tempfile import mkdtemp
from unittest import mock

import pytest

from src.control.lab_controller import LabWrapper, LabController
from src.model.enumerations import LabStatus
from src.model.message_model import Message


@pytest.fixture()
def default_scenario():
    return LabWrapper("default_scenario")


@pytest.fixture()
def default_message(default_scenario: LabWrapper):
    return Message(lab_name=default_scenario.name, lab_hash=default_scenario.hash, lab_status=default_scenario.state)


@pytest.fixture()
def temporary_path():
    return mkdtemp("kathara_test")


@pytest.fixture()
def directory_scenario(temporary_path):
    Path(os.path.join(temporary_path, "shared.startup")).touch()
    Path(os.path.join(temporary_path, "shared.shutdown")).touch()
    return LabWrapper("directory_scenario", path=temporary_path)


def test_default_scenario_creation(default_scenario: LabWrapper):
    assert default_scenario.name == "default_scenario"
    assert default_scenario.state.value == LabStatus.submitted.value
    assert default_scenario.description is None
    assert default_scenario.version is None
    assert default_scenario.author is None
    assert default_scenario.email is None
    assert default_scenario.web is None
    assert default_scenario.machines == {}
    assert default_scenario.links == {}
    assert default_scenario.general_options == {}
    assert not default_scenario.has_dependencies
    assert default_scenario.path == os.path.abspath("default_scenario")
    assert default_scenario.shared_shutdown_path is None
    assert default_scenario.shared_startup_path is None
    assert default_scenario.shared_folder is None
    # assert default_scenario.hash == utils.generate_urlsafe_hash(default_scenario.name)


@mock.patch.object(LabController, '__callback__', autospec=True)
def test_gen_lab(mock___callback__: mock, default_scenario: LabWrapper):
    res_json = LabController.gen_lab(default_scenario)
    assert res_json == default_scenario.__json__()


def test_start_lab(default_scenario: LabWrapper, default_message: Message):
    res_message = LabController.start_lab(default_scenario.name)
    assert res_message == default_message


def test_clean_lab(default_scenario: LabWrapper, default_message: Message):
    res_message = LabController.clean_lab(default_scenario.hash)
    assert res_message == default_message


import builtins
import json
import os.path
import unittest
from unittest import mock
from unittest.mock import mock_open, patch, MagicMock, Mock

from Kathara.utils import generate_urlsafe_hash
from src.control.lab_wrapper import LabWrapper
from src.model.enumerations import LabStatus
from src.model.lab_model import Laboratory, TopoItem, NetItem
import pytest

from src.model.message_model import Message


@pytest.fixture()
def default_message() -> Message:
    lab_name = "test"
    lab_hash = generate_urlsafe_hash(os.path.abspath(lab_name))
    return Message(lab_name=lab_name, lab_hash=lab_hash, lab_status=LabStatus.submitted)


@pytest.fixture()
def default_lab_wrapper(default_message: Message) -> LabWrapper:
    return LabWrapper(default_message.lab_name)


@pytest.fixture()
def default_lab_json(default_message: Message) -> dict:
    ret_json = default_message.dict()
    ret_json.pop("success")
    ret_json.pop("info")
    ret_json["lab_status"] = ret_json["lab_status"].value
    return ret_json


@pytest.fixture()
def default_laboratory() -> Laboratory:
    net_item = NetItem(interface=0, domain="A")
    topo_item = TopoItem(name="pc1", net=[net_item])
    lab = Laboratory(name="test", topo=[topo_item])
    return lab


def test__message__(default_message: Message, default_lab_wrapper: LabWrapper):
    assert default_lab_wrapper.__message__() == default_message


def test__json__(default_lab_json: json, default_lab_wrapper: LabWrapper):
    assert default_lab_wrapper.__json__() == default_lab_json


@mock.patch('os.makedirs', mock.Mock(return_value=0))
@mock.patch('builtins.open', new=mock.mock_open(), create=True)
def test_gen_lab(default_laboratory: Laboratory, default_lab_wrapper: LabWrapper):
    res = default_lab_wrapper.gen_lab(default_laboratory, default_lab_wrapper.hash)
    assert os.makedirs.called
    os.makedirs.assert_called_with('test', exist_ok=True)
    builtins.open.assert_called_with('test/lab.conf', "w")
    builtins.open.return_value.__enter__().write.assert_called_with("LAB_NAME='test'\n\npc1[name]='pc1'\npc1[0]='A'\n\n")
    assert res[0] == LabStatus.created
    assert res[1] == default_lab_wrapper.hash
    #assert not res


@mock.patch('os.makedirs', mock.Mock(return_value=0))
@mock.patch('builtins.open', new=mock.mock_open(), create=True)
def test__save_json__(default_laboratory: Laboratory, default_lab_wrapper: LabWrapper):
    default_lab_wrapper.__save_json__(default_laboratory.dict())
    assert os.makedirs.called
    assert builtins.open.called
    builtins.open.assert_called_with("test/lab.json", "w")
    builtins.open.return_value.__enter__().write.assert_called_once_with(json.dumps(default_laboratory.dict()))
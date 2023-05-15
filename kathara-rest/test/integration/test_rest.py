import builtins
import json

import os.path

from concurrent.futures import Future
from typing import Any
from unittest import mock

import pytest
from Kathara.utils import generate_urlsafe_hash
from fastapi.testclient import TestClient

from src.control.lab_controller import LabController
from src.model.enumerations import LabStatus
from src.model.message_model import Message
from src.rest import app
from test.utils.file_reader import read_file

client = TestClient(app)


@pytest.fixture
def load_json_fixture() -> str:
    payload = read_file('lab.json')
    yield payload


@pytest.fixture()
def default_message() -> Message:
    lab_name = "example"
    lab_hash = generate_urlsafe_hash(os.path.abspath(lab_name))
    yield Message(lab_name=lab_name, lab_hash=lab_hash, lab_status=LabStatus.submitted)


def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}


class MockLabController(LabController):

    # Creating a method that is not running in a background thread
    def __add_thread__(self, fn: (), *args: Any):
        test_future = Future()
        try:
            test_future.set_result(fn(*args))
        except Exception as e:
            test_future.set_exception(e)
        self.__callback__(test_future)


# We are overriding LabController.__add_thread__ to do sequential testing without threads
@mock.patch('os.makedirs', mock.Mock(return_value=0))
@mock.patch('builtins.open', new=mock.mock_open(), create=True)
@mock.patch.object(LabController, '__add_thread__', autospec=True, side_effect=MockLabController.__add_thread__)
def test_lcreate(mock___add_thread__: mock, load_json_fixture: str, default_message: Message):
    response = client.post(url="/lcreate", json=load_json_fixture)

    assert load_json_fixture["name"] == "example"
    assert mock___add_thread__.called

    assert os.makedirs.called
    os.makedirs.assert_any_call('example', exist_ok=True)
    builtins.open.assert_any_call('example/shared.startup', 'w')
    builtins.open.return_value.__enter__().write.assert_any_call("#!/bin/sh\nip address add 192.168.0.1/24 dev eth0\n")

    assert response.status_code == 200
    assert response.json()['lab_name'] == default_message.lab_name
    assert response.json()['lab_hash'] == default_message.lab_hash
    assert response.json()['lab_status'] == LabStatus.created.value


def test_lcreate_error():
    response = client.post(url="/lcreate", json={"name": "example"})

    assert response.status_code == 422
    assert response.json()['error_cause'] == "RequestValidationError"


@mock.patch.object(LabController, '__add_thread__', autospec=True, side_effect=MockLabController.__add_thread__)
def test_lstart_error(mock___add_thread__: mock, default_message: Message):
    response = client.post(url="/lstart", json={"lab_name": "example"})

    assert response.status_code == 200
    assert mock___add_thread__.called

    #assert response.json() == default_message.json()

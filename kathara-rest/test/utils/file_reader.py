import json
from pathlib import Path

BASE_PATH = Path.cwd().joinpath('..', 'test', 'data')


def read_file(file_name: str) -> dict:
    if '.json' in file_name:
        path = BASE_PATH.joinpath(file_name)
    else:
        path = BASE_PATH.joinpath(f'{file_name}.json')

    with path.open(mode='r') as f:
        return json.load(f)

import json
import logging

from jsonschema import validate, ValidationError

from src.control.exceptions import InternalServerError
from src.model.enumerations import Schema

log = logging.getLogger(__name__)


class Validator(object):

    @staticmethod
    def load_schema(schema: Schema) -> json:
        with open(schema.__file__(), 'r') as f:
            schema_data = f.read()
        return json.loads(schema_data)

    @staticmethod
    def validate_json(data: json, schema: Schema):
        try:
            validate(data, Validator.load_schema(schema))
        except ValidationError as e:
            log.error(e.schema["error_msg"] if "error_msg" in e.schema else e.message)
            raise InternalServerError(e, e.schema["error_msg"] if "error_msg" in e.schema else e.message)


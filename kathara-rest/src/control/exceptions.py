import string
from fastapi import status


class InternalServerError(Exception):

    def __init__(self, source: Exception, message: string, status_code: status = status.HTTP_400_BAD_REQUEST):
        self.source = source
        self.message = message
        self.status = status_code
        super().__init__(self.message)

    def __str__(self):
        return f'{self.source.__name__} -> {self.message}'

    def __json__(self) -> dict:
        return {"error_cause": type(self.source).__name__, "error_message": self.message}

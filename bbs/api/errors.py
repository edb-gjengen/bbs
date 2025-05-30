import strawberry


@strawberry.interface
class Error:
    message: str

    @strawberry.field()
    def error(self) -> bool:
        return True


@strawberry.type
class FieldError(Error):
    field: str


@strawberry.type
class FormErrors:
    fields: list[FieldError]
    message: str = ""
    error: bool = True

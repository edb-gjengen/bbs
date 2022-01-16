from dataclasses import dataclass

from django.contrib.auth.models import User
from graphql.pyutils import snake_to_camel
import strawberry
from strawberry.arguments import is_unset
from strawberry.types import ExecutionResult

from main.api.schema import schema
from typing import Any, Iterable, Type

from django.test.client import RequestFactory


def lowercase_first_letter(text: str):
    return text[0].lower() + text[1:]


def is_valid_field_values(values: Iterable) -> bool:
    return isinstance(values, list) and all(isinstance(value, str) or isinstance(value, dict) for value in values)


@dataclass
class MutationTest:
    """Helper class to test graphql mutations"""

    mutation: Type[strawberry.mutation]
    fields: Iterable[str]
    user: User = None
    _schema: strawberry.Schema = schema  # FIXME: take as arg

    def __str__(self) -> str:
        return f"MutationTest ({self.name})"

    @property
    def name(self) -> str:
        return snake_to_camel(self.mutation.name)

    @property
    def arguments(self) -> Iterable[dict[str, Any]]:
        return [
            {
                "name": lowercase_first_letter(snake_to_camel(arg.python_name)),
                "type": self._schema.schema_converter.from_argument(arg).type,
                "is_required": is_unset(arg),
            }
            for arg in self.mutation.arguments
        ]

    @property
    def required_arguments(self) -> Iterable[dict[str, Any]]:
        return [arg for arg in self.arguments if arg["is_required"]]

    @property
    def optional_arguments(self) -> Iterable[dict[str, Any]]:
        return [arg for arg in self.arguments if not arg["is_required"]]

    @property
    def mutation_args(self) -> tuple[Iterable[str], Iterable[str]]:
        _definitions = []
        _inputs = []

        for arg in self.arguments:
            name = arg["name"]

            _definitions.append(f"${name}: {arg['type']}")
            _inputs.append(f"{name}: ${name}")

        return _definitions, _inputs

    @classmethod
    def expand_field(cls, field):
        if isinstance(field, str):
            return field
        if isinstance(field, dict):
            field_string = ""
            for key, values in field.items():
                if not is_valid_field_values(values):
                    raise ValueError("Wrong format in MutationTest retrieval fields")

                values_string = ", ".join(cls.expand_field(value) for value in values)
                field_string = f"""
                    {field_string}
                    {key} {{
                        {values_string}
                    }}
                """
            return field_string

        raise ValueError("MutationTest: Fields can only be strings or dicts")

    @property
    def serialize(self) -> str:
        _definitions, _inputs = self.mutation_args
        definitions = ", ".join(_definitions)
        inputs = ", ".join(_inputs)
        operation_name = lowercase_first_letter(self.name)
        if not isinstance(self.fields, str):
            expanded_fields = [self.expand_field(field) for field in self.fields]
            return_fields = " ".join(expanded_fields)
        else:
            return_fields = self.fields

        return f"""mutation {self.name}({definitions}) {{
  {operation_name}({inputs}) {{
    {return_fields}
  }}
}}"""

    @property
    def user_request(self):
        request_factory = RequestFactory()
        request = request_factory.get("/api/v2/graphql/")
        if self.user:
            request.user = self.user
        return request

    # Perform the mutation
    # only keyword args please
    def mutate(self, **kwargs) -> ExecutionResult:
        variables = {lowercase_first_letter(snake_to_camel(name)): val for name, val in kwargs.items()}
        required_names = set(arg["name"] for arg in self.required_arguments)

        missing_args = required_names - set(variables.keys())
        if missing_args:
            raise ValueError(f"Missing required arguments: {missing_args}")

        # Execute mutation
        return self._schema.execute_sync(
            query=self.serialize, variable_values=variables, context_value=self.user_request
        )

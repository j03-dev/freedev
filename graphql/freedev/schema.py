import strawberry
import strawberry_django
from strawberry_django import auth
from strawberry_django.utils.requests import get_request
from strawberry_django.optimizer import DjangoOptimizerExtension

from django.contrib import auth as django_auth
from django.core.exceptions import ValidationError

from users.types import (
    User,
    UserInput,
)

import typing as std


@strawberry.type
class Query:
    # me: User = auth.current_user()
    me: std.List[User] = strawberry_django.field()


@strawberry.type
class Mutation:
    register: User = auth.register(UserInput)
    logout = strawberry_django.auth.logout()

    @strawberry_django.mutation
    def login(self, info, email: str, password: str) -> User:
        request = get_request(info)
        user = django_auth.authenticate(
            request,
            email=email,
            password=password,
        )
        if user is None:
            raise ValidationError("Incorret email/password")
        try:
            django_auth.login(request, user)
        except AttributeError:
            pass
        return user


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[DjangoOptimizerExtension],
)

import strawberry
import strawberry_django
from strawberry_django import auth, mutations
from strawberry.file_uploads import Upload
from strawberry_django.utils.requests import get_request
from strawberry_django.optimizer import DjangoOptimizerExtension

from django.contrib import auth as django_auth
from django.core.exceptions import ValidationError
from django.contrib.auth.base_user import AbstractBaseUser

from users import models
from users.types import (
    User,
    UserInput,
    UserPartialInput,
    UserImage,
)
import typing

@strawberry.type
class Query:
    me = auth.current_user()


@strawberry.type
class Mutation:
    # User mutations
    register: User = auth.register(UserInput)
    update_user: User = mutations.update(UserPartialInput)
    delete_user: User = mutations.delete()

    @strawberry.mutation
    def login(self, info, email: str, password: str) -> User:
        request = get_request(info)
        user = django_auth.authenticate(request, email=email, password=password)
        if user is None:
            raise ValidationError("Incorret email/password")
        try:
            django_auth.login(request, user)
        except AttributeError:
            pass
        return user

    # User image mutations
    @strawberry.mutation
    def upload_user_image(
        self, info, user_id: strawberry.ID, image: Upload
    ) -> UserImage:
        user = models.User.objects.get(id=user_id)
        user_image = models.UserImage.objects.create(image=image)
        user.user_images.add(user_image)

        # If user has no active image, set this as active
        if not user.active_image:
            user.active_image = user_image
            user.save()

        return user_image

    @strawberry.mutation
    def set_active_image(
        self, info, user_id: strawberry.ID, image_id: strawberry.ID
    ) -> User:
        user = models.User.objects.get(id=user_id)
        image = models.UserImage.objects.get(id=image_id)

        user.set_active_image(image)
        return user

    @strawberry.mutation
    def delete_user_image(
        self, info, user_id: strawberry.ID, image_id: strawberry.ID
    ) -> User:
        user = models.User.objects.get(id=user_id)
        image = models.UserImage.objects.get(id=image_id)

        if user.active_image == image:
            user.active_image = None
            user.save()

        user.user_images.remove(image)
        image.delete()

        return user


schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    extensions=[DjangoOptimizerExtension],
)

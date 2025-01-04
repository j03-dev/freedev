# types.py
from typing import Optional, List
from strawberry import auto
import strawberry_django
from django.contrib.auth import get_user_model
from . import models


# Filters
@strawberry_django.filters.filter(get_user_model(), lookups=True)
class UserFilter:
    id: auto
    username: auto
    email: auto
    first_name: auto
    last_name: auto


@strawberry_django.filters.filter(models.UserImage, lookups=True)
class UserImageFilter:
    id: auto
    created_at: auto


# Ordering
@strawberry_django.ordering.order(get_user_model())
class UserOrder:
    username: auto
    email: auto
    first_name: auto
    last_name: auto


@strawberry_django.ordering.order(models.UserImage)
class UserImageOrder:
    id: auto
    created_at: auto


# Types
@strawberry_django.type(
    models.UserImage,
    filters=UserImageFilter,
    order=UserImageOrder,
    pagination=True,
)
class UserImage:
    id: auto
    image: auto
    created_at: auto

    @strawberry_django.field
    def image_url(self) -> str:
        return self.image.url if self.image else None


@strawberry_django.type(
    get_user_model(),
    filters=UserFilter,
    order=UserOrder,
    pagination=True,
)
class User:
    id: auto
    username: auto
    email: auto
    first_name: auto
    last_name: auto
    user_images: List[UserImage]
    active_image: Optional[UserImage]


# Input Types
@strawberry_django.input(get_user_model())
class UserInput:
    username: auto
    email: auto
    password: auto
    first_name: Optional[str] = None
    last_name: Optional[str] = None


@strawberry_django.input(get_user_model(), partial=True)
class UserPartialInput(UserInput):
    pass

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)
    user_images = models.ManyToManyField(
        "UserImage",
        related_name="users",
    )
    active_image = models.OneToOneField(
        "UserImage",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def set_active_image(self, image):
        if image in self.user_images.all():
            self.active_image = image
            self.save()
        else:
            raise ValueError(
                "The specified image does not belong to this user.",
            )

    class Meta(AbstractUser.Meta):
        swappable = "AUTH_USER_MODEL"


class UserImage(models.Model):
    image = models.ImageField()
    created_at = models.DateTimeField(auto_now_add=True)

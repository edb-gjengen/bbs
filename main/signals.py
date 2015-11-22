from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from main.models import UserProfile


@receiver(post_save, sender=get_user_model(), dispatch_uid='randomz')
def create_user_profile(sender, instance, created, **kwargs):
    # Create a new UserProfile object when we create a new User.
    if created:
        UserProfile.objects.create(user=instance)
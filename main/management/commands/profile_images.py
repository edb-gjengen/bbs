from django.core.management.base import BaseCommand, CommandParser

from main.models import UserProfile


class Command(BaseCommand):
    """Set profile image URL for all users"""

    def add_arguments(self, parser: CommandParser):
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--force", action="store_true")

    def handle(self, *args, dry_run=False, force=False, **options):
        for profile in UserProfile.objects.all().order_by("id"):
            if dry_run:
                print(profile.user.email, profile.image_url())
            else:
                if force or not profile.image:
                    profile.image = profile.image_url()
                    profile.save()

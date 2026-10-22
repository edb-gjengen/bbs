from datetime import UTC, datetime

from django.contrib.auth import get_user_model

from bbs.models import UserProfile


def test_last_purchase_date_without_orders_is_timezone_aware(db):  # noqa: ARG001
    user = get_user_model().objects.create_user(username="no-purchases")
    profile = UserProfile.objects.create(user=user)

    assert profile.last_purchase_date() == datetime.min.replace(tzinfo=UTC)

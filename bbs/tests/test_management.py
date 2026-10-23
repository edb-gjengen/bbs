import pytest
from django.core.management import call_command

from bbs.models import UserProfile


def test_profile_images_updates_missing_image(user):
    UserProfile.objects.filter(pk=user.profile.pk).update(image="")

    call_command("profile_images")

    user.profile.refresh_from_db()
    assert user.profile.image != ""


def test_profile_images_dry_run_skips_update(user):
    UserProfile.objects.filter(pk=user.profile.pk).update(image="")

    call_command("profile_images", dry_run=True)

    user.profile.refresh_from_db()
    assert user.profile.image == ""


def test_profile_images_force_overwrites_existing_image(user):
    UserProfile.objects.filter(pk=user.profile.pk).update(image="https://example.com/old.jpg")

    call_command("profile_images", force=True)

    user.profile.refresh_from_db()
    assert user.profile.image not in ("", "https://example.com/old.jpg")


@pytest.mark.django_db
def test_export_schema_writes_file(tmp_path, settings):
    settings.BASE_DIR = str(tmp_path)

    call_command("export_schema")

    schema_file = tmp_path / "schema.graphql"
    assert schema_file.exists()
    assert "type Query" in schema_file.read_text()


@pytest.mark.django_db
def test_export_schema_stdout_does_not_write_file(tmp_path, settings, capsys):
    settings.BASE_DIR = str(tmp_path)

    call_command("export_schema", filename="-")

    assert not (tmp_path / "schema.graphql").exists()
    assert capsys.readouterr().out == ""

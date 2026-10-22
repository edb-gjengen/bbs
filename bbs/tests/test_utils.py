from bbs.utils import format_username


def test_format_username():
    assert format_username("Ada", "Lovelace") == "adalovela"


def test_format_username_truncates_names():
    assert format_username("Aleksandar", "Vukovic") == "aleksavukovi"


def test_format_username_removes_spaces():
    assert format_username("Mary Jane", "van Dijk") == "maryjavandij"


def test_format_username_drops_non_ascii_characters():
    assert format_username("Ångström", "Ø") == "ngstr"


def test_format_username_allows_empty_names():
    assert format_username("", "") == ""

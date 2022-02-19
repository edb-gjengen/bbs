def format_username(firstname: str, lastname: str):
    first = firstname.lower().strip().replace(" ", "")[:6].encode("ascii", "ignore").decode("utf-8")
    last = lastname.lower().strip().replace(" ", "")[:6].encode("ascii", "ignore").decode("utf-8")

    return f"{first}{last}"

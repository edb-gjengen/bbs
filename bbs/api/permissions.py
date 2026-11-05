"""Who may do what through the API, using the same rules as the Django admin."""


def _admin_can(user, permission):
    # The admin only lets in staff, and then checks the model permission (superusers have all of them)
    return user.is_authenticated and user.is_staff and user.has_perm(permission)


def can_add_products(user):
    return _admin_can(user, "bbs.add_product")


def can_change_products(user):
    return _admin_can(user, "bbs.change_product")

def format_username(firstname, lastname):
    first = firstname.lower().strip().replace(" ", "")[:6].encode('ascii', 'ignore')
    last = lastname.lower().strip().replace(" ", "")[:6].encode('ascii', 'ignore')

    return "{0}{0}".format(first, last)

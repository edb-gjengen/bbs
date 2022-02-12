from django.contrib import messages
from django.shortcuts import redirect, render

from main.forms import SimpleCreateUserForm


def create_user(request):
    if request.method == "POST":
        form = SimpleCreateUserForm(data=request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, f"Hurra! {user.first_name}{user.last_name} er lagt til")
            return redirect("create-user")

        else:
            messages.error(request, "Feil med skjemaet, se under.")
            form = SimpleCreateUserForm(data=request.POST)
    else:
        form = SimpleCreateUserForm()

    return render(request, "registration/create_user.html", {"form": form})

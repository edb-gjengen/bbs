# Create your views here.
from django.contrib.auth import login, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.forms.formsets import formset_factory

from models import *

from forms import *

def home(request):
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            # Log the user in.
            login(request, form.get_user())
    else:
        if request.user.is_authenticated():
            # Redirect to the register
            return HttpResponseRedirect( reverse('bbs.main.views.register') )
        else:
            form = AuthenticationForm(request)
    return render_to_response('home.html', locals(), context_instance=RequestContext(request))

@login_required
def register(request):
    if request.method == "POST":
        # TODO: Form processing is not working at all
        form = OrderLineForm(data=request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect( reverse('bbs.main.views.register') )
    products = Product.objects.all()
    users = User.objects.all()
    # Formset for orderlines
    # FIXME: Like this?
    #OrderLineFormSet = formset_factory(OrderLineForm, extra=products.count())
    #formset = OrderLineFormSet()
    return render_to_response('register.html', locals(), context_instance=RequestContext(request))

def logout(request):
    auth_logout(request)
    return render_to_response('registration/logout.html', locals(), context_instance=RequestContext(request))

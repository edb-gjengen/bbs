# Create your views here.
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext

from models import *

def home(request):
    products = Product.objects.all()
    users = User.objects.all()
    return render_to_response('home.html', locals(), context_instance=RequestContext(request))

from main.api.serializers import ProductSerializer
from main.models import Product
from rest_framework.viewsets import ModelViewSet


class ProductViewSet(ModelViewSet):
    # TODO: auth
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

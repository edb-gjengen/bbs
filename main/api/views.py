from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from main.api.serializers import ProductSerializer, ProductStatSerializer
from main.models import Product


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    @list_route(methods=['get'])
    def group_by_user(self, request):
        products = self.get_queryset().filter(active=True)
        serializer = ProductStatSerializer(products, many=True)

        return Response(serializer.data)

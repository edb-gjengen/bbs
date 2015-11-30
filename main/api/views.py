from rest_framework import mixins
from rest_framework.decorators import list_route
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from main.api.serializers import ProductSerializer, ProductStatSerializer
from main.models import Product
from rest_framework.viewsets import GenericViewSet


class ProductViewSet(mixins.ListModelMixin,
                     mixins.RetrieveModelMixin,
                     GenericViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [AllowAny]

    @list_route(methods=['get'], permission_classes=[AllowAny])
    def group_by_user(self, request):
        products = self.get_queryset().filter(active=True)
        serializer = ProductStatSerializer(products, many=True)

        return Response(serializer.data)


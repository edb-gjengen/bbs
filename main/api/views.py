from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.response import Response

from main.api.serializers import ProductSerializer, ProductStatSerializer
from main.models import Product
from rest_framework.viewsets import GenericViewSet


class ProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    @action(detail=False, methods=["get"])
    def group_by_user(self, request):
        products = self.get_queryset().filter(active=True)
        serializer = ProductStatSerializer(products, many=True)

        return Response(serializer.data)

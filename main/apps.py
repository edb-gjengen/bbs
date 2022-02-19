from django.apps import AppConfig


class BBSAppConfig(AppConfig):
    name = "main"
    verbose_name = "Biceps Bar System"

    def ready(self):
        # all models are loaded, could attach signals
        pass

from django.apps import AppConfig


class BBSAppConfig(AppConfig):
    name = 'bbs'
    verbose_name = 'Biceps Bar System'

    def ready(self):
        # all models are loaded, now attach signals
        import main.signals

# Generated by Django 4.0.2 on 2023-06-28 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bbs', '0002_alter_inventorytransaction_amount_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='order_sum',
            field=models.DecimalField(db_column='sum', decimal_places=1, max_digits=9),
        ),
    ]

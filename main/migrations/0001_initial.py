# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Product'
        db.create_table('main_product', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=64)),
            ('sale_price_int', self.gf('django.db.models.fields.FloatField')()),
            ('sale_price_ext', self.gf('django.db.models.fields.FloatField')()),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=256, blank=True)),
            ('volume_liter', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('alcohol_percent', self.gf('django.db.models.fields.FloatField')(null=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
            ('customer_support', self.gf('django.db.models.fields.CharField')(max_length=32, blank=True)),
            ('active', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('updated', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
        ))
        db.send_create_signal('main', ['Product'])

        # Adding model 'Order'
        db.create_table('main_order', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('customer', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('order_sum', self.gf('django.db.models.fields.FloatField')(db_column='sum')),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal('main', ['Order'])

        # Adding model 'OrderLine'
        db.create_table('main_orderline', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('order', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Order'])),
            ('product', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Product'])),
            ('amount', self.gf('django.db.models.fields.IntegerField')()),
            ('unit_price', self.gf('django.db.models.fields.FloatField')()),
        ))
        db.send_create_signal('main', ['OrderLine'])

        # Adding unique constraint on 'OrderLine', fields ['order', 'product']
        db.create_unique('main_orderline', ['order_id', 'product_id'])

        # Adding model 'Transaction'
        db.create_table('main_transaction', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('amount', self.gf('django.db.models.fields.FloatField')()),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal('main', ['Transaction'])

        # Adding model 'UserProfile'
        db.create_table('main_userprofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['auth.User'], unique=True)),
            ('balance', self.gf('django.db.models.fields.FloatField')(default=0.0)),
            ('image', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
        ))
        db.send_create_signal('main', ['UserProfile'])


    def backwards(self, orm):
        # Removing unique constraint on 'OrderLine', fields ['order', 'product']
        db.delete_unique('main_orderline', ['order_id', 'product_id'])

        # Deleting model 'Product'
        db.delete_table('main_product')

        # Deleting model 'Order'
        db.delete_table('main_order')

        # Deleting model 'OrderLine'
        db.delete_table('main_orderline')

        # Deleting model 'Transaction'
        db.delete_table('main_transaction')

        # Deleting model 'UserProfile'
        db.delete_table('main_userprofile')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'main.order': {
            'Meta': {'object_name': 'Order'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'customer': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'order_sum': ('django.db.models.fields.FloatField', [], {'db_column': "'sum'"})
        },
        'main.orderline': {
            'Meta': {'unique_together': "(('order', 'product'),)", 'object_name': 'OrderLine'},
            'amount': ('django.db.models.fields.IntegerField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'order': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['main.Order']"}),
            'product': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['main.Product']"}),
            'unit_price': ('django.db.models.fields.FloatField', [], {})
        },
        'main.product': {
            'Meta': {'object_name': 'Product'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'alcohol_percent': ('django.db.models.fields.FloatField', [], {'null': 'True'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'customer_support': ('django.db.models.fields.CharField', [], {'max_length': '32', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '256', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            'sale_price_ext': ('django.db.models.fields.FloatField', [], {}),
            'sale_price_int': ('django.db.models.fields.FloatField', [], {}),
            'updated': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'volume_liter': ('django.db.models.fields.FloatField', [], {'null': 'True'})
        },
        'main.transaction': {
            'Meta': {'object_name': 'Transaction'},
            'amount': ('django.db.models.fields.FloatField', [], {}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']"})
        },
        'main.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'balance': ('django.db.models.fields.FloatField', [], {'default': '0.0'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['auth.User']", 'unique': 'True'})
        }
    }

    complete_apps = ['main']
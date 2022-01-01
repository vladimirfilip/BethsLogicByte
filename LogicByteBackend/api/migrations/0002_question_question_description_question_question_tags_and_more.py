# Generated by Django 4.0 on 2022-01-01 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='question_description',
            field=models.TextField(default='N/A'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='question_tags',
            field=models.TextField(default='N/A'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='question_title',
            field=models.CharField(default='N/A', max_length=100),
            preserve_default=False,
        ),
    ]

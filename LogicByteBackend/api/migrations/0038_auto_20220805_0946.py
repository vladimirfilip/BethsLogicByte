# Generated by Django 3.2.9 on 2022-08-05 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0037_questioninsession'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questioninsession',
            name='q_image',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='questioninsession',
            name='question_description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='questioninsession',
            name='selected_option',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='questioninsession',
            name='solution',
            field=models.TextField(blank=True),
        ),
    ]

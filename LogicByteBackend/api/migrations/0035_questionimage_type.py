# Generated by Django 4.0.1 on 2022-08-03 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0034_alter_questionimage_question'),
    ]

    operations = [
        migrations.AddField(
            model_name='questionimage',
            name='type',
            field=models.CharField(blank=True, max_length=20),
        ),
    ]

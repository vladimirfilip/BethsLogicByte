# Generated by Django 4.0 on 2022-01-03 21:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_alter_solution_solution'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solution',
            name='question',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.question'),
        ),
    ]

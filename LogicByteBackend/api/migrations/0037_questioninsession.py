# Generated by Django 4.0.1 on 2022-08-04 20:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_question_has_images'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuestionInSession',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.TextField()),
                ('question_id', models.IntegerField()),
                ('question_description', models.TextField()),
                ('solution', models.TextField()),
                ('selected_option', models.TextField()),
                ('q_image', models.TextField()),
                ('img_options', models.BooleanField(default=False)),
            ],
        ),
    ]

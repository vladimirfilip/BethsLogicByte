# Generated by Django 3.1.4 on 2022-08-19 12:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0045_remove_questioninsession_username_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profilepicture',
            old_name='user_profile',
            new_name='user_id',
        ),
        migrations.RenameField(
            model_name='questioninsession',
            old_name='user_profile_id',
            new_name='user_id',
        ),
    ]

import sys
from pathlib import Path
import os
from datetime import datetime
from zipfile import ZipFile

BASE_DIR = Path(__file__).resolve().parent
BACKUP_ROOT = Path(os.path.dirname(BASE_DIR) + '/backups')
MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'backend_media')


def backup_db(*args):
    file_name = "db-{}".format(datetime.strftime(datetime.now(), '%Y-%m-%d--%H-%M-%S'))
    file_path_str = "{}/{}.json".format(BACKUP_ROOT, file_name)
    os.system(
        f"python manage.py dumpdata --exclude auth.permission --exclude contenttypes " +
        f"--exclude admin.logentry --exclude authtoken.token --indent 2 > {file_path_str}"
    )
    print("DATABASE BACKED UP")


def restore_db(*args):
    db_archives = [filename for filename in os.listdir(BACKUP_ROOT) if filename.split(".").pop() == "json"]
    if not db_archives:
        print("No database backups found")
        return
    path_of_latest_file = "{}/{}".format(BACKUP_ROOT, db_archives.pop())
    os.system("python manage.py makemigrations")
    os.system("python manage.py migrate")
    os.system("python manage.py loaddata {}".format(path_of_latest_file))
    print("DATABASE ARCHIVE RESTORED")


def backup_media(*args):
    directory_name = "media-{}".format(datetime.strftime(datetime.now(), '%Y-%m-%d--%H-%M-%S'))
    directory_path_str = "{}/{}.zip".format(BACKUP_ROOT, directory_name)
    with ZipFile(directory_path_str, "w") as zipObj:
        for folderName, subfolders, filenames in os.walk(MEDIA_ROOT):
            for entry in filenames + subfolders:
                full_path = os.path.join(folderName, entry)
                path_from_media_root = str(full_path).replace(str(MEDIA_ROOT), "")
                zipObj.write(full_path, path_from_media_root)
    print("MEDIA BACKED UP")


def restore_media(*args):
    media_archives = [filename for filename in os.listdir(BACKUP_ROOT) if filename.split(".").pop() == "zip"]
    if not media_archives:
        print("No media backups found")
        return
    path_of_latest_zip = "{}/{}".format(BACKUP_ROOT, media_archives.pop())
    with ZipFile(path_of_latest_zip, "r") as zip_file:
        zip_file.extractall(MEDIA_ROOT)
    print("MEDIA RESTORED")


def backup(*args):
    backup_db()
    backup_media()


def restore(*args):
    restore_db()
    restore_media()


def arg_not_recognised(argument):
    print("Argument {} not recognised".format(argument))


arg_to_func = {
    "backup-db": backup_db,
    "restore-db": restore_db,
    "backup-media": backup_media,
    "restore-media": restore_media,
    "backup": backup,
    "restore": restore,
}
for arg in sys.argv[1:]:
    arg_to_func.get(arg, arg_not_recognised)(arg)

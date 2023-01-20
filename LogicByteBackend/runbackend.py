import os
from threading import Thread
import threading
from time import time, sleep

backup_delay = 3600


def backup():
    print("STARTED BACKUP LOOP")
    main_thread = threading.enumerate()[0]
    start_time = None
    while main_thread.is_alive():
        sleep(1)
        if start_time and time() - start_time < backup_delay:
            continue
        start_time = time()
        os.system("python backupmanager.py backup")


thread = Thread(target=backup)
thread.start()
print("RUN SERVER")
os.system("python manage.py runserver")

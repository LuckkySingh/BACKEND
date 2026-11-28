"""Docker-only overrides; the original Django source remains unchanged."""
from todoproject.settings import *  # noqa: F403,F401

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": "/app/data/db.sqlite3",
    }
}

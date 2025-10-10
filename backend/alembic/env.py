from logging.config import fileConfig
import os
import sys
from dotenv import load_dotenv

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
fileConfig(config.config_file_name)

# add app directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
load_dotenv()

from app.database import Base
from app.models import Invoice

target_metadata = Base.metadata


def run_migrations_offline():
    url = os.getenv('DATABASE_URL')
    if not url:
        raise RuntimeError('DATABASE_URL must be set to run alembic migrations')
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    configuration = config.get_section(config.config_ini_section)
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        raise RuntimeError('DATABASE_URL must be set to run alembic migrations')
    configuration['sqlalchemy.url'] = db_url
    connectable = engine_from_config(
        configuration,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

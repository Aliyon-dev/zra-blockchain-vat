import os
import sys
from logging.config import fileConfig
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool

from alembic import context

# --- FIX 1: Add project root to Python path ---
# This line adds your 'backend' folder to the path
# so Python can find the 'app' package.
sys.path.insert(0, str(Path(__file__).parent.parent))


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Load environment variables from .env file
# (Used for DATABASE_URL)
load_dotenv()

# --- FIX 2: Correctly import your Base and Models ---
# Your models (Base, Invoice, etc.) are in app/models/models.py
# Import them from that file.
try:
    from app.models.models import Base, Invoice, InvoiceStatus
    # Add any other models you have in 'models.py' to the line above
except ImportError as e:
    sys.stderr.write(
        f"Failed to import models: {e}\n"
        "Make sure your models (Base, Invoice, etc.) are defined in app/models/models.py\n"
    )
    sys.exit(1)

# --- Set the target_metadata for Alembic ---
# This tells Alembic what tables it should know about.
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.
    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.
    Calls to context.execute() here emit the given string to the
    script output.
    """
    url = os.getenv('DATABASE_URL')
    if not url:
        raise RuntimeError('DATABASE_URL must be set to run alembic migrations')
    
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.
    In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    
    # Get the database URL from the environment
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        raise RuntimeError('DATABASE_URL must be set to run alembic migrations')

    # Create a configuration dictionary for the engine
    # We override the one in alembic.ini with our .env variable
    configuration = config.get_section(config.config_ini_section, {})
    configuration['sqlalchemy.url'] = db_url
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
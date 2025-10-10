# Backend (FastAPI) for ZRA Invoice Service

Requirements: Python 3.8+

Install dependencies (inside the `backend` folder):

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
```

Run the app:

```powershell
python run.py
```

Run tests:

```powershell
pytest -q
```

Run migrations (alembic must be installed in the environment):

```powershell
alembic revision --autogenerate -m "initial"; alembic upgrade head
```

Using Supabase/Postgres
-----------------------

To use Supabase (Postgres) instead of the default SQLite, set the `DATABASE_URL` env var to your Supabase database URL. You can copy `backend/.env.example` to `.env` and update it.

Example:

```powershell
copy .env.example .env
#$env:DATABASE_URL = "postgresql://<user>:<pass>@<host>:5432/<db>"
```

After setting `DATABASE_URL`, run alembic migrations to create tables in your Supabase database:

```powershell
alembic upgrade head
```

Quick migration helper
----------------------

There's a small helper `migrate.ps1` that will load a local `.env` (if present), activate the venv's python and run Alembic:

```powershell
cd backend
.\migrate.ps1
```

Create an autogenerate migration
--------------------------------

To create a new Alembic revision based on model changes, use `makemigration.ps1` with a message:

```powershell
cd backend
.\makemigration.ps1 -Message "add invoice fields"
# This will create a new file under alembic/versions which you should review and commit.

# After creating the revision, apply it to your DB:
.\migrate.ps1
```

Development-only table creation
-------------------------------

The app intentionally avoids calling `Base.metadata.create_all()` by default to prevent schema drift. If you want the app to create tables automatically in development, set the env var `DEV_CREATE_DB=true` before starting the app. Do NOT enable this in production.


# Environment Setup Guide

## Current Status
❌ No `.env` file found in the backend directory
❌ Environment variables are not set

## Required Environment Variables

You need to create a `.env` file in the `backend` directory with the following variables:

```bash
# Supabase Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Supabase API Configuration  
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Development Settings
DEV_CREATE_DB=false
LEDGER_PATH=ledger.json
```

## How to Get Your Supabase Credentials

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `zra-blockchain-vat`
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
6. Click "Create new project"
7. Wait for project to be ready (2-3 minutes)

### 2. Get Database URL
1. Go to **Settings** → **Database**
2. Scroll down to "Connection parameters"
3. Copy the **Connection string** (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 3. Get API Keys
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Create the .env File

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create the `.env` file:
   ```bash
   touch .env
   ```

3. Edit the `.env` file with your actual values:
   ```bash
   nano .env
   # or
   code .env
   # or
   vim .env
   ```

4. Add your actual Supabase credentials (replace the placeholder values):
   ```bash
   DATABASE_URL=postgresql://postgres:your_actual_password@db.your_project_ref.supabase.co:5432/postgres
   SUPABASE_URL=https://your_project_ref.supabase.co
   SUPABASE_KEY=your_actual_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   DEV_CREATE_DB=false
   LEDGER_PATH=ledger.json
   ```

## Test the Configuration

Once you've created the `.env` file, test it:

```bash
cd backend
python3 test_supabase.py
```

You should see:
```
✅ All environment variables are set
✅ Database connection successful
✅ Supabase API connection successful
🎉 All tests passed! Supabase is ready to use.
```

## Next Steps

After setting up the environment:

1. **Run Database Migrations**:
   ```bash
   cd backend
   alembic upgrade head
   ```

2. **Start the Backend**:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

3. **Start the Frontend** (in another terminal):
   ```bash
   npm run dev
   ```

4. **Test the Application**:
   - Backend health: http://localhost:8000/supabase/health
   - Frontend: http://localhost:3000

## Troubleshooting

### Common Issues:

1. **"DATABASE_URL environment variable is required"**
   - Make sure your `.env` file is in the `backend` directory
   - Check that the DATABASE_URL is correctly formatted

2. **"Connection refused" or "Connection timeout"**
   - Verify your Supabase project is running
   - Check that your DATABASE_URL is correct
   - Ensure your IP is not blocked (check Supabase dashboard)

3. **"Migration failed"**
   - Make sure you have the correct database permissions
   - Check that your DATABASE_URL includes the correct password

### Security Notes:
- Never commit your `.env` file to version control
- Keep your service role key secret
- Use environment variables in production




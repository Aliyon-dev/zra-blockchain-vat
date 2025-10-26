# Supabase Setup Guide for ZRA Blockchain Invoice Verification System

This guide will help you connect your ZRA blockchain invoice verification system to Supabase.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Supabase project created
3. Python 3.8+ installed
4. Node.js 18+ installed (for frontend)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `zra-blockchain-vat`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your location)
5. Click "Create new project"
6. Wait for the project to be ready (usually 2-3 minutes)

## Step 2: Get Supabase Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

3. Go to **Settings** → **Database**
4. Copy the **Connection string** under "Connection parameters"
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Supabase Configuration
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Optional Development Settings
DEV_CREATE_DB=false
LEDGER_PATH=ledger.json
```

## Step 4: Install Dependencies

### Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Frontend Dependencies

```bash
# From project root
npm install
```

## Step 5: Run Database Migrations

```bash
cd backend
alembic upgrade head
```

This will create the necessary tables in your Supabase database.

## Step 6: Test the Connection

Run the setup script to verify everything is working:

```bash
cd backend
python3 setup_supabase_simple.py
```

You should see:
```
✅ All required environment variables are set
✅ Database connection successful
🎉 Supabase connection verified!
```

## Step 7: Start the Application

### Start the Backend

```bash
cd backend
uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`

### Start the Frontend

```bash
# From project root
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Step 8: Verify Everything is Working

1. **Backend Health Check**: Visit `http://localhost:8000/supabase/health`
   - Should show Supabase configuration status
   - Should show ping status (200 if working)

2. **Database Health Check**: Visit `http://localhost:8000/db/health`
   - Should show `{"ok": true, "result": 1}`

3. **Frontend**: Visit `http://localhost:3000`
   - Should show the ZRA VAT Manager interface

## Step 9: Test the Full Flow

1. **Create an Invoice**:
   - Go to `http://localhost:3000/issue`
   - Fill in the form with test data
   - Submit the invoice
   - Verify you see blockchain hash and transaction details

2. **Verify an Invoice**:
   - Go to `http://localhost:3000/verify`
   - Enter the invoice ID from step 1
   - Verify you see the invoice details and blockchain verification status

## Troubleshooting

### Common Issues

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

4. **CORS errors in frontend**
   - Make sure the backend is running on port 8000
   - Check that BACKEND_URL is set correctly in your frontend environment

### Getting Help

- Check the Supabase dashboard for project status
- Review the backend logs for detailed error messages
- Ensure all environment variables are set correctly

## Security Notes

- Never commit your `.env` file to version control
- Keep your service role key secret
- Use environment variables in production
- Consider using Supabase RLS (Row Level Security) for production

## Next Steps

Once everything is working:

1. **Production Deployment**: Consider deploying to platforms like Vercel (frontend) and Railway/Heroku (backend)
2. **Database Security**: Enable Row Level Security in Supabase
3. **Monitoring**: Set up monitoring and logging
4. **Backup**: Configure automated backups in Supabase

## Support

If you encounter issues:

1. Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
2. Review the FastAPI documentation: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
3. Check the Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

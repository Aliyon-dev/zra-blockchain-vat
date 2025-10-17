from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from .database import engine, Base, get_db
import os
from .supabase_client import SUPABASE_URL, SUPABASE_KEY, ping_supabase
from .database import engine


if os.getenv('DEV_CREATE_DB', 'false').lower() in ('1', 'true', 'yes'):
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="ZRA Invoice Service")


@app.get('/supabase/health')
def supabase_health():
    """Report whether SUPABASE_URL and SUPABASE_KEY are configured and attempt a minimal ping."""
    configured = {
        'supabase_url': bool(SUPABASE_URL),
        'supabase_key': bool(SUPABASE_KEY),
    }

    ping = None
    if SUPABASE_URL:
        ping = ping_supabase()

    return {'configured': configured, 'ping_status': ping}



@app.get('/db/health')
def db_health():
    """Simple DB connectivity check using SQLAlchemy engine."""
    try:
        with engine.connect() as conn:
            # run a minimal no-op query; SELECT 1 works for Postgres/SQLite
            res = conn.execute("SELECT 1")
            val = res.scalar()
            return {"ok": True, "result": val}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@app.post("/invoices", response_model=schemas.InvoiceRead, status_code=201)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    try:
        inv = crud.create_invoice(db, invoice)
        return inv
    except ValueError as ve:
        # Map validation / duplicate errors to 409 Conflict
        raise HTTPException(status_code=409, detail=str(ve))


@app.get("/invoices/{invoice_id}", response_model=schemas.InvoiceRead)
def read_invoice(invoice_id: int, db: Session = Depends(get_db)):
    inv = crud.get_invoice(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return inv


@app.patch("/invoices/{invoice_id}", response_model=schemas.InvoiceRead)
def patch_invoice(invoice_id: int, db: Session = Depends(get_db)):
    inv = crud.cancel_invoice(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return inv

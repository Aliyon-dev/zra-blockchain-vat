from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, Base, get_db
from .supabase_client import SUPABASE_URL, SUPABASE_KEY, ping_supabase
#from .config import DEV_CREATE_DB

if DEV_CREATE_DB:
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="ZRA Invoice Verification Service")

@app.get("/supabase/health")
def supabase_health():
    configured = {
        "supabase_url": bool(SUPABASE_URL),
        "supabase_key": bool(SUPABASE_KEY),
    }
    ping = ping_supabase() if SUPABASE_URL else None
    return {"configured": configured, "ping_status": ping}

@app.get("/db/health")
def db_health():
    try:
        with engine.connect() as conn:
            res = conn.execute("SELECT 1")
            return {"ok": True, "result": res.scalar()}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@app.post("/invoices", response_model=schemas.InvoiceRead, status_code=201)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_invoice(db, invoice)
    except ValueError as ve:
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

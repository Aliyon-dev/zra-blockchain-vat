from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import engine, Base, get_db
from app.supabase_client import ping_supabase
from app.config import DEV_CREATE_DB, ALLOWED_ORIGINS, SUPABASE_URL, SUPABASE_KEY
from app.services import blockchain

if DEV_CREATE_DB:
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="ZRA Invoice Verification Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/invoices/verify", response_model=schemas.InvoiceVerifyResponse)
def verify_invoice(verify_request: schemas.InvoiceVerify, db: Session = Depends(get_db)):
    """Verify an invoice against the blockchain ledger"""
    try:
        # Get invoice from database
        invoice = crud.get_invoice(db, verify_request.invoice_id)
        if not invoice:
            return schemas.InvoiceVerifyResponse(
                valid=False,
                error="Invoice not found"
            )
        
        # Check if invoice has blockchain hash
        if not invoice.blockchain_hash:
            return schemas.InvoiceVerifyResponse(
                valid=False,
                error="Invoice not registered on blockchain"
            )
        
        # Verify hash exists in blockchain ledger
        blockchain_record = blockchain.verify_hash(invoice.blockchain_hash)
        if not blockchain_record:
            return schemas.InvoiceVerifyResponse(
                valid=False,
                error="Invoice hash not found in blockchain ledger"
            )
        
        # Verify the transaction reference matches
        if blockchain_record.get("tx_ref") != invoice.blockchain_tx_ref:
            return schemas.InvoiceVerifyResponse(
                valid=False,
                error="Blockchain transaction reference mismatch"
            )
        
        return schemas.InvoiceVerifyResponse(
            valid=True,
            invoice=invoice
        )
        
    except Exception as e:
        return schemas.InvoiceVerifyResponse(
            valid=False,
            error=f"Verification failed: {str(e)}"
        )

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import engine, Base, get_db
from app.supabase_client import ping_supabase
from app.config import DEV_CREATE_DB, ALLOWED_ORIGINS, SUPABASE_URL, SUPABASE_KEY
from app.services import blockchain, qr_code
from app.auth import get_current_user_id
from uuid import UUID

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
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    try:
        return crud.create_invoice(db, invoice, user_id)
    except ValueError as ve:
        raise HTTPException(status_code=409, detail=str(ve))

@app.get("/invoices", response_model=list[schemas.InvoiceRead])
def get_user_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    """Get invoices for the authenticated user"""
    invoices = crud.get_user_invoices(db, user_id, skip=skip, limit=limit)
    return invoices

@app.get("/invoices/{invoice_id}", response_model=schemas.InvoiceRead)
def read_invoice(invoice_id: UUID, db: Session = Depends(get_db)):
    inv = crud.get_invoice(db, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return inv

@app.patch("/invoices/{invoice_id}", response_model=schemas.InvoiceRead)
def patch_invoice(invoice_id: UUID, db: Session = Depends(get_db)):
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

@app.post("/invoices/verify-qr", response_model=schemas.QRVerifyResponse)
def verify_invoice_qr(qr_request: schemas.QRVerifyRequest, db: Session = Depends(get_db)):
    """Verify an invoice using QR code data"""
    try:
        # Parse QR code data
        try:
            qr_data = qr_code.parse_qr_data(qr_request.qr_data)
        except ValueError as e:
            return schemas.QRVerifyResponse(
                valid=False,
                error="Invalid QR code format",
                message=str(e)
            )
        
        # Validate QR code structure
        if qr_data.get("type") != "zra_invoice":
            return schemas.QRVerifyResponse(
                valid=False,
                error="Invalid QR code type",
                message="This QR code is not a ZRA invoice"
            )
        
        invoice_id = qr_data.get("invoice_id")
        blockchain_hash = qr_data.get("blockchain_hash")
        
        if not invoice_id or not blockchain_hash:
            return schemas.QRVerifyResponse(
                valid=False,
                error="Incomplete QR code data",
                message="QR code is missing required fields"
            )
        
        # Get invoice from database
        from uuid import UUID
        try:
            invoice_uuid = UUID(invoice_id)
            invoice = db.query(models.Invoice).filter(models.Invoice.id == invoice_uuid).first()
        except ValueError:
            return schemas.QRVerifyResponse(
                valid=False,
                error="Invalid invoice ID format"
            )
        
        if not invoice:
            return schemas.QRVerifyResponse(
                valid=False,
                error="Invoice not found",
                message=f"No invoice found with ID: {invoice_id}"
            )
        
        # Verify blockchain hash matches
        if invoice.blockchain_hash != blockchain_hash:
            return schemas.QRVerifyResponse(
                valid=False,
                error="Hash mismatch",
                message="QR code hash does not match database record"
            )
        
        # Verify hash exists in blockchain ledger
        blockchain_record = blockchain.verify_hash(blockchain_hash)
        if not blockchain_record:
            return schemas.QRVerifyResponse(
                valid=False,
                error="Hash not found in blockchain",
                message="Invoice hash not found in blockchain ledger"
            )
        
        # Generate QR code for response
        try:
            qr_data_new = qr_code.create_invoice_qr_data(
                invoice_id=str(invoice.id),
                blockchain_hash=invoice.blockchain_hash or "",
                timestamp=invoice.timestamp.isoformat()
            )
            invoice.qr_code = qr_code.generate_qr_code(qr_data_new, format="png")
        except Exception:
            pass  # QR generation is optional for verification
        
        return schemas.QRVerifyResponse(
            valid=True,
            invoice=invoice,
            message="Invoice verified successfully"
        )
        
    except Exception as e:
        return schemas.QRVerifyResponse(
            valid=False,
            error=f"Verification failed: {str(e)}"
        )

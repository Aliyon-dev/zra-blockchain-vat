from app.models import models
from sqlalchemy.orm import Session
from app import schemas
from app.services import validation, blockchain, qr_code
from datetime import datetime
from uuid import UUID  # <-- 1. Import UUID

def create_invoice(db: Session, invoice: schemas.InvoiceCreate, user_id: str) -> models.Invoice:
    # Validate TPINs
    if not validation.is_valid_tpin(invoice.supplier_tpin) or not validation.is_valid_tpin(invoice.buyer_tpin):
        raise ValueError("Invalid TPIN format (expected 10 digits)")

    # Prevent obvious duplicates: same supplier/buyer/amount/vat already present
    existing = (
        db.query(models.Invoice)
        .filter(
            models.Invoice.supplier_tpin == invoice.supplier_tpin,
            models.Invoice.buyer_tpin == invoice.buyer_tpin,
            models.Invoice.amount == invoice.amount,
            models.Invoice.vat == invoice.vat,
        )
        .first()
    )
    if existing:
        raise ValueError("Duplicate invoice")

    # Create invoice data for blockchain hashing
    invoice_data = {
        "supplier_tpin": invoice.supplier_tpin,
        "buyer_tpin": invoice.buyer_tpin,
        "vat": invoice.vat,
        "amount": invoice.amount,
    }
    
    # Generate blockchain hash
    blockchain_hash = blockchain.hash_invoice(invoice_data)
    
    # Create invoice record
    db_inv = models.Invoice(
        user_id=user_id,
        supplier_tpin=invoice.supplier_tpin,
        buyer_tpin=invoice.buyer_tpin,
        vat=invoice.vat,
        amount=invoice.amount,
        blockchain_hash=blockchain_hash,
    )
    db.add(db_inv)
    db.commit()
    db.refresh(db_inv)
    
    # Submit to blockchain ledger
    try:
        metadata = {
            # 2. Convert the UUID to a string
            "invoice_id": str(db_inv.id), 
            "supplier_tpin": invoice.supplier_tpin,
            "buyer_tpin": invoice.buyer_tpin,
        }
        blockchain_record = blockchain.submit_to_chain(blockchain_hash, metadata)
        
        # Update invoice with blockchain details
        db_inv.blockchain_tx_ref = blockchain_record["tx_ref"]
        db_inv.blockchain_timestamp = datetime.fromisoformat(blockchain_record["timestamp"].replace("Z", "+00:00"))
        db.add(db_inv)
        db.commit()
        db.refresh(db_inv)
        
    except Exception as e:
        # Log error but don't fail the invoice creation
        print(f"Warning: Failed to register invoice {db_inv.id} on blockchain: {e}")
    
    # Generate QR code for the invoice
    try:
        # --- FIX ---
        # Call create_invoice_qr_data to get the JSON-like dictionary
        qr_data_dict = qr_code.create_invoice_qr_data(
            invoice_id=str(db_inv.id)
        )
        
        # Pass the dictionary to generate_qr_code
        # It will be automatically converted to a JSON string
        qr_code_image = qr_code.generate_qr_code(qr_data_dict, format="png")
        
        # Add QR code to response (not stored in DB)
        db_inv.qr_code = qr_code_image
    except Exception as e:
        print(f"Warning: Failed to generate QR code for invoice {db_inv.id}: {e}")
    
    return db_inv


# 3. Change invoice_id type from int to UUID
def get_invoice(db: Session, invoice_id: UUID):
    return db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()


# 4. Change invoice_id type from int to UUID
def cancel_invoice(db: Session, invoice_id: UUID):
    inv = get_invoice(db, invoice_id)
    if not inv:
        return None
    inv.status = models.InvoiceStatus.CANCELLED
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv

def get_user_invoices(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    """Get invoices for a specific user with pagination"""
    return db.query(models.Invoice).filter(
        models.Invoice.user_id == user_id
    ).offset(skip).limit(limit).all()
from app.models import models
from sqlalchemy.orm import Session
from app import schemas
from app.services import validation, blockchain
from datetime import datetime


def create_invoice(db: Session, invoice: schemas.InvoiceCreate) -> models.Invoice:
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
            "invoice_id": db_inv.id,
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
    
    return db_inv


def get_invoice(db: Session, invoice_id: int):
    return db.query(models.Invoice).filter(models.Invoice.id == invoice_id).first()


def cancel_invoice(db: Session, invoice_id: int):
    inv = get_invoice(db, invoice_id)
    if not inv:
        return None
    inv.status = models.InvoiceStatus.CANCELLED
    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv

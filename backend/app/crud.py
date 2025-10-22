from .models import models
from sqlalchemy.orm import Session
from . import schemas
import services.validation as validation


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

    db_inv = models.Invoice(
        supplier_tpin=invoice.supplier_tpin,
        buyer_tpin=invoice.buyer_tpin,
        vat=invoice.vat,
        amount=invoice.amount,
    )
    db.add(db_inv)
    db.commit()
    db.refresh(db_inv)
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

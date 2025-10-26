from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Text, UUID, Sequence, text
from sqlalchemy.sql import func
from app.database import Base
import enum
import uuid

invoice_num_seq = Sequence('invoice_num_seq', start=1)

class InvoiceStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    CANCELLED = "CANCELLED"


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID, primary_key=True, index=True, default=uuid.uuid4)
    invoice_number = Column(
            String(30),
            nullable=False,
            unique=True,
            index=True,
            # This tells PostgreSQL:
            # 1. Get the next number from 'invoice_num_seq'
            # 2. Pad it with leading '0's up to 4 digits (e.g., 32 -> '0032')
            # 3. Add the 'INV-ZRA-' prefix
            server_default=text(
                "'INV-ZRA-' || lpad(nextval('invoice_num_seq')::text, 4, '0')"
            )
        )

    
    user_id = Column(String, index=True, nullable=False)  # Supabase user ID
    supplier_tpin = Column(String, index=True, nullable=False)
    buyer_tpin = Column(String, index=True, nullable=False)
    vat = Column(Float, nullable=False)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.PENDING, nullable=False)
    
    # Blockchain fields
    blockchain_hash = Column(String(64), nullable=True, index=True)
    blockchain_tx_ref = Column(String(32), nullable=True, index=True)
    blockchain_timestamp = Column(DateTime(timezone=True), nullable=True)

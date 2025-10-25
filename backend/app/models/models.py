from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, Text, UUID
from sqlalchemy.sql import func
from app.database import Base
import enum
import uuid


class InvoiceStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    CANCELLED = "CANCELLED"


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID, primary_key=True, index=True, default=uuid.uuid4)
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

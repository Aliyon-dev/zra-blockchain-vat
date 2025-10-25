from pydantic import BaseModel, Field, ConfigDict, computed_field
from typing import Optional
from datetime import datetime
from app.models.models import InvoiceStatus
from uuid import UUID


class InvoiceCreate(BaseModel):
    supplier_tpin: str = Field(..., json_schema_extra={'example': '123456789'})
    buyer_tpin: str = Field(..., json_schema_extra={'example': '987654321'})
    vat: float = Field(..., json_schema_extra={'example': 12.5})
    amount: float = Field(..., json_schema_extra={'example': 1000.0})


class InvoiceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    supplier_tpin: str
    buyer_tpin: str
    vat: float
    amount: float
    timestamp: datetime
    status: InvoiceStatus
    
    # Blockchain fields
    blockchain_hash: Optional[str] = None
    blockchain_tx_ref: Optional[str] = None
    blockchain_timestamp: Optional[datetime] = None
    
    # QR Code field (computed, not stored in DB)
    qr_code: Optional[str] = None
    
    @computed_field
    @property
    def invoiceId(self) -> str:
        """Frontend-compatible invoice ID"""
        return str(self.id)


class InvoiceVerify(BaseModel):
    invoice_id: UUID = Field(..., description="Invoice ID to verify")


class InvoiceVerifyResponse(BaseModel):
    valid: bool
    invoice: Optional[InvoiceRead] = None
    error: Optional[str] = None


class QRVerifyRequest(BaseModel):
    qr_data: str = Field(..., description="QR code data string (JSON)")


class QRVerifyResponse(BaseModel):
    valid: bool
    invoice: Optional[InvoiceRead] = None
    error: Optional[str] = None
    message: Optional[str] = None

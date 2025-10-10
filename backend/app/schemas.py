from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .models import InvoiceStatus


class InvoiceCreate(BaseModel):
    supplier_tpin: str = Field(..., example="123456789")
    buyer_tpin: str = Field(..., example="987654321")
    vat: float = Field(..., example=12.5)
    amount: float = Field(..., example=1000.0)


class InvoiceRead(BaseModel):
    id: int
    supplier_tpin: str
    buyer_tpin: str
    vat: float
    amount: float
    timestamp: datetime
    status: InvoiceStatus

    class Config:
        from_attributes = True

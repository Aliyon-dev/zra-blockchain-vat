from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from models.models import InvoiceStatus


class InvoiceCreate(BaseModel):
    supplier_tpin: str = Field(..., json_schema_extra={'example': '123456789'})
    buyer_tpin: str = Field(..., json_schema_extra={'example': '987654321'})
    vat: float = Field(..., json_schema_extra={'example': 12.5})
    amount: float = Field(..., json_schema_extra={'example': 1000.0})


class InvoiceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    supplier_tpin: str
    buyer_tpin: str
    vat: float
    amount: float
    timestamp: datetime
    status: InvoiceStatus

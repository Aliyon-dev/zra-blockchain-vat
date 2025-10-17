from pydantic import BaseModel
from datetime import datetime

class Blockchain:
    invoice_id: str
    hash: str
    blockchain_txn_id: str
    blockchain_network: str
    timestamp: datetime
    status: str

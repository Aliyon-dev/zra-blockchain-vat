import re
from typing import Any


def is_valid_tpin(tpin: Any) -> bool:
    """
    Dummy TPIN validation: must be a string of exactly 10 digits.
    """
    if not isinstance(tpin, str):
        return False
    return bool(re.fullmatch(r"\d{10}", tpin))


def is_unique_invoice(invoice_id: str, seller_id: str, buyer_id: str, conn) -> bool:
    """
    Simple uniqueness check used by tests (expects a DB-API connection like sqlite3.Connection).
    Returns True when no matching invoice exists.
    """
    try:
        cur = conn.execute(
            "SELECT COUNT(1) FROM invoices WHERE invoice_id = ? AND seller_id = ? AND buyer_id = ?",
            (invoice_id, seller_id, buyer_id),
        )
        row = cur.fetchone()
        count = row[0] if row else 0
        return count == 0
    except Exception:
        # For unknown connection types, be conservative and consider it not unique (fail-safe)
        return False

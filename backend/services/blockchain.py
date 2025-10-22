import json
import hashlib
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Union


def _resolve_path(path: Optional[Union[str, Path]] = None) -> Path:
    return Path(path) if path is not None else Path("ledger.json")


def hash_invoice(invoice: Dict[str, Any]) -> str:
    """
    Deterministic SHA256 over canonical JSON (sorted keys, compact separators).
    Returns 64-char hex string.
    """
    payload = json.dumps(invoice, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def submit_to_chain(h: str, metadata: Dict[str, Any], path: Optional[Union[str, Path]] = None) -> Dict[str, Any]:
    """
    Append a record to a local JSON 'ledger' (simulates blockchain).
    Returns the created record which includes `tx_ref`, `hash`, `metadata`, `timestamp`.
    """
    ledger_path = _resolve_path(path)
    records = []
    if ledger_path.exists():
        try:
            with ledger_path.open("r", encoding="utf-8") as f:
                records = json.load(f)
        except Exception:
            records = []

    record = {
        "hash": h,
        "metadata": metadata,
        "tx_ref": uuid.uuid4().hex,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }
    records.append(record)

    ledger_path.parent.mkdir(parents=True, exist_ok=True)
    with ledger_path.open("w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    return record


def verify_hash(h: str, path: Optional[Union[str, Path]] = None) -> Optional[Dict[str, Any]]:
    """
    Return the ledger record for hash `h` or None if not found.
    """
    ledger_path = _resolve_path(path)
    if not ledger_path.exists():
        return None

    try:
        with ledger_path.open("r", encoding="utf-8") as f:
            records = json.load(f)
    except Exception:
        return None

    for r in records:
        if r.get("hash") == h:
            return r
    return None


def clear_ledger(path: Optional[Union[str, Path]] = None) -> None:
    ledger_path = _resolve_path(path)
    try:
        if ledger_path.exists():
            ledger_path.unlink()
    except Exception:
        pass

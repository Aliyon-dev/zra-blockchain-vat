import os
import json
from pathlib import Path
import services.blockchain as bc


def test_hash_invoice_is_deterministic(tmp_path: Path):
	invoice = {"invoice_id": "INV-1", "tpin": "1234567890", "total": 100.0}
	h1 = bc.hash_invoice(invoice)
	h2 = bc.hash_invoice(invoice)
	assert isinstance(h1, str) and len(h1) == 64
	assert h1 == h2


def test_submit_and_verify(tmp_path: Path):
	ledger_file = tmp_path / "ledger.json"
	# clear ledger just in case
	bc.clear_ledger(ledger_file)

	invoice = {"invoice_id": "INV-2", "tpin": "1234567890", "total": 200.0}
	h = bc.hash_invoice(invoice)
	record = bc.submit_to_chain(h, {"invoice_id": invoice["invoice_id"]}, path=ledger_file)

	assert "tx_ref" in record and record["hash"] == h

	found = bc.verify_hash(h, path=ledger_file)
	assert found is not None and found["hash"] == h

	# a different hash should not be found
	assert bc.verify_hash("deadbeef" * 8, path=ledger_file) is None


def test_clear_ledger(tmp_path: Path):
	ledger_file = tmp_path / "ledger2.json"
	invoice = {"invoice_id": "INV-3", "tpin": "1234567890", "total": 300.0}
	h = bc.hash_invoice(invoice)
	bc.submit_to_chain(h, {}, path=ledger_file)
	assert ledger_file.exists()
	bc.clear_ledger(path=ledger_file)
	assert not ledger_file.exists()

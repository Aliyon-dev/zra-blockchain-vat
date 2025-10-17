import sqlite3
import services.validation as val


def test_is_valid_tpin():
	assert val.is_valid_tpin("1234567890")
	assert not val.is_valid_tpin("12345")
	assert not val.is_valid_tpin("abcdefghij")


def test_is_unique_invoice(tmp_path):
	db_file = tmp_path / "test.db"
	conn = sqlite3.connect(str(db_file))
	try:
		conn.execute(
			"CREATE TABLE invoices (id INTEGER PRIMARY KEY, invoice_id TEXT, seller_id TEXT, buyer_id TEXT)"
		)
		conn.commit()

		# initially unique
		assert val.is_unique_invoice("INV-100", "S1", "B1", conn)

		# insert a row
		conn.execute("INSERT INTO invoices (invoice_id, seller_id, buyer_id) VALUES (?, ?, ?)", ("INV-100", "S1", "B1"))
		conn.commit()

		# not unique now
		assert not val.is_unique_invoice("INV-100", "S1", "B1", conn)
	finally:
		conn.close()

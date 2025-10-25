"""
QR Code Generation Service for ZRA Invoice Verification System
"""

import qrcode
import qrcode.image.svg
from io import BytesIO
import base64
import json
from typing import Dict, Any


def generate_qr_code(data: Dict[str, Any], format: str = "png") -> str:
    """
    Generate a QR code from invoice data.
    
    Args:
        data: Dictionary containing invoice data (id, blockchain_hash, timestamp)
        format: Output format - 'png' or 'svg'
    
    Returns:
        Base64 encoded QR code image
    """
    # Convert data to JSON string
    qr_data = json.dumps(data, sort_keys=True)
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,  # Controls size (1 is smallest, 40 is largest)
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction
        box_size=10,  # Size of each box in pixels
        border=4,  # Border size in boxes
    )
    
    # Add data
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    if format == "svg":
        # Generate SVG
        factory = qrcode.image.svg.SvgPathImage
        img = qr.make_image(image_factory=factory)
        buffer = BytesIO()
        img.save(buffer)
        svg_data = buffer.getvalue().decode('utf-8')
        return f"data:image/svg+xml;base64,{base64.b64encode(svg_data.encode()).decode()}"
    else:
        # Generate PNG (default)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return f"data:image/png;base64,{img_str}"


def parse_qr_data(qr_string: str) -> Dict[str, Any]:
    """
    Parse QR code data string back into dictionary.
    
    Args:
        qr_string: JSON string from QR code
    
    Returns:
        Dictionary with invoice data
    """
    try:
        return json.loads(qr_string)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid QR code data: {e}")


def create_invoice_qr_data(invoice_id: str, blockchain_hash: str, timestamp: str) -> Dict[str, str]:
    """
    Create standardized QR code data structure for invoices.
    
    Args:
        invoice_id: Invoice ID (UUID)
        blockchain_hash: Blockchain hash for verification
        timestamp: Invoice timestamp
    
    Returns:
        Dictionary with invoice QR data
    """
    return {
        "type": "zra_invoice",
        "version": "1.0",
        "invoice_id": invoice_id,
        "blockchain_hash": blockchain_hash,
        "timestamp": timestamp,
    }


"""
QR Code Generation Service for ZRA Invoice Verification System
"""

import qrcode
import qrcode.image.svg
from io import BytesIO
import base64
import json
from typing import Dict, Any


def generate_qr_code(data, format: str = "png") -> str:
    """
    Generate a QR code from invoice data.
    
    Args:
        data: Dictionary or string containing invoice data
        format: Output format - 'png' or 'svg'
    
    Returns:
        Base64 encoded QR code image
    """
    # Handle both dict and string inputs
    if isinstance(data, dict):
        qr_data = json.dumps(data, sort_keys=True)
    elif isinstance(data, str):
        qr_data = data
    else:
        raise ValueError("Data must be a dictionary or string")
    
    # Create QR code instance
    qr = qrcode.QRCode(
        version=1,
        # Use Medium error correction for a less dense, easier-to-scan code
        error_correction=qrcode.constants.ERROR_CORRECT_M, 
        box_size=10,
        border=4,
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


def create_invoice_qr_data(invoice_id: str) -> Dict[str, str]:
    """
    Create standardized QR code data structure for invoices.
    
    Args:
        invoice_id: Invoice ID (UUID)
    
    Returns:
        Dictionary with invoice QR data
    """
    return {
        "type": "zra_invoice",
        "version": "1.0",
        "invoice_id": invoice_id,
    }
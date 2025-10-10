"""initial invoices table

Revision ID: 0001_initial_invoices_table
Revises: 
Create Date: 2025-10-08 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial_invoices_table'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'invoices',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('supplier_tpin', sa.String(), nullable=False),
        sa.Column('buyer_tpin', sa.String(), nullable=False),
        sa.Column('vat', sa.Float(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('status', sa.String(), nullable=False, server_default='PENDING')
    )


def downgrade():
    op.drop_table('invoices')

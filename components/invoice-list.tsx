'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, FileText, Calendar, DollarSign, Eye, QrCode, Download, Share2, Filter, Plus, Search } from 'lucide-react'
import Link from 'next/link'

interface Invoice {
  id: string
  supplier_tpin: string
  buyer_tpin: string
  vat: number
  amount: number
  timestamp: string
  status: 'PENDING' | 'PAID' | 'CANCELLED'
  blockchain_hash?: string
  blockchain_tx_ref?: string
  blockchain_timestamp?: string
  qr_code?: string
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'CANCELLED'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const { session } = useAuth()

  useEffect(() => {
    if (session) {
      fetchInvoices()
    }
  }, [session])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/invoices', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch invoices')
      }

      const data = await response.json()
      setInvoices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'ALL' ? true : invoice.status === filter
    const matchesSearch = searchTerm === '' || 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.supplier_tpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.buyer_tpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.amount.toString().includes(searchTerm)
    
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'PAID':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '⏳'
      case 'PAID':
        return '✅'
      case 'CANCELLED':
        return '❌'
      default:
        return '📄'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW'
    }).format(amount)
  }

  const getVatAmount = (amount: number, vat: number) => {
    return (amount * vat) / 100
  }

  const getTotalAmount = (amount: number, vat: number) => {
    return amount + getVatAmount(amount, vat)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white rounded-lg border border-gray-200">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-sm"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-gray-700 font-medium">Loading your invoices</p>
          <p className="text-gray-500 text-sm">This will just take a moment</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-6 bg-white rounded-lg border border-gray-200">
        <div className="w-20 h-20 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6 text-rose-600" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Unable to load invoices</h3>
          <p className="text-gray-600 max-w-md mx-auto">{error}</p>
        </div>
        <Button 
          onClick={fetchInvoices} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-16 space-y-6 bg-white rounded-lg border border-gray-200">
        <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
          <FileText className="h-12 w-12 text-blue-400" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">No invoices yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Create your first invoice to start managing your transactions and VAT records.
          </p>
        </div>
        <Link href="/issue">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create First Invoice
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white rounded-lg border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">
            {filteredInvoices.length} of {invoices.length} invoices
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(['ALL', 'PENDING', 'PAID', 'CANCELLED'] as const).map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {/* Create Invoice Button */}
          <Link href="/issue">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Invoice Grid */}
      <div className="grid gap-4">
        {filteredInvoices.map((invoice) => (
          <Card 
            key={invoice.id} 
            className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                      Invoice #{invoice.id.slice(-8).toUpperCase()}
                      <span className="text-lg">{getStatusIcon(invoice.status)}</span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(invoice.timestamp)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(invoice.status)} font-medium border`}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">VAT ({invoice.vat}%)</p>
                  <p className="text-xl font-semibold text-amber-600">
                    {formatCurrency(getVatAmount(invoice.amount, invoice.vat))}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-semibold text-emerald-600">
                    {formatCurrency(getTotalAmount(invoice.amount, invoice.vat))}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Parties</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      S: {invoice.supplier_tpin.slice(-6)}
                    </div>
                    <span className="text-gray-400">→</span>
                    <div className="text-green-600 bg-green-100 px-2 py-1 rounded">
                      B: {invoice.buyer_tpin.slice(-6)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Supplier TPIN</p>
                    <p className="text-gray-700 font-mono bg-gray-50 p-2 rounded border">{invoice.supplier_tpin}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Buyer TPIN</p>
                    <p className="text-gray-700 font-mono bg-gray-50 p-2 rounded border">{invoice.buyer_tpin}</p>
                  </div>
                </div>
                
                {/* Blockchain Info */}
                {invoice.blockchain_hash && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium text-emerald-700">Verified on Blockchain</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Transaction Hash</p>
                        <p className="text-gray-800 font-mono text-xs break-all bg-white p-2 rounded border">
                          {invoice.blockchain_hash}
                        </p>
                      </div>
                      {invoice.blockchain_tx_ref && (
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Reference</p>
                          <p className="text-gray-800 text-sm bg-white p-2 rounded border">{invoice.blockchain_tx_ref}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/verify?invoiceId=${invoice.id}`}>
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  
                  {invoice.qr_code && (
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                      <QrCode className="w-4 h-4 mr-2" />
                      Show QR
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty Filter State */}
      {filteredInvoices.length === 0 && invoices.length > 0 && (
        <div className="text-center py-12 space-y-4 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">No invoices found</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No invoices match "${searchTerm}". Try adjusting your search.`
                : `No ${filter.toLowerCase()} invoices found. Try selecting a different status.`
              }
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={() => setFilter('ALL')}
              variant="outline"
              className="border-gray-300 text-gray-700"
            >
              Show All Invoices
            </Button>
            <Button 
              onClick={() => setSearchTerm('')}
              variant="outline"
              className="border-gray-300 text-gray-700"
            >
              Clear Search
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
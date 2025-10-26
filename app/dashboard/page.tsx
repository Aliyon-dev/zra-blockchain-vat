'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/protected-route'
import InvoiceList from '@/components/invoice-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, TrendingUp, DollarSign, LogOut, User, Shield } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, signOut } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">ZRA Invoice System</h1>
                    <p className="text-sm text-blue-600">Official Tax Management Platform</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-blue-50 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Welcome back</p>
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600 text-lg">Manage your VAT invoices and track your business transactions</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Invoices</CardTitle>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">-</div>
                <p className="text-xs text-gray-500 mt-1">All time invoices issued</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">-</div>
                <p className="text-xs text-gray-500 mt-1">Total amount in ZMW</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">-</div>
                <p className="text-xs text-gray-500 mt-1">Invoices created this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/issue" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Invoice
                </Button>
              </Link>
              <Link href="/verify" className="flex-1">
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 h-12 rounded-xl transition-all duration-200">
                  <FileText className="w-5 h-5 mr-2" />
                  Verify Invoice
                </Button>
              </Link>
              <Link href="/verify-qr" className="flex-1">
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 h-12 rounded-xl transition-all duration-200">
                  <FileText className="w-5 h-5 mr-2" />
                  Scan QR Code
                </Button>
              </Link>
            </div>
          </div>

          {/* Invoice List */}
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="p-6 border-b border-blue-100 bg-blue-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Your Invoices</h3>
                  <p className="text-gray-600">View and manage your invoice history</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <InvoiceList />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
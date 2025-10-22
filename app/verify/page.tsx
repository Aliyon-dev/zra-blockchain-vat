'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Receipt, ArrowLeft, Shield, Search, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import VerifyForm from "@/components/verify-form"

export default function VerifyPage() {
  const verificationSteps = [
    {
      icon: Search,
      title: "Enter Invoice ID",
      description: "Provide the unique invoice identifier"
    },
    {
      icon: Shield,
      title: "Blockchain Check",
      description: "We verify against the distributed ledger"
    },
    {
      icon: CheckCircle,
      title: "Get Results",
      description: "Instant verification status and details"
    }
  ]

  const sampleInvoices = [
    { id: "INV-2024-001", status: "verified", amount: "₦150,000", date: "2024-01-15" },
    { id: "INV-2024-002", status: "pending", amount: "₦275,500", date: "2024-01-16" },
    { id: "INV-2024-003", status: "verified", amount: "₦89,750", date: "2024-01-17" }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-100 text-emerald-700"
      case "pending":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-red-100 text-red-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-emerald-600 bg-clip-text text-transparent">
                VAT Manager
              </h1>
              <p className="text-xs text-slate-500 font-medium">Enterprise Edition</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="hover:bg-slate-100 hover:text-slate-700 text-slate-600 font-medium transition-all duration-200 rounded-xl"
              >
                Home
              </Button>
            </Link>
            <Link href="/issue">
              <Button 
                variant="ghost" 
                className="hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-medium transition-all duration-200 rounded-xl"
              >
                Issue Invoice
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Verification Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Shield className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Verify Invoice Authenticity
                      </h2>
                      <p className="text-emerald-100 text-sm">
                        Check the validity and authenticity of any VAT invoice using blockchain verification
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  <VerifyForm />
                </div>
              </div>

              {/* Verification Steps */}
              <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8">
                <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-emerald-600" />
                  </div>
                  How Verification Works
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {verificationSteps.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                        <step.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-slate-600 text-sm">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sample Invoices & Info */}
            <div className="space-y-6">
              {/* Sample Invoices */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  Sample Invoices
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Try verifying these sample invoices to test the system:
                </p>
                <div className="space-y-3">
                  {sampleInvoices.map((invoice, index) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-all duration-200 group cursor-pointer border border-slate-200/60"
                      onClick={() => {
                        // In a real app, this would populate the form
                        console.log('Selected invoice:', invoice.id)
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(invoice.status)}
                        <div>
                          <code className="text-sm font-mono font-semibold text-slate-800 block">
                            {invoice.id}
                          </code>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">
                              {invoice.amount}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button size="sm" className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">
                          Verify
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Benefits */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-xl border border-emerald-200/60 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  🔒 Why Verify?
                </h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Prevent fraud and counterfeit invoices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Ensure compliance with tax regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>Maintain accurate financial records</span>
                  </li>
                </ul>
              </div>

              {/* Support Card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl border border-slate-200/60 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Need Assistance?
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Our team is here to help with invoice verification and any questions.
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-slate-700 hover:bg-white border-slate-300 rounded-xl"
                  >
                    📞 Contact Support
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-slate-700 hover:bg-white border-slate-300 rounded-xl"
                  >
                    📚 Verification Guide
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Verification CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-emerald-600/5 to-green-600/5 rounded-2xl p-8 border border-emerald-200/30">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Need to verify multiple invoices?
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Our enterprise plan offers bulk verification and API access for high-volume needs.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Bulk Verification
                </Button>
                <Link href="/issue">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 rounded-xl"
                  >
                    Issue New Invoice
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 mt-16 py-8 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">VAT Manager</h3>
                <p className="text-xs text-slate-600">Secure Invoice Verification</p>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              © 2024 VAT Invoice Registry. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
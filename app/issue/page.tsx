import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Receipt, ArrowLeft, FileText, Shield, Zap, Lock } from "lucide-react"
import InvoiceForm from "@/components/invoice-form"

export default function IssuePage() {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Verified",
      description: "Every invoice is cryptographically signed and stored on the blockchain"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Real-time validation and immediate availability for verification"
    },
    {
      icon: Lock,
      title: "Tamper-Proof",
      description: "Immutable records ensure invoice integrity and prevent fraud"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
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
            <Link href="/verify">
              <Button 
                variant="ghost" 
                className="hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 font-medium transition-all duration-200 rounded-xl"
              >
                Verify Invoice
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
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FileText className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Create New Invoice
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Fill in the details below to issue a blockchain-verified VAT invoice
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  <InvoiceForm />
                </div>
              </div>
            </div>

            {/* Right Column - Features & Info */}
            <div className="space-y-6">
              {/* Features */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Why Blockchain Verification?
                </h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <feature.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800 text-sm">
                          {feature.title}
                        </h4>
                        <p className="text-slate-600 text-xs mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl border border-blue-200/60 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  💡 Quick Tips
                </h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                      1
                    </div>
                    <span>Ensure all TPIN numbers are valid and active</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                      2
                    </div>
                    <span>Double-check amounts and VAT calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                      3
                    </div>
                    <span>Review all details before submitting</span>
                  </li>
                </ul>
              </div>

              {/* Support Card */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl border border-slate-200/60 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Need Help?
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Our support team is here to assist you with invoice creation and verification.
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
                    📚 View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600/5 to-cyan-600/5 rounded-2xl p-8 border border-blue-200/30">
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Ready to verify an existing invoice?
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Use our instant verification tool to check the authenticity of any VAT invoice.
              </p>
              <Link href="/verify">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg shadow-emerald-500/25 rounded-xl"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Verify Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 mt-16 py-8 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">VAT Manager</h3>
                <p className="text-xs text-slate-600">Secure Invoice Management</p>
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
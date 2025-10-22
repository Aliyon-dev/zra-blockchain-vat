import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ShieldCheck, Receipt, Zap, Lock, Globe, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  const demoInvoices = [
    { id: "INV-2024-001", status: "verified", amount: "₦150,000" },
    { id: "INV-2024-002", status: "pending", amount: "₦275,500" },
    { id: "INV-2024-003", status: "verified", amount: "₦89,750" },
  ]

  const features = [
    {
      icon: Lock,
      title: "Military-Grade Security",
      description: "Blockchain-verified invoices with end-to-end encryption and zero-knowledge proofs.",
      gradient: "from-blue-600 to-blue-800",
      shadow: "shadow-blue-500/25"
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description: "Verify invoice authenticity in seconds with cryptographic hashes and real-time validation.",
      gradient: "from-blue-500 to-blue-700",
      shadow: "shadow-blue-500/25"
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "Meet international VAT standards with automated compliance checks and audit trails.",
      gradient: "from-cyan-500 to-blue-600",
      shadow: "shadow-cyan-500/25"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50/30 to-indigo-50/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-300 to-sky-300 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-sky-300 to-blue-300 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-200 to-blue-300 rounded-full blur-3xl opacity-10 animate-pulse delay-500" />
      </div>

      <header className="border-b border-blue-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                VAT Manager
              </h1>
              <p className="text-xs text-blue-600 font-medium">Enterprise Edition</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/issue">
              <Button 
                variant="ghost" 
                className="hover:bg-blue-50 hover:text-blue-700 text-blue-800 font-medium transition-all duration-200 rounded-xl"
              >
                Issue Invoice
              </Button>
            </Link>
            <Link href="/verify">
              <Button 
                variant="ghost" 
                className="hover:bg-blue-50 hover:text-blue-700 text-blue-800 font-medium transition-all duration-200 rounded-xl"
              >
                Verify Invoice
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 rounded-xl"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200/60 text-blue-700 text-sm font-medium mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 animate-ping" />
              Blockchain-Powered Invoice Verification
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
              Secure VAT Invoice
              <span className="block">Management</span>
            </h1>
            <p className="text-xl text-blue-800 mb-10 max-w-2xl mx-auto leading-relaxed">
              Issue and verify VAT invoices with enterprise-grade blockchain technology. 
 Enhance national revenue assurance through secure, transparent, and tamper-proof invoicing — powered by blockchain integrity
            </p>
            <div className="flex items-center justify-center gap-4 mb-16">
              <Link href="/issue">
                <Button
                  size="lg"
                  className="text-base h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 rounded-2xl"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Issue New Invoice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base h-14 px-8 border-2 border-blue-300 bg-white/80 backdrop-blur-sm text-blue-700 hover:bg-white hover:border-blue-400 hover:text-blue-900 shadow-sm transition-all duration-200 rounded-2xl"
                >
                  <ShieldCheck className="mr-3 h-5 w-5" />
                  Verify Invoice
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">50K+</div>
                <div className="text-sm text-blue-700 font-medium">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">10M+</div>
                <div className="text-sm text-blue-700 font-medium">Invoices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">99.9%</div>
                <div className="text-sm text-blue-700 font-medium">Uptime</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border-blue-200/60 bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden group"
              >
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-blue-900 text-xl font-bold mb-3">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-blue-700 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Demo Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-blue-200/60 bg-gradient-to-br from-white to-blue-50/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border-0">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent mb-4">
                  Demo Invoice Verification
                </CardTitle>
                <CardDescription className="text-blue-700 text-lg max-w-2xl mx-auto">
                  Test the system with these sample invoices. Experience instant verification powered by blockchain technology.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="grid gap-4 max-w-2xl mx-auto">
                  {demoInvoices.map((invoice, index) => (
                    <div 
                      key={invoice.id}
                      className="flex items-center justify-between p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-blue-200/60 hover:border-blue-400/60 hover:shadow-lg transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          invoice.status === 'verified' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {invoice.status === 'verified' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                          )}
                        </div>
                        <div>
                          <code className="text-sm font-mono font-bold text-blue-900">
                            {invoice.id}
                          </code>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-blue-700 font-medium">
                              {invoice.amount}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              invoice.status === 'verified'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {invoice.status === 'verified' ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link href="/verify">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 rounded-xl"
                        >
                          Verify
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-blue-200/60">
                  <Link href="/issue">
                    <Button 
                      variant="outline" 
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 rounded-xl"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Create New Invoice
                    </Button>
                  </Link>
                  <Link href="/verify">
                    <Button 
                      variant="outline" 
                      className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 rounded-xl"
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Bulk Verification
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent mb-6">
                Ready to Secure Your Invoices?
              </h2>
              <p className="text-lg text-blue-700 mb-8">
                Join thousands of businesses already using our blockchain-powered VAT management system.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/login">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 rounded-2xl px-8"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-white hover:border-blue-400 transition-all duration-200 rounded-2xl px-8"
                  >
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-200/60 mt-24 py-12 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900">VAT Manager</h3>
                <p className="text-sm text-blue-600">Enterprise Edition</p>
              </div>
            </div>
            <div className="text-sm text-blue-600">
              © 2024 VAT Invoice Registry. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ShieldCheck, Receipt } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              VAT Invoice Registry
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/issue">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                Issue Invoice
              </Button>
            </Link>
            <Link href="/verify">
              <Button variant="ghost" className="hover:bg-secondary/10 hover:text-secondary">
                Verify Invoice
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
            Blockchain-Powered Invoice Verification
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6 text-balance">
            Secure VAT Invoice Management
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Issue and verify VAT invoices with blockchain technology. Ensure authenticity, prevent fraud, and maintain a
            tamper-proof record of all transactions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/issue">
              <Button
                size="lg"
                className="text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
              >
                <FileText className="mr-2 h-5 w-5" />
                Issue New Invoice
              </Button>
            </Link>
            <Link href="/verify">
              <Button
                size="lg"
                variant="outline"
                className="text-base border-2 border-secondary text-secondary hover:bg-secondary/10 bg-transparent"
              >
                <ShieldCheck className="mr-2 h-5 w-5" />
                Verify Invoice
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-foreground">Issue Invoices</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create blockchain-verified invoices with supplier and buyer TPINs, amounts, and VAT details.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-secondary/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mb-4 shadow-lg shadow-secondary/25">
                <ShieldCheck className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-foreground">Verify Authenticity</CardTitle>
              <CardDescription className="text-muted-foreground">
                Instantly verify invoice authenticity using blockchain records and cryptographic hashes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center mb-4 shadow-lg shadow-accent/25">
                <Receipt className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-foreground">QR Code Access</CardTitle>
              <CardDescription className="text-muted-foreground">
                Each invoice includes a QR code for quick verification and mobile access.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demo Data Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-secondary" />
                Demo Invoice IDs
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Use these sample invoice IDs to test the verification system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-card to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <code className="text-sm font-mono text-primary font-semibold">INV-2024-001</code>
                  <Link href="/verify">
                    <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                      Verify
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-card to-secondary/5 border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
                  <code className="text-sm font-mono text-secondary font-semibold">INV-2024-002</code>
                  <Link href="/verify">
                    <Button size="sm" variant="ghost" className="text-secondary hover:bg-secondary/10">
                      Verify
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-card to-accent/5 border-2 border-accent/20 hover:border-accent/40 transition-colors">
                  <code className="text-sm font-mono text-accent font-semibold">INV-2024-003</code>
                  <Link href="/verify">
                    <Button size="sm" variant="ghost" className="text-accent hover:bg-accent/10">
                      Verify
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-24 py-8 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>VAT Invoice Registry Demo • Blockchain-Powered Invoice Verification</p>
        </div>
      </footer>
    </div>
  )
}

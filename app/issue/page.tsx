import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Receipt, ArrowLeft } from "lucide-react"
import InvoiceForm from "@/components/invoice-form"

export default function IssuePage() {
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
            <Link href="/">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                Home
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-10 rounded-full bg-gradient-to-b from-primary to-secondary" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Issue New Invoice
              </h2>
            </div>
            <p className="text-muted-foreground ml-7">
              Create a blockchain-verified VAT invoice with supplier and buyer details
            </p>
          </div>

          <InvoiceForm />
        </div>
      </main>
    </div>
  )
}

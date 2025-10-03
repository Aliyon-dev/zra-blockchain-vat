import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Receipt, ArrowLeft } from "lucide-react"
import VerifyForm from "@/components/verify-form"

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">VAT Invoice Registry</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/issue">
              <Button variant="ghost">Issue Invoice</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Verify Invoice</h2>
            <p className="text-muted-foreground">Check the authenticity and validity of a VAT invoice using its ID</p>
          </div>

          <VerifyForm />
        </div>
      </main>
    </div>
  )
}

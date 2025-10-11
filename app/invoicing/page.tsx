"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function InvoicingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente a la página de nueva factura
    router.push('/invoicing/new')
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-muted-foreground">Redirigiendo...</p>
      </div>
    </div>
  )
}

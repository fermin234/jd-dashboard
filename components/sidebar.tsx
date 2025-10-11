"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, FileText, Printer, LayoutDashboard, FolderOpen, ChevronDown, Plus, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    href: "/products",
    icon: Package,
  },
  {
    title: "Categorías",
    href: "/categories",
    icon: FolderOpen,
  },
  {
    title: "Facturación",
    icon: FileText,
    subItems: [
      {
        title: "Nueva Factura",
        href: "/invoicing/new",
        icon: Plus,
      },
      {
        title: "Todas las Facturas",
        href: "/invoicing/list",
        icon: List,
      },
    ],
  },
  {
    title: "Códigos de Barra",
    href: "/barcodes",
    icon: Printer,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Facturación"])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    )
  }

  const isInvoicingActive = pathname.startsWith('/invoicing')

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">Juanita Deco</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          
          // Si el item tiene subItems
          if (item.subItems) {
            const isExpanded = expandedItems.includes(item.title)
            const hasActiveSubItem = item.subItems.some(subItem => pathname === subItem.href)
            
            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    hasActiveSubItem || isInvoicingActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded ? "rotate-180" : ""
                    )}
                  />
                </button>
                
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-sidebar-border pl-4">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isActive = pathname === subItem.href
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <SubIcon className="h-4 w-4" />
                          {subItem.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }
          
          // Items normales sin subItems
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

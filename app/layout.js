import { Inter } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "HealthX Dashboard",
  description: "AI health consultation dashboard",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">{children}</main>
        </div>
      </body>
    </html>
  )
}

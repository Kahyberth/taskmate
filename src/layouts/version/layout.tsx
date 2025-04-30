import type React from "react"



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <div className="flex min-h-screen flex-col font-sans antialiased">
            {children}
          </div>
      </body>
    </html>
  )
}


export const metadata = {
  title: 'CRUD Produk Next.js + MySQL',
  description: 'Aplikasi CRUD Sederhana dengan Aiven MySQL',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}

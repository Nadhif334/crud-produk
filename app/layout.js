import "./globals.css";

export const metadata = {
  title: "CRUD Produk",
  description: "Aplikasi pengelolaan data produk menggunakan Next.js dan MySQL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
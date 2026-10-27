async function ambilProduk() {
  setLoading(true);
  setError("");

  try {
    const response = await fetch("/api/products", {
      cache: "no-store",
    });

    const text = await response.text();

    let data;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error("Server mengirim respons yang tidak valid.");
    }

    if (!response.ok) {
      throw new Error(
        data?.message || "Gagal mengambil data produk."
      );
    }

    if (!Array.isArray(data)) {
      throw new Error("Format data produk tidak sesuai.");
    }

    setProduk(data);
  } catch (err) {
    console.error("Gagal mengambil produk:", err);
    setProduk([]);
    setError(err.message || "Terjadi kesalahan.");
  } finally {
    setLoading(false);
  }
}


"use client";

import { useEffect, useState } from "react";

const initialForm = {
  nama: "",
  deskripsi: "",
  harga: ""
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil produk");
      }

      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const nama = form.nama.trim();
    const deskripsi = form.deskripsi.trim();
    const harga = Number(form.harga);

    if (!nama || !form.harga || !Number.isFinite(harga) || harga <= 0) {
      setError("Nama dan harga produk harus diisi dengan benar.");
      return;
    }

    setSaving(true);

    try {
      const url = editId
        ? `/api/products/${editId}`
        : "/api/products";

      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nama,
          deskripsi,
          harga
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menyimpan produk");
      }

      setSuccess(data.message);
      setForm(initialForm);
      setEditId(null);

      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(product) {
    setForm({
      nama: product.nama,
      deskripsi: product.deskripsi || "",
      harga: String(product.harga)
    });

    setEditId(product.id);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function handleCancelEdit() {
    setForm(initialForm);
    setEditId(null);
    setError("");
    setSuccess("");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus produk ini?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus produk");
      }

      setSuccess(data.message);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Number(value));
  }

  return (
    <main className="container">
      <header className="header">
        <h1>CRUD Produk</h1>
        <p>
          Aplikasi pengelolaan data produk menggunakan Next.js
          dan MySQL.
        </p>
      </header>

      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert success" role="status">
          {success}
        </div>
      )}

      <section className="card">
        <h2>{editId ? "Edit Produk" : "Tambah Produk"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nama">Nama Produk</label>

            <input
              id="nama"
              name="nama"
              type="text"
              placeholder="Masukkan nama produk"
              value={form.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deskripsi">Deskripsi</label>

            <textarea
              id="deskripsi"
              name="deskripsi"
              placeholder="Masukkan deskripsi produk"
              value={form.deskripsi}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="harga">Harga (Rp)</label>

            <input
              id="harga"
              name="harga"
              type="number"
              min="1"
              step="1"
              placeholder="Masukkan harga produk"
              value={form.harga}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button
              className="button primary"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Menyimpan..."
                : editId
                  ? "Simpan Perubahan"
                  : "Tambah Produk"}
            </button>

            {editId && (
              <button
                className="button secondary"
                type="button"
                onClick={handleCancelEdit}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="section-heading">
          <h2>Daftar Produk</h2>

          <button
            className="button secondary"
            type="button"
            onClick={loadProducts}
            disabled={loading}
          >
            Muat Ulang
          </button>
        </div>

        {loading ? (
          <p className="empty">Memuat data produk...</p>
        ) : products.length === 0 ? (
          <p className="empty">Belum ada produk.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Produk</th>
                  <th>Deskripsi</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.nama}</td>
                    <td>{product.deskripsi || "-"}</td>
                    <td>{formatRupiah(product.harga)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="button edit"
                          type="button"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>

                        <button
                          className="button delete"
                          type="button"
                          onClick={() => handleDelete(product.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="footer">
        CRUD Produk — Next.js + MySQL Aiven
      </footer>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [produk, setProduk] = useState([]);

  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");

  // MENGAMBIL DATA PRODUK
  async function ambilProduk() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil data produk."
        );
      }

      setProduk(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ambilProduk();
  }, []);

  // MENGUBAH INPUT
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // MENYIMPAN ATAU MENGEDIT PRODUK
  async function handleSubmit(e) {
    e.preventDefault();

    setPesan("");
    setError("");

    try {
      const url = editId
        ? `/api/products/${editId}`
        : "/api/products";

      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: form.nama,
          deskripsi: form.deskripsi,
          harga: form.harga,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menyimpan produk."
        );
      }

      setPesan(data.message);

      setForm({
        nama: "",
        deskripsi: "",
        harga: "",
      });

      setEditId(null);

      await ambilProduk();
    } catch (err) {
      setError(err.message);
    }
  }

  // MEMILIH PRODUK UNTUK DIEDIT
  function mulaiEdit(item) {
    setEditId(item.id);

    setForm({
      nama: item.nama,
      deskripsi: item.deskripsi || "",
      harga: String(item.harga),
    });

    setPesan("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // MEMBATALKAN EDIT
  function batalEdit() {
    setEditId(null);

    setForm({
      nama: "",
      deskripsi: "",
      harga: "",
    });

    setPesan("");
    setError("");
  }

  // MENGHAPUS PRODUK
  async function hapusProduk(id) {
    const yakin = window.confirm(
      "Yakin ingin menghapus produk ini?"
    );

    if (!yakin) return;

    setPesan("");
    setError("");

    try {
      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menghapus produk."
        );
      }

      setPesan(data.message);

      if (Number(editId) === Number(id)) {
        batalEdit();
      }

      await ambilProduk();
    } catch (err) {
      setError(err.message);
    }
  }

  // FORMAT HARGA
  function formatRupiah(harga) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(harga));
  }

  return (
    <main className="container">
      <h1>CRUD Produk</h1>

      <p className="subtitle">
        Aplikasi pengelolaan data produk menggunakan Next.js
        dan MySQL.
      </p>

      {pesan && (
        <div className="success">
          {pesan}
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <section className="form-card">
        <h2>
          {editId ? "Edit Produk" : "Tambah Produk"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nama"
            placeholder="Nama Produk"
            value={form.nama}
            onChange={handleChange}
            required
          />

          <textarea
            name="deskripsi"
            placeholder="Deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            rows={3}
          />

          <input
            type="number"
            name="harga"
            placeholder="Harga"
            value={form.harga}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />

          <button type="submit" className="save-button">
            {editId ? "Update Produk" : "Simpan"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={batalEdit}
              className="cancel-button"
            >
              Batal Edit
            </button>
          )}
        </form>
      </section>

      <section className="table-section">
        <h2>Daftar Produk</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Deskripsi</th>
                <th>Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">
                    Memuat data produk...
                  </td>
                </tr>
              ) : produk.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    Tidak ada data produk.
                  </td>
                </tr>
              ) : (
                produk.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nama}</td>

                    <td>
                      {item.deskripsi || "-"}
                    </td>

                    <td>
                      {formatRupiah(item.harga)}
                    </td>

                    <td>
                      <button
                        onClick={() => mulaiEdit(item)}
                        className="edit-button"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => hapusProduk(item.id)}
                        className="delete-button"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
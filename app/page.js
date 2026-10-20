'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ id: '', name: '', description: '', price: '' });
  const [error, setError] = useState(null);

  // Fungsi fetch yang aman dari error 'Unexpected token <'
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      
      // Proteksi jika yang kembali ternyata halaman error HTML (bukan JSON)
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server mengirim respon non-JSON. Periksa koneksi database Anda.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengambil data');
      
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/api/products/${formData.id}` : '/api/products';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan data');
      }

      setFormData({ id: '', name: '', description: '', price: '' });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus data');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>CRUD Produk</h1>
      <p>Aplikasi pengelolaan data produk menggunakan Next.js dan MySQL.</p>

      {/* Tampilan Pesan Error */}
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.375rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {/* Form Tambah/Edit */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
        <h3>{formData.id ? 'Edit Produk' : 'Tambah Produk'}</h3>
        <input type="text" placeholder="Nama Produk" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '0.5rem' }} />
        <textarea placeholder="Deskripsi" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '0.5rem' }} />
        <input type="number" placeholder="Harga" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={{ padding: '0.5rem' }} />
        <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer' }}>Simpan</button>
        {formData.id && <button type="button" onClick={() => setFormData({ id: '', name: '', description: '', price: '' })} style={{ padding: '0.5rem', backgroundColor: '#gray' }}>Batal</button>}
      </form>

      {/* Tabel Data */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Tidak ada data produk.</td></tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>Rp {Number(p.price).toLocaleString('id-ID')}</td>
                <td>
                  <button onClick={() => handleEdit(p)} style={{ marginRight: '0.5rem' }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>Hapus</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

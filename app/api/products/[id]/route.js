import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// GET detail
export async function GET(request, { params }) {
  try {
    const id = params.id;
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const { name, description, price } = await request.json();
    const db = await getConnection();
    
    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
      [name, description, price, id]
    );
    
    return NextResponse.json({ message: 'Produk berhasil diperbarui' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE hapus
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const db = await getConnection();
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

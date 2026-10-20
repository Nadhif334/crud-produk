import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

// GET: Mengambil semua data produk
export async function GET() {
  try {
    const db = await getConnection();
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Membuat data produk baru
export async function POST(request) {
  try {
    const { name, description, price } = await request.json();
    
    if (!name || !price) {
      return NextResponse.json({ error: 'Nama dan Harga wajib diisi' }, { status: 400 });
    }

    const db = await getConnection();
    const [result] = await db.query(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [name, description, price]
    );

    return NextResponse.json({ id: result.insertId, name, description, price }, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

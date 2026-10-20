import { NextResponse } from "next/server";
import pool from "@/lib/db";

// READ: Mengambil satu produk berdasarkan ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Gagal mengambil detail produk:", error);

    return NextResponse.json(
      { message: "Gagal mengambil detail produk" },
      { status: 500 }
    );
  }
}

// UPDATE: Mengedit produk
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    const body = await request.json();

    const nama = String(body.nama ?? "").trim();
    const deskripsi = String(body.deskripsi ?? "").trim();
    const harga = body.harga;

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

    if (
      !nama ||
      !Number.isFinite(harga) ||
      harga <= 0
    ) {
      return NextResponse.json(
        { message: "Nama dan harga produk harus valid" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      `UPDATE products
       SET nama = ?, deskripsi = ?, harga = ?
       WHERE id = ?`,
      [nama, deskripsi, harga, productId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Produk berhasil diperbarui"
    });
  } catch (error) {
    console.error("Gagal mengedit produk:", error);

    return NextResponse.json(
      { message: "Gagal mengedit produk" },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus produk
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

    const [result] = await pool.execute(
      "DELETE FROM products WHERE id = ?",
      [productId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Produk berhasil dihapus"
    });
  } catch (error) {
    console.error("Gagal menghapus produk:", error);

    return NextResponse.json(
      { message: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}
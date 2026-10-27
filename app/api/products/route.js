import { NextResponse } from "next/server";
import db from "@/lib/db";

// MEMERIKSA ID
function validId(id) {
  return /^\d+$/.test(String(id)) && Number(id) > 0;
}

// MENGEDIT PRODUK
export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { message: "ID produk tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const nama = String(body.nama || "").trim();
    const deskripsi = String(body.deskripsi || "").trim();

    if (
      !nama ||
      body.harga === "" ||
      body.harga === null ||
      body.harga === undefined
    ) {
      return NextResponse.json(
        { message: "Nama dan harga wajib diisi." },
        { status: 400 }
      );
    }

    const harga = Number(body.harga);

    if (!Number.isFinite(harga) || harga < 0) {
      return NextResponse.json(
        { message: "Harga tidak valid." },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      `UPDATE produk
       SET nama = ?, deskripsi = ?, harga = ?
       WHERE id = ?`,
      [nama, deskripsi, harga, Number(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Produk berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Error mengedit produk:", error);

    return NextResponse.json(
      {
        message: "Gagal mengedit produk.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// MENGHAPUS PRODUK
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!validId(id)) {
      return NextResponse.json(
        { message: "ID produk tidak valid." },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      "DELETE FROM produk WHERE id = ?",
      [Number(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Produk berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error menghapus produk:", error);

    return NextResponse.json(
      {
        message: "Gagal menghapus produk.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
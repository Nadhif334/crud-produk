import { NextResponse } from "next/server";
import db from "@/lib/db";

// MENAMPILKAN SEMUA PRODUK
export async function GET() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM produk ORDER BY id DESC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error mengambil produk:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data produk.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// MENAMBAHKAN PRODUK
export async function POST(request) {
  try {
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
      `INSERT INTO produk (nama, deskripsi, harga)
       VALUES (?, ?, ?)`,
      [nama, deskripsi, harga]
    );

    return NextResponse.json(
      {
        message: "Produk berhasil ditambahkan.",
        id: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error menambahkan produk:", error);

    return NextResponse.json(
      {
        message: "Gagal menyimpan produk.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
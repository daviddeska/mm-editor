/**
 * app/api/upload/route.ts
 * -----------------------
 * API endpoint pro nahrávání souborů.
 * Demo verze — ukládá soubory do /public/uploads/
 *
 * Pokud soubor se stejným názvem již existuje, vrátí jeho URL bez opětovného nahrání.
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import { join } from "path";

const MAX_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/ogg",
];

// Vytvoří bezpečný název souboru
function safeName(original: string): string {
  return original
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();
}

// Zkontroluje jestli soubor existuje na disku
async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Žádný soubor nebyl odeslán" },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Soubor je příliš velký (max 50 MB)" },
        { status: 400 },
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Nepodporovaný typ souboru: ${file.type}` },
        { status: 400 },
      );
    }

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Název souboru bez timestamp — použijeme původní název
    // Díky tomu lze detekovat duplicity
    const filename = safeName(file.name);
    const filePath = join(uploadDir, filename);

    // Pokud soubor již existuje, vrátíme jeho URL bez nahrání
    if (await fileExists(filePath)) {
      return NextResponse.json({
        url: `/uploads/${filename}`,
        filename,
        originalName: file.name,
        skipped: true, // Soubor nebyl nahrán znovu
      });
    }

    // Soubor neexistuje — nahrajeme ho
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      skipped: false,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Nahrávání selhalo" }, { status: 500 });
  }
}

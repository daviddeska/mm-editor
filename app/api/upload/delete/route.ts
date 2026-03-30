import { NextRequest, NextResponse } from "next/server";
import { sftpDelete } from "@/lib/sftp";

export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json();
    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ error: "Chybí název souboru" }, { status: 400 });
    }
    // Prevent path traversal
    if (filename.includes("/") || filename.includes("..")) {
      return NextResponse.json({ error: "Neplatný název souboru" }, { status: 400 });
    }
    await sftpDelete(filename);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("SFTP delete error:", error);
    return NextResponse.json({ error: "Smazání selhalo" }, { status: 500 });
  }
}

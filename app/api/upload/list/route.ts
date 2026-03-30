import { NextResponse } from "next/server";
import { sftpList, getShoptetUrl } from "@/lib/sftp";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const files = await sftpList();
    const withUrls = files.map((f) => ({
      ...f,
      url: getShoptetUrl(f.filename),
    }));
    return NextResponse.json(withUrls);
  } catch (error) {
    console.error("SFTP list error:", error);
    return NextResponse.json(
      { error: "Nepodařilo se načíst seznam souborů" },
      { status: 500 },
    );
  }
}

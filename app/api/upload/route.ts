import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  // ESTO APARECERÁ EN TU TERMINAL NEGRA
  console.log("🚀 ¡PETICIÓN DE SUBIDA RECIBIDA EN EL SERVIDOR!");
  
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  console.log("🔑 ¿Token configurado?:", token ? "SÍ (empieza con " + token.substring(0, 10) + "...)" : "NO");

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      console.error("❌ Error: No llegó el nombre del archivo");
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const blob = await put(filename, request.body!, {
      access: 'public',
      token: token,
      addRandomSuffix: true, // <--- ESTO GENERARÁ UN NOMBRE ÚNICO SIEMPRE
    });

    console.log("✅ ¡Subida exitosa a Vercel Blob!", blob.url);
    return NextResponse.json(blob);

  } catch (error: any) {
    console.error("🔥 Error interno en la API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { AutomovelUsuario } from "@/types";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

const DATA_PATH = process.cwd() + "/src/data/automoveis.json";

async function lerAutomoveis(): Promise<AutomovelUsuario[]> {
  try {
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(file);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const automoveis = await lerAutomoveis();
  return NextResponse.json(automoveis);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      NR_QUILOMETRAGEM,
      NR_ANO,
      DS_PLACA,
      DS_MODELO,
      TP_AUTOMOVEL,
      DS_MARCA,
      DS_HISTORICO_AUTOMOVEL,
      DS_AUTOMOVEL,
    } = body;

    // Validações básicas
    if (!DS_PLACA || !DS_MODELO || !DS_MARCA || !TP_AUTOMOVEL) {
      return NextResponse.json(
        { msg: "Campos obrigatórios: DS_PLACA, DS_MODELO, DS_MARCA, TP_AUTOMOVEL" },
        { status: 400 }
      );
    }

    const data = await lerAutomoveis();

    // Verifica placa duplicada
    const placaDuplicada = data.find(
      (a) => a.DS_PLACA?.toUpperCase() === DS_PLACA.toUpperCase()
    );
    if (placaDuplicada) {
      return NextResponse.json(
        { msg: "Já existe um veículo cadastrado com essa placa." },
        { status: 409 }
      );
    }

    // Gera ID único
    const novoId = data.length > 0 ? Math.max(...data.map((a) => a.ID_AUTOMOVEL)) + 1 : 1;

    const novoAutomovel: AutomovelUsuario = {
      ID_AUTOMOVEL: novoId,         // ✅ ID gerado corretamente
      NR_QUILOMETRAGEM: Number(NR_QUILOMETRAGEM) || 0,
      NR_ANO: Number(NR_ANO) || 0,
      DS_PLACA: DS_PLACA.toUpperCase(),
      DS_MODELO,
      TP_AUTOMOVEL,
      DS_MARCA,
      DS_HISTORICO_AUTOMOVEL: DS_HISTORICO_AUTOMOVEL || "",
      DS_AUTOMOVEL: DS_AUTOMOVEL || "",
    };

    data.push(novoAutomovel);       // ✅ push com o objeto correto
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));

    return NextResponse.json(novoAutomovel, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Erro ao cadastrar automóvel: " + error },
      { status: 500 }
    );
  }
}

import { AutomovelUsuario } from "@/types";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export async function GET() {

    const file = await fs.readFile(process.cwd() + '/src/data/automoveis.json', 'utf-8');
    const automovel = JSON.parse(file);

    return NextResponse.json(automovel);

}

export async function POST(request: Request) {

    const file = await fs.readFile(process.cwd() + '/src/data/automoveis.json', 'utf-8')
    const data = JSON.parse(file)
    const { ID_AUTOMOVEL, NR_QUILOMETRAGEM, NR_ANO, DS_PLACA, DS_MODELO, TP_AUTOMOVEL, DS_MARCA, DS_HISTORICO_AUTOMOVEL, DS_AUTOMOVEL  } = await request.json()
    const automovel = { ID_AUTOMOVEL, NR_QUILOMETRAGEM, NR_ANO, DS_PLACA, DS_MODELO, TP_AUTOMOVEL, DS_MARCA, DS_HISTORICO_AUTOMOVEL, DS_AUTOMOVEL} as AutomovelUsuario
    DS_AUTOMOVEL.ID_AUTOMOVEL = Number(Date.now())
    data.push()
    const json = JSON.stringify(data)
    await fs.writeFile(process.cwd() + '/src/data/automoveis.json', json)
    return NextResponse.json(automovel)
}


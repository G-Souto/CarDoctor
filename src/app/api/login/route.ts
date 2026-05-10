import { promises as fs } from "fs"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

// Tipos
type LoginUsuario = {
  ID_LOGIN: number
  DS_SENHA: string
  ID_USUARIO: number
  DS_USUARIO: string
}

type Usuario = {
  ID_USUARIO: number
  NM_USUARIO: string
  NR_IDADE: number
  NR_CNH: number
  DT_NASCIMENTO: string
  NR_CPF: string
}

const LOGIN_PATH = path.join(process.cwd(), "src/data/logins.json")
const USUARIOS_PATH = path.join(process.cwd(), "src/data/usuarios.json")

async function lerJSON<T>(filePath: string): Promise<T[]> {
  try {
    const file = await fs.readFile(filePath, "utf-8")
    const parsed = JSON.parse(file)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// GET /api/login — retorna todos os logins (usado pelo authService)
export async function GET() {
  const logins = await lerJSON<LoginUsuario>(LOGIN_PATH)
  return NextResponse.json(logins)
}

// POST /api/login — autentica o usuário
export async function POST(request: NextRequest) {
  try {
    const { DS_USUARIO, DS_SENHA } = await request.json()

    if (!DS_USUARIO || !DS_SENHA) {
      return NextResponse.json(
        { erro: "Usuário e senha são obrigatórios." },
        { status: 400 }
      )
    }

    const logins = await lerJSON<LoginUsuario>(LOGIN_PATH)
    const login = logins.find(
      (l) => l.DS_USUARIO === DS_USUARIO && l.DS_SENHA === DS_SENHA
    )

    if (!login) {
      return NextResponse.json(
        { erro: "Credenciais inválidas." },
        { status: 401 }
      )
    }

    // Busca dados do usuário
    const usuarios = await lerJSON<Usuario>(USUARIOS_PATH)
    const usuario = usuarios.find((u) => u.ID_USUARIO === login.ID_USUARIO)

    return NextResponse.json({
      ID_USUARIO: login.ID_USUARIO,
      DS_USUARIO: login.DS_USUARIO,
      NM_USUARIO: usuario?.NM_USUARIO ?? DS_USUARIO,
    })
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao processar login: " + error },
      { status: 500 }
    )
  }
}

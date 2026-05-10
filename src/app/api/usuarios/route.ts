import { promises as fs } from "fs"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

type Usuario = {
  ID_USUARIO: number
  NM_USUARIO: string
  NR_IDADE: number
  NR_CNH: number
  DT_NASCIMENTO: string
  NR_CPF: string
}

type LoginUsuario = {
  ID_LOGIN: number
  DS_SENHA: string
  ID_USUARIO: number
  DS_USUARIO: string
}

const USUARIOS_PATH = path.join(process.cwd(), "src/data/usuarios.json")
const LOGINS_PATH = path.join(process.cwd(), "src/data/logins.json")

async function lerJSON<T>(filePath: string): Promise<T[]> {
  try {
    const file = await fs.readFile(filePath, "utf-8")
    const parsed = JSON.parse(file)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// GET /api/usuarios?id=1 — busca usuário por ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  const usuarios = await lerJSON<Usuario>(USUARIOS_PATH)

  if (id) {
    const usuario = usuarios.find((u) => u.ID_USUARIO === Number(id))
    if (!usuario) {
      return NextResponse.json({ erro: "Usuário não encontrado." }, { status: 404 })
    }
    return NextResponse.json(usuario)
  }

  return NextResponse.json(usuarios)
}

// POST /api/usuarios — cadastra novo usuário + login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      NM_USUARIO, NR_IDADE, NR_CNH, DT_NASCIMENTO, NR_CPF,
      DS_USUARIO, DS_SENHA,
    } = body

    if (!NM_USUARIO || !NR_CPF || !DS_USUARIO || !DS_SENHA) {
      return NextResponse.json(
        { erro: "Campos obrigatórios: NM_USUARIO, NR_CPF, DS_USUARIO, DS_SENHA" },
        { status: 400 }
      )
    }

    const usuarios = await lerJSON<Usuario>(USUARIOS_PATH)
    const logins = await lerJSON<LoginUsuario>(LOGINS_PATH)

    // Verifica CPF e usuário duplicados
    if (usuarios.find((u) => u.NR_CPF === NR_CPF)) {
      return NextResponse.json({ erro: "CPF já cadastrado." }, { status: 409 })
    }
    if (logins.find((l) => l.DS_USUARIO === DS_USUARIO)) {
      return NextResponse.json({ erro: "Nome de usuário já em uso." }, { status: 409 })
    }

    const novoId = usuarios.length > 0
      ? Math.max(...usuarios.map((u) => u.ID_USUARIO)) + 1
      : 1

    const novoUsuario: Usuario = {
      ID_USUARIO: novoId,
      NM_USUARIO,
      NR_IDADE: Number(NR_IDADE) || 0,
      NR_CNH: Number(NR_CNH) || 0,
      DT_NASCIMENTO: DT_NASCIMENTO || "",
      NR_CPF,
    }

    const novoLogin: LoginUsuario = {
      ID_LOGIN: logins.length > 0
        ? Math.max(...logins.map((l) => l.ID_LOGIN)) + 1
        : 1,
      DS_USUARIO,
      DS_SENHA,
      ID_USUARIO: novoId,
    }

    usuarios.push(novoUsuario)
    logins.push(novoLogin)

    await fs.writeFile(USUARIOS_PATH, JSON.stringify(usuarios, null, 2))
    await fs.writeFile(LOGINS_PATH, JSON.stringify(logins, null, 2))

    return NextResponse.json(
      { ID_USUARIO: novoId, NM_USUARIO, DS_USUARIO },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { erro: "Erro ao cadastrar usuário: " + error },
      { status: 500 }
    )
  }
}
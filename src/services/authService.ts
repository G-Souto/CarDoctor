export type LoginUsuario = {
  ID_LOGIN: number
  DS_SENHA: string
  ID_USUARIO: number
  DS_USUARIO: string
}

// Autentica o usuário via API interna do Next.js (sem localhost!)
export async function getUserIdByCredentials(
  DS_USUARIO: string,
  DS_SENHA: string
): Promise<{ ID_USUARIO: number; NM_USUARIO: string } | null> {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ DS_USUARIO, DS_SENHA }),
    })

    if (!response.ok) return null

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao autenticar:", error)
    return null
  }
}
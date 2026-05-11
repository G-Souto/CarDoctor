"use client"

import Input from "@/components/Input/Input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { getUserIdByCredentials } from "@/services/authService"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    DS_SENHA: "",
    DS_USUARIO: "",
  })
  const [error, setError] = useState("")
  const [carregando, setCarregando] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleLogin = async () => {
    if (!formData.DS_USUARIO || !formData.DS_SENHA) {
      setError("Preencha usuário e senha.")
      return
    }

    setCarregando(true)

    const resultado = await getUserIdByCredentials(
      formData.DS_USUARIO,
      formData.DS_SENHA
    )

    if (resultado) {
      // Salva ID, nome e token de sessão no localStorage
      localStorage.setItem("ID_USUARIO", resultado.ID_USUARIO.toString())
      localStorage.setItem("NM_USUARIO", resultado.NM_USUARIO)
      localStorage.setItem("DS_USUARIO", formData.DS_USUARIO)
      localStorage.setItem("authToken", "logged")
      router.push("/")
    } else {
      setError("Usuário ou senha incorretos.")
    }

    setCarregando(false)
  }

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Imagem de fundo */}
      <div className="hidden lg:block lg:w-2/3 bg-[url('/wallpaper_carro_paisagem.jpg')] bg-cover bg-left" />

      {/* Área de login */}
      <div className="lg:w-1/3 w-full flex flex-col justify-evenly p-8 min-h-screen">
        <div className="flex justify-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-600">
            CarDoctor
          </h1>
        </div>

        <div className="w-full max-w-md mx-auto space-y-4">
          <Input
            label="Nome de Usuário"
            name="DS_USUARIO"
            type="text"
            value={formData.DS_USUARIO}
            onChange={handleChange}
            placeholder="Insira seu nome de usuário"
          />
          <Input
            label="Senha"
            name="DS_SENHA"
            type="password"
            value={formData.DS_SENHA}
            onChange={handleChange}
            placeholder="Insira sua senha"
          />

          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          <button
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg transition hover:bg-white hover:text-blue-600 border border-blue-600 disabled:opacity-50"
            onClick={handleLogin}
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <Link
            href="/cadastro"
            className="block text-center text-blue-600 font-bold mt-6"
          >
            Não possuo login
          </Link>
        </div>
      </div>
    </main>
  )
}

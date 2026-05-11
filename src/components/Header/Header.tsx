"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [nomeUsuario, setNomeUsuario] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const nome =  localStorage.getItem("DS_USUARIO") || ""
    if (token) {
      setIsLoggedIn(true)
      setNomeUsuario(nome)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("ID_USUARIO")
    localStorage.removeItem("NM_USUARIO")
    localStorage.removeItem("DS_USUARIO")
    setIsLoggedIn(false)
    setNomeUsuario("")
    router.push("/")
  }

  return (
    <header className="bg-blue-500 px-4 py-4 md:px-10 flex flex-col md:flex-row justify-between items-center h-auto text-white shadow-lg">
      <div className="text-lg md:text-2xl font-bold">CarDoctor</div>

      <nav className="flex flex-wrap justify-center space-x-2 md:space-x-6">
        <Link href="/" className="relative group transition-colors duration-300 hover:text-white">
          Home
          <span className="absolute left-0 top-full w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>
        <Link href="/veiculos" className="relative group transition-colors duration-300 hover:text-white">
          Veículos
          <span className="absolute left-0 top-full w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>
        <Link href="/sobre" className="relative group transition-colors duration-300 hover:text-white">
          Sobre
          <span className="absolute left-0 top-full w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>
        <Link href="/feedbacks" className="relative group transition-colors duration-300 hover:text-white">
          Feedbacks
          <span className="absolute left-0 top-full w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </Link>
      </nav>

      {isLoggedIn ? (
        <div className="flex items-center gap-3">
          {/* Nome do usuário + link pro perfil */}
          <Link
            href="/perfil"
            className="flex items-center gap-2 bg-white text-blue-500 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            <span className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
              {nomeUsuario.charAt(0).toUpperCase()}
            </span>
            {nomeUsuario}
          </Link>
          {/* Botão de logout */}
          <button
            onClick={handleLogout}
            className="text-white border border-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition text-sm"
          >
            Sair
          </button>
        </div>
      ) : (
        <button
          className="bg-white text-blue-500 px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-blue-500 hover:text-white border border-transparent hover:border-white transition duration-500 text-sm md:text-base"
          onClick={() => router.push("/login")}
        >
          Fazer login
        </button>
      )}
    </header>
  )
}

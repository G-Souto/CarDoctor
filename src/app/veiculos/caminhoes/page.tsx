"use client"
import Header from "@/components/Header/Header"
import { AutomovelUsuario } from "@/types"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function UserProfile() {
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const storedUserId = localStorage.getItem("ID_USUARIO")
    if (storedUserId) {
      setUserId(parseInt(storedUserId))
    }
  }, [])

  const [automovelUsuario, setAutomovelUsuario] = useState<AutomovelUsuario[]>(
    []
  )
  const [idAutomovel, setIdAutomovel] = useState<number | null>(null)

  useEffect(() => {
    if (userId) {
      const chamadaApiJava = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/relacionamento_automovel/${userId}`
          )
          const data = await response.json()
          setAutomovelUsuario(data)
          if (data.length > 0) {
            setIdAutomovel(data[0].ID_AUTOMOVEL)
          }
        } catch (error) {
          console.error("Erro ao buscar dados do relacionamento:", error)
        }
      }
      chamadaApiJava()
    }
  }, [userId])

  useEffect(() => {
    if (idAutomovel) {
      const chamadaApiJavaAutomovel = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/automovel/${idAutomovel}`
          )
          const data = await response.json()
          const automoveisMoto = data.filter(
            (auto: AutomovelUsuario) => auto.TP_AUTOMOVEL === "CAMINHAO"
          )
          setAutomovelUsuario(automoveisMoto)
        } catch (error) {
          console.error("Erro ao buscar dados do automóvel:", error)
        }
      }
      chamadaApiJavaAutomovel()
    }
  }, [idAutomovel])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/automovel/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        alert("Automóvel excluído com sucesso.")
        setAutomovelUsuario((prev) =>
          prev.filter((auto) => auto.ID_AUTOMOVEL !== id)
        )
      }
    } catch (error) {
      console.error("Falha ao remover o automóvel: ", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Perfil do Usuário
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Automóveis (Tipo: Caminhao)
        </h2>
        {automovelUsuario.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automovelUsuario.map((automovel) => (
              <div
                key={automovel.ID_AUTOMOVEL}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {automovel.DS_MODELO}
                  </h3>
                  <p className="text-gray-600">Marca: {automovel.DS_MARCA}</p>
                  <p className="text-gray-600">Ano: {automovel.NR_ANO}</p>
                  <p className="text-gray-600">Placa: {automovel.DS_PLACA}</p>
                  <p className="text-gray-600">
                    Quilometragem: {automovel.NR_QUILOMETRAGEM}
                  </p>
                  <p className="text-gray-600">
                    Histórico: {automovel.DS_HISTORICO_AUTOMOVEL}
                  </p>
                  <p className="text-gray-600">
                    Descrição: {automovel.DS_AUTOMOVEL}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Link
                    href={`/veiculos/motos/${automovel.ID_AUTOMOVEL}`}
                    className="text-blue-500 hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(automovel.ID_AUTOMOVEL)}
                    className="text-red-500 hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Nenhuma caminhao encontrada.</p>
            <Link
              href={"cadastroVeiculo"}
              className="inline-block py-2 px-4 bg-blue-600 text-white font-bold rounded-lg transition duration-300 hover:bg-blue-700"
            >
              Adicionar Veículo
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

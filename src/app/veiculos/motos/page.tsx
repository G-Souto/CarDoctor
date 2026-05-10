"use client"
import Header from "@/components/Header/Header"
import { AutomovelUsuario } from "@/types"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Motos() {
  const [veiculos, setVeiculos] = useState<AutomovelUsuario[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const buscarMotos = async () => {
      try {
        const res = await fetch("/api/automoveis")
        const data: AutomovelUsuario[] = await res.json()
        setVeiculos(data.filter((v) => v.TP_AUTOMOVEL === "MOTO"))
      } catch (error) {
        console.error("Erro ao buscar motos:", error)
      } finally {
        setCarregando(false)
      }
    }
    buscarMotos()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este veículo?")) return
    try {
      const res = await fetch(`/api/automoveis/${id}`, { method: "DELETE" })
      if (res.ok) {
        setVeiculos((prev) => prev.filter((v) => v.ID_AUTOMOVEL !== id))
      }
    } catch (error) {
      console.error("Erro ao excluir:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Motos cadastradas</h1>
          <Link
            href="/veiculos/cadastroVeiculo"
            className="py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            + Novo veículo
          </Link>
        </div>

        {carregando ? (
          <p className="text-gray-500 text-center py-10">Carregando...</p>
        ) : veiculos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {veiculos.map((v) => (
              <div
                key={v.ID_AUTOMOVEL}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-1">
                    {v.DS_MARCA} {v.DS_MODELO}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    {v.TP_AUTOMOVEL} · {v.DS_HISTORICO_AUTOMOVEL}
                  </p>
                  <div className="space-y-1 text-gray-600 text-sm">
                    <p><span className="font-medium">Ano:</span> {v.NR_ANO}</p>
                    <p><span className="font-medium">Placa:</span> {v.DS_PLACA}</p>
                    <p><span className="font-medium">Quilometragem:</span> {v.NR_QUILOMETRAGEM} km</p>
                    {v.DS_AUTOMOVEL && (
                      <p><span className="font-medium">Descrição:</span> {v.DS_AUTOMOVEL}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleDelete(v.ID_AUTOMOVEL)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Nenhuma moto cadastrada ainda.</p>
            <Link
              href="/veiculos/cadastroVeiculo"
              className="inline-block py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Cadastrar veículo
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

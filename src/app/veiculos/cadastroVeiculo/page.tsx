"use client"

import Input from "@/components/Input/Input"
import { AutomovelUsuario } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CadProduto() {
  const router = useRouter()

  const [automovelData, setAutomovelData] = useState<Omit<AutomovelUsuario, "ID_AUTOMOVEL">>({
    NR_QUILOMETRAGEM: 0,
    NR_ANO: 0,
    DS_PLACA: "",
    DS_MODELO: "",
    TP_AUTOMOVEL: "",
    DS_MARCA: "",
    DS_HISTORICO_AUTOMOVEL: "",
    DS_AUTOMOVEL: "",
  })

  const [userId, setUserId] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const storedUserId = localStorage.getItem("ID_USUARIO")
    if (storedUserId) {
      setUserId(parseInt(storedUserId))
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setAutomovelData({ ...automovelData, [name]: value })
    setErro(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      // 1. Cadastra o automóvel na API interna do Next.js (sem localhost!)
      const response = await fetch("/api/automoveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(automovelData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.msg || "Erro ao cadastrar veículo.")
        return
      }

      // 2. Cria o relacionamento usuário ↔ automóvel (se tiver backend externo)
      // Caso não tenha backend, pode remover ou adaptar esse bloco
      if (userId) {
        try {
          await fetch("/api/relacionamento_automovel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ID_AUTOMOVEL: data.ID_AUTOMOVEL,
              ID_USUARIO: userId,
            }),
          })
        } catch {
          // Relacionamento é opcional — não bloqueia o fluxo
          console.warn("Não foi possível criar o relacionamento de usuário.")
        }
      }

      // 3. Reseta o formulário e redireciona
      setAutomovelData({
        NR_QUILOMETRAGEM: 0,
        NR_ANO: 0,
        DS_PLACA: "",
        DS_MODELO: "",
        TP_AUTOMOVEL: "",
        DS_MARCA: "",
        DS_HISTORICO_AUTOMOVEL: "",
        DS_AUTOMOVEL: "",
      })

      alert("Veículo cadastrado com sucesso!")
      router.push("/veiculos")
    } catch (error) {
      setErro("Erro de conexão. Tente novamente.")
      console.error("Erro:", error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h2 className="flex items-center justify-center text-2xl font-bold text-center mt-6 mb-4">
        Cadastro de Veículos
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="m-5 bg-blue-500 rounded-lg p-5 w-1/2">
            <Input
              label="Ano do automóvel"
              name="NR_ANO"
              type="number"
              value={automovelData.NR_ANO}
              onChange={handleChange}
              placeholder="Insira o ano do automóvel"
            />
            <Input
              label="Placa do automóvel"
              name="DS_PLACA"
              type="text"
              value={automovelData.DS_PLACA}
              onChange={handleChange}
              placeholder="Insira a placa do automóvel"
            />
            <Input
              label="Marca do automóvel"
              name="DS_MARCA"
              type="text"
              value={automovelData.DS_MARCA}
              onChange={handleChange}
              placeholder="Insira a marca do automóvel"
            />
            <Input
              label="Modelo do automóvel"
              name="DS_MODELO"
              type="text"
              value={automovelData.DS_MODELO}
              onChange={handleChange}
              placeholder="Insira o modelo do automóvel"
            />
            <Input
              label="Quilometragem do automóvel"
              name="NR_QUILOMETRAGEM"
              type="number"
              value={automovelData.NR_QUILOMETRAGEM}
              onChange={handleChange}
              placeholder="Insira a quilometragem do automóvel"
            />
            <Input
              label="Descrição do automóvel"
              name="DS_AUTOMOVEL"
              type="text"
              value={automovelData.DS_AUTOMOVEL}
              onChange={handleChange}
              placeholder="Insira a descrição do automóvel"
            />
            <label
              className="block font-bold text-left text-lg mb-2 w-full"
              htmlFor="TP_AUTOMOVEL"
            >
              Tipo de automóvel
            </label>
            <select
              className="p-3 mb-6 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="TP_AUTOMOVEL"
              value={automovelData.TP_AUTOMOVEL}
              onChange={handleChange}
              required
            >
              <option value="">Selecione o Tipo de automóvel</option>
              <option value="MOTO">Moto</option>
              <option value="CARRO">Carro</option>
              <option value="CAMINHAO">Caminhão</option>
            </select>
            <label
              className="block font-bold text-left text-lg mb-2 w-full"
              htmlFor="DS_HISTORICO_AUTOMOVEL"
            >
              Histórico do automóvel
            </label>
            <select
              className="p-3 mb-6 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="DS_HISTORICO_AUTOMOVEL"
              value={automovelData.DS_HISTORICO_AUTOMOVEL}
              onChange={handleChange}
            >
              <option value="">Selecione o Histórico do automóvel</option>
              <option value="NOVO">Novo</option>
              <option value="USADO">Usado</option>
            </select>

            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
                {erro}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  )
}

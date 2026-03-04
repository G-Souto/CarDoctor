"use client"

import Input from "@/components/Input/Input"
import { AutomovelUsuario } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CadProduto() {
  const router = useRouter()

  const [automovelData, setAutomovelData] = useState<AutomovelUsuario>({
    ID_AUTOMOVEL: 0,
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
  }

  const postRelacionamentoAutomovel = async (idAutomovel: number) => {
    if (userId) {
      try {
        const response = await fetch(
          "http://localhost:8080/relacionamento_automovel",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ID_AUTOMOVEL: idAutomovel,
              ID_USUARIO: userId,
            }),
          }
        )

        if (!response.ok) {
          throw new Error(
            "Falha ao criar o relacionamento entre automóvel e usuário."
          )
        }
      } catch (error) {
        console.error("Erro ao criar relacionamento: ", error)
      }
    } else {
      console.error("ID_USUARIO não encontrado.")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
      console.log("SUBMIT DISPAROU 🔥")
    try {
      const response = await fetch("http://localhost:8080/veiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(automovelData),
      })

      if (response.ok) {
        const data = await response.json()
        alert("Produto cadastrado com sucesso.")

        // Resetando o estado do formulário
        setAutomovelData({
          ID_AUTOMOVEL: 0,
          NR_QUILOMETRAGEM: 0,
          NR_ANO: 0,
          DS_PLACA: "",
          DS_MODELO: "",
          TP_AUTOMOVEL: "",
          DS_MARCA: "",
          DS_HISTORICO_AUTOMOVEL: "",
          DS_AUTOMOVEL: "",
        })

        // Chamando a função para criar o relacionamento
        postRelacionamentoAutomovel(data.ID_AUTOMOVEL)

        // Navegando para a página de produtos
        router.push("/produtos")
        console.log("Enviando:", automovelData)
      }
    } catch (error) {
      console.error("Falha ao criar o produto: ", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 ">
      <h2 className="flex items-center justify-center text-2xl font-bold text-center mt-6 mb-4">Cadastro de Veículos</h2>

      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col items-center justify-center">
          <div className=" m-5 bg-blue-500 rounded-lg p-5 w-1/2">
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
          </div>
          <button
          
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  )
}

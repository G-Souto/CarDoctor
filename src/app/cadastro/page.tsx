"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/Input/Input"
import {
  Usuario,
  loginusuario,
  enderecousuario,
  usuario_endereco,
  telefoneusuario
} from "@/types"

export default function Cadastro() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [Usuario, setUsuario] = useState<Usuario>({
    ID_USUARIO: 0,
    NR_IDADE: 0,
    NR_CNH: 0,
    DT_NASCIMENTO: "",
    NM_USUARIO: "",
    NR_CPF: "",
  })

  const [loginusuario, setLoginUsuario] = useState<loginusuario>({
    ID_LOGIN: 0,
    DS_SENHA: "",
    ID_USUARIO: 0,
    DS_USUARIO: "",
  })

  const [enderecousuario, setEnderecousuario] = useState<enderecousuario>({
    ID_ENDERECO: 0,
    NR_CEP: "",
    NM_ESTADO: "",
    NM_CIDADE: "",
    NM_BAIRRO: "",
    NM_LOGRADOURO: "",
    TP_ENDERECO: "",
    DS_COMPLEMENTO: "",
    DS_PONTO_REFERENCIA: "",
  })

  const [usuario_endereco, setUsuario_endereco] = useState<usuario_endereco>({
    ID_ENDERECO: 0,
    ID_USUARIO: 0,
  })

  const [confirmarSenha, setConfirmarSenha] = useState("")

  const [telefoneusuario, setTelefoneusuario] = useState<telefoneusuario>({
    ID_TELEFONE: 0,
    ID_USUARIO: 0,
    NR_DDI: 0,
    NR_DDD: 0,
    NR_TELEFONE: "",
    NR_TELEFONE_COMPLETO: "",
    TP_TELEFONE: "",
    ST_TELEFONE: ""
  })

  const fetchUser = async () => {
    try {
      const userResponse = await fetch(
        `http://localhost:8080/usuario/${Usuario.NR_CPF}`
      )
      const userData = await userResponse.json()

      return {
        ID_USUARIO: userData.ID_USUARIO,
      }
    } catch (error) {
      console.error("Erro ao buscar usuário ou endereço:", error)
      return null
    }
  }

  // Função de busca e associação de usuário e endereço
  const fetchUserAndAddress = async () => {
    try {
      const userResponse = await fetch(
        `http://localhost:8080/usuario/${Usuario.NR_CPF}`
      )
      const userData = await userResponse.json()

      const addressResponse = await fetch(
        `http://localhost:8080/endereco/${enderecousuario.NR_CEP}`
      )
      const addressData = await addressResponse.json()

      if (userData && addressData) {
        // Verificação adicional
        return {
          ID_USUARIO: userData.ID_USUARIO,
          ID_ENDERECO: addressData.ID_ENDERECO,
        }
      } else {
        console.error("Erro: usuário ou endereço não encontrados.")
        return null
      }
    } catch (error) {
      console.error("Erro ao buscar usuário ou endereço:", error)
      return null
    }
  }

  const associateUserAndAddress = async () => {
    const identifiers = await fetchUserAndAddress()
    if (!identifiers) return
    const usuario_endereco = ({
      ID_ENDERECO: identifiers.ID_ENDERECO,
      ID_USUARIO: identifiers.ID_USUARIO,
    })
    try {
      const response = await fetch(
        "http://localhost:8080/relacionamento_endereco",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario_endereco),
        }
      )
      if (response.ok) {
        alert("Associação criada com sucesso.")
        setUsuario_endereco({
          ID_ENDERECO: identifiers.ID_ENDERECO,
          ID_USUARIO: identifiers.ID_USUARIO,
        })
      }
    } catch (error) {
      console.error("Erro ao criar a associação:", error)
    }
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (step === 1) {
      setUsuario((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (step === 2) {
      setEnderecousuario((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (step === 3) {
      setTelefoneusuario((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    else if (step === 4) {
      if (name === "confirmaSenha") {
        setConfirmarSenha(value)
      } else {
        setLoginUsuario((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (step === 1) {
      try {
        const response = await fetch("http://localhost:8080/usuario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Usuario),
        })

        if (response.ok) {
          alert("Usuário cadastrado com sucesso.")
          setUsuario({
            ID_USUARIO: 0,
            NR_IDADE: 0,
            NR_CNH: 0,
            DT_NASCIMENTO: "",
            NM_USUARIO: "",
            NR_CPF: "",
          })
          setStep(2)
        }
      } catch (error) {
        console.error("Falha ao criar o usuário:", error)
      }
    } else if (step === 2) {
      try {
        const response = await fetch("http://localhost:8080/endereco", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enderecousuario),
        })

        if (response.ok) {
          alert("Endereço cadastrado com sucesso.")
          await associateUserAndAddress()
          setStep(3)
        }
      } catch (error) {
        console.error("Falha ao criar o endereço:", error)
      }
    } else if (step === 3) {
      const identifiers = await fetchUser()
      if (!identifiers) return
      try {
        const telefone = {
  ...telefoneusuario,
  ID_USUARIO: identifiers.ID_USUARIO,
}
        const response = await fetch("http://localhost:8080/telefone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(telefone),
        })
        if (response.ok) {
          alert("Telefone cadastrado com sucesso.")
          setTelefoneusuario({
            ID_TELEFONE: 0,
            ID_USUARIO: identifiers.ID_USUARIO,
            NR_DDI: 0,
            NR_DDD: 0,
            NR_TELEFONE: "",
            NR_TELEFONE_COMPLETO: "",
            TP_TELEFONE: "",
            ST_TELEFONE: "",
          })
          setStep(4)
        }
      } catch (error) {
        console.error("Falha ao criar o endereço:", error)
      }
    } else if (step === 4 && validarSenha()) {
      const identifiers = await fetchUser()
      if (!identifiers) return
      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginusuario),
        })

        if (response.ok) {
          alert("Login cadastrado com sucesso.")
          setLoginUsuario({
            ID_LOGIN: 0,
            DS_SENHA: "",
            ID_USUARIO: identifiers.ID_USUARIO,
            DS_USUARIO: "",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Falha ao criar o login:", error)
      }
    }
  }


  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const validarSenha = () => {
    if (loginusuario.DS_SENHA !== confirmarSenha) {
      alert("As senhas não coincidem.")
      return false
    }
    return true
  }
  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Área da imagem de fundo */}
      <div className="hidden lg:block lg:w-2/3 bg-[url('/wallpaper_carro_paisagem.jpg')] bg-cover bg-left h-100%"></div>

      {/* Área de login */}
      <div className="lg:w-1/3 w-full flex flex-col justify-between p-8 bg-white h-full">
        {/* Título CarDoctor posicionado no topo */}
        <div className="flex justify-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-600">
            CarDoctor
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* Primeira Etapa */}
          {step === 1 && (
            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="flex justify-between">
                <div className="w-10 h-10 rounded-full bg-blue-500 border-4 border-blue-800 flex justify-center text-white font-bold">
                  1
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              </div>
              <Input
                label="Nome Completo"
                name="NM_USUARIO"
                type="text"
                value={Usuario.NM_USUARIO}
                onChange={handleChange}
                placeholder="Insira seu nome completo"
              />
              <Input
                label="Data de Nascimento"
                name="DT_NASCIMENTO"
                type="date"
                value={Usuario.DT_NASCIMENTO}
                onChange={handleChange}
                placeholder=""
              />
              <Input
                label="CNH - Habilitacao"
                name="NR_CNH"
                type="number"
                value={Usuario.NR_CNH}
                onChange={handleChange}
                placeholder="Insira sua CNH"
              />
              <Input
                label="CPF"
                name="NR_CPF"
                type="text"
                value={Usuario.NR_CPF}
                onChange={handleChange}
                placeholder="123.456.789-09"
              />
              <button
                className="btnCad w-full py-3 bg-blue-600 text-white font-bold rounded-lg transition hover:bg-white hover:text-blue-600 border border-blue-600"
                type="submit"
              >
                PRÓXIMO
              </button>
            </div>
          )}

          {/* Segunda Etapa */}
          {step === 2 && (
            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="flex justify-between">
                <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                <div className="w-10 h-10 rounded-full bg-blue-500 border-4 border-blue-800 flex justify-center text-white font-bold">
                  2
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              </div>
              <label
                className="block font-bold text-left text-lg mb-2 w-full"
                htmlFor="NM_ESTADO"
              >
                Estado
              </label>
              <select
                className="p-3 mb-6 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="NM_ESTADO"
                value={enderecousuario.NM_ESTADO}
                onChange={handleChange}
              >
                <option value="">Selecione o Estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
              <Input
                label="CEP"
                name="NR_CEP"
                type="text"
                value={enderecousuario.NR_CEP}
                onChange={handleChange}
                placeholder="00000-000"
              />
              <Input
                label="Bairro"
                name="NM_BAIRRO"
                type="text"
                value={enderecousuario.NM_BAIRRO}
                onChange={handleChange}
                placeholder="Insira seu bairro"
              />
              <Input
                label="Cidade"
                name="NM_CIDADE"
                type="text"
                value={enderecousuario.NM_CIDADE}
                onChange={handleChange}
                placeholder="Insira sua cidade"
              />
              <div className="flex w-full justify-center space-x-[70px]">
                <button
                  className="btnCad w-full bg-blue-600 text-white font-bold py-3 rounded-lg transition-all hover:bg-white hover:text-blue-500 hover:border border-blue-500 hover:border-solid"
                  type="button"
                  onClick={handleBack}
                >
                  VOLTAR
                </button>
                <button
                  className="btnCad w-full bg-blue-600 text-white font-bold py-3 rounded-lg transition-all hover:bg-white hover:text-blue-500 hover:border border-blue-500 hover:border-solid"
                  type="submit"
                >
                  PRÓXIMO
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="flex justify-between">
                <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                <div className="w-10 h-10 rounded-full bg-blue-500 border-4 border-blue-800 flex justify-center text-white font-bold">
                  3
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              </div>
              <Input
                label="DDD"
                name="NR_DDD"
                type="number"
                value={telefoneusuario.NR_DDD}
                onChange={handleChange}
                placeholder="Insira seu DDD"
              />
              <Input
                label="DDI"
                name="NR_DDI"
                type="number"
                value={telefoneusuario.NR_DDI}
                onChange={handleChange}
                placeholder="Insira seu DDI"
              />
              <Input
                label="Número"
                name="NR_TELEFONE"
                type="text"
                value={telefoneusuario.NR_TELEFONE}
                onChange={handleChange}
                placeholder="00000-0000"
              />
              <div className="flex w-full justify-center space-x-[70px] ">
                <button
                  className="btnCad w-full bg-blue-600 text-white font-bold py-3 rounded-lg transition-all hover:bg-white hover:text-blue-500 hover:border border-blue-500 hover:border-solid"
                  type="button"
                  onClick={handleBack}
                >
                  VOLTAR
                </button>
                <button
                  className="btnCad w-full bg-blue-600 text-white font-bold py-3 rounded-lg transition-all hover:bg-white hover:text-blue-500 hover:border border-blue-500 hover:border-solid"
                  type="submit"
                >
                  PRÓXIMO
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="flex justify-between">
                <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                <div className="w-10 h-10 rounded-full bg-blue-500 border-4 border-blue-800 flex justify-center text-white font-bold">
                  4
                </div>
              </div>
              <Input
                label="Senha"
                name="DS_SENHA"
                type="password"
                value={loginusuario.DS_SENHA}
                onChange={handleChange}
                placeholder="Insira uma senha"
              />

              <Input
                label="Confirmar Senha"
                name="confirmaSenha"
                type="password"
                value={confirmarSenha}
                onChange={handleChange}
                placeholder="Confirme a sua senha"
              />

              <Input
                label="Nome de Usuario"
                name="DS_USUARIO"
                type="text"
                value={loginusuario.DS_USUARIO}
                onChange={handleChange}
                placeholder="Insira um nome de usuario"
              />
              <div className="flex w-full justify-center space-x-[70px] ">
                <button
                  className="btnCad w-full bg-blue-600 text-white font-bold py-3 rounded-lg transition-all hover:bg-white hover:text-blue-500 hover:border border-blue-500 hover:border-solid"
                  type="button"
                  onClick={handleBack}
                >
                  VOLTAR
                </button>
                <button
                  className="btnCad w-full bg-blue-600 text-white font-bold py-3 rounded-lg transition-all hover:bg-white hover:text-blue-500 hover:border border-blue-500 hover:border-solid"
                  type="submit"
                >
                  FINALIZAR CADASTRO
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}

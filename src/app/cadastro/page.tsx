"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/Input/Input"

type DadosPessoais = {
  NM_USUARIO: string
  DT_NASCIMENTO: string
  NR_CNH: string
  NR_CPF: string
}

type DadosEndereco = {
  NM_ESTADO: string
  NR_CEP: string
  NM_BAIRRO: string
  NM_CIDADE: string
  NM_LOGRADOURO: string
}

type DadosTelefone = {
  NR_DDI: string
  NR_DDD: string
  NR_TELEFONE: string
}

type DadosLogin = {
  DS_USUARIO: string
  DS_SENHA: string
  confirmarSenha: string
}

export default function Cadastro() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoais>({
    NM_USUARIO: "", DT_NASCIMENTO: "", NR_CNH: "", NR_CPF: "",
  })
  const [dadosEndereco, setDadosEndereco] = useState<DadosEndereco>({
    NM_ESTADO: "", NR_CEP: "", NM_BAIRRO: "", NM_CIDADE: "", NM_LOGRADOURO: "",
  })
  const [dadosTelefone, setDadosTelefone] = useState<DadosTelefone>({
    NR_DDI: "55", NR_DDD: "", NR_TELEFONE: "",
  })
  const [dadosLogin, setDadosLogin] = useState<DadosLogin>({
    DS_USUARIO: "", DS_SENHA: "", confirmarSenha: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setErro("")
    if (step === 1) setDadosPessoais((p) => ({ ...p, [name]: value }))
    else if (step === 2) setDadosEndereco((p) => ({ ...p, [name]: value }))
    else if (step === 3) setDadosTelefone((p) => ({ ...p, [name]: value }))
    else if (step === 4) setDadosLogin((p) => ({ ...p, [name]: value }))
  }

  const validarEtapa = (): boolean => {
    if (step === 1) {
      if (!dadosPessoais.NM_USUARIO.trim()) { setErro("Informe seu nome."); return false }
      if (!dadosPessoais.NR_CPF.trim()) { setErro("Informe seu CPF."); return false }
      if (!dadosPessoais.DT_NASCIMENTO) { setErro("Informe sua data de nascimento."); return false }
    }
    if (step === 2) {
      if (!dadosEndereco.NM_ESTADO) { setErro("Selecione seu estado."); return false }
      if (!dadosEndereco.NR_CEP.trim()) { setErro("Informe seu CEP."); return false }
      if (!dadosEndereco.NM_CIDADE.trim()) { setErro("Informe sua cidade."); return false }
    }
    if (step === 3) {
      if (!dadosTelefone.NR_DDD.trim()) { setErro("Informe seu DDD."); return false }
      if (!dadosTelefone.NR_TELEFONE.trim()) { setErro("Informe seu número."); return false }
    }
    if (step === 4) {
      if (!dadosLogin.DS_USUARIO.trim()) { setErro("Escolha um nome de usuário."); return false }
      if (!dadosLogin.DS_SENHA) { setErro("Escolha uma senha."); return false }
      if (dadosLogin.DS_SENHA.length < 6) { setErro("A senha deve ter ao menos 6 caracteres."); return false }
      if (dadosLogin.DS_SENHA !== dadosLogin.confirmarSenha) { setErro("As senhas não coincidem."); return false }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro("")

    if (!validarEtapa()) return

    // Etapas 1-3: só avança, sem chamar API
    if (step < 4) {
      setStep((s) => s + 1)
      return
    }

    // Etapa 4: envia tudo para a API interna de uma vez
    setCarregando(true)
    try {
      const payload = {
        NM_USUARIO: dadosPessoais.NM_USUARIO,
        NR_CPF: dadosPessoais.NR_CPF,
        NR_CNH: Number(dadosPessoais.NR_CNH) || 0,
        DT_NASCIMENTO: dadosPessoais.DT_NASCIMENTO,
        NR_IDADE: 0,
        NM_ESTADO: dadosEndereco.NM_ESTADO,
        NR_CEP: dadosEndereco.NR_CEP,
        NM_BAIRRO: dadosEndereco.NM_BAIRRO,
        NM_CIDADE: dadosEndereco.NM_CIDADE,
        NM_LOGRADOURO: dadosEndereco.NM_LOGRADOURO,
        NR_DDI: Number(dadosTelefone.NR_DDI) || 55,
        NR_DDD: Number(dadosTelefone.NR_DDD) || 0,
        NR_TELEFONE: dadosTelefone.NR_TELEFONE,
        DS_USUARIO: dadosLogin.DS_USUARIO,
        DS_SENHA: dadosLogin.DS_SENHA,
      }

      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setErro(data.erro || "Erro ao cadastrar. Tente novamente.")
        return
      }

      // Loga automaticamente após o cadastro
      localStorage.setItem("ID_USUARIO", data.ID_USUARIO.toString())
      localStorage.setItem("NM_USUARIO", data.NM_USUARIO)
      localStorage.setItem("DS_USUARIO", data.DS_USUARIO)
      localStorage.setItem("authToken", "logged")

      alert("Cadastro realizado com sucesso!")
      router.push("/")
    } catch (error) {
      setErro("Erro de conexão. Tente novamente.")
      console.error(error)
    } finally {
      setCarregando(false)
    }
  }

  const btnBase =
    "w-full bg-blue-600 text-white font-bold py-3 rounded-lg transition-all hover:bg-white hover:text-blue-600 border border-blue-600 disabled:opacity-50"

  const StepCircle = ({ n }: { n: number }) => (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
      ${step === n ? "bg-blue-600 border-4 border-blue-900 text-white"
        : step > n ? "bg-blue-500 text-white"
        : "bg-gray-300 text-gray-500"}`}>
      {step > n ? "✓" : n}
    </div>
  )

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen">
      <div className="hidden lg:block lg:w-2/3 bg-[url('/wallpaper_carro_paisagem.jpg')] bg-cover bg-left" />

      <div className="lg:w-1/3 w-full flex flex-col p-8 bg-white min-h-screen">
        <div className="flex justify-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-blue-600">CarDoctor</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1">

          {/* Indicador de etapas */}
          <div className="flex justify-between">
            <StepCircle n={1} /><StepCircle n={2} /><StepCircle n={3} /><StepCircle n={4} />
          </div>

          {/* ETAPA 1 — Dados pessoais */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Dados pessoais</h2>
              <Input label="Nome Completo" name="NM_USUARIO" type="text"
                value={dadosPessoais.NM_USUARIO} onChange={handleChange}
                placeholder="Seu nome completo" />
              <Input label="CPF" name="NR_CPF" type="text"
                value={dadosPessoais.NR_CPF} onChange={handleChange}
                placeholder="123.456.789-00" />
              <Input label="Data de Nascimento" name="DT_NASCIMENTO" type="date"
                value={dadosPessoais.DT_NASCIMENTO} onChange={handleChange}
                placeholder="" />
              <Input label="CNH (opcional)" name="NR_CNH" type="text"
                value={dadosPessoais.NR_CNH} onChange={handleChange}
                placeholder="Número da habilitação" />
            </div>
          )}

          {/* ETAPA 2 — Endereço */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Endereço</h2>
              <div>
                <label className="block font-bold text-left text-lg mb-2 w-full">Estado</label>
                <select name="NM_ESTADO" value={dadosEndereco.NM_ESTADO} onChange={handleChange}
                  className="p-3 mb-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Selecione o Estado</option>
                  {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <Input label="CEP" name="NR_CEP" type="text"
                value={dadosEndereco.NR_CEP} onChange={handleChange}
                placeholder="00000-000" />
              <Input label="Cidade" name="NM_CIDADE" type="text"
                value={dadosEndereco.NM_CIDADE} onChange={handleChange}
                placeholder="Sua cidade" />
              <Input label="Bairro" name="NM_BAIRRO" type="text"
                value={dadosEndereco.NM_BAIRRO} onChange={handleChange}
                placeholder="Seu bairro" />
              <Input label="Logradouro (opcional)" name="NM_LOGRADOURO" type="text"
                value={dadosEndereco.NM_LOGRADOURO} onChange={handleChange}
                placeholder="Rua, número..." />
            </div>
          )}

          {/* ETAPA 3 — Telefone */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Telefone</h2>
              <Input label="DDI" name="NR_DDI" type="text"
                value={dadosTelefone.NR_DDI} onChange={handleChange}
                placeholder="55" />
              <Input label="DDD" name="NR_DDD" type="text"
                value={dadosTelefone.NR_DDD} onChange={handleChange}
                placeholder="11" />
              <Input label="Número" name="NR_TELEFONE" type="text"
                value={dadosTelefone.NR_TELEFONE} onChange={handleChange}
                placeholder="99999-9999" />
            </div>
          )}

          {/* ETAPA 4 — Login */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Criar login</h2>
              <Input label="Nome de usuário" name="DS_USUARIO" type="text"
                value={dadosLogin.DS_USUARIO} onChange={handleChange}
                placeholder="Escolha um nome de usuário" />
              <Input label="Senha" name="DS_SENHA" type="password"
                value={dadosLogin.DS_SENHA} onChange={handleChange}
                placeholder="Mínimo 6 caracteres" />
              <Input label="Confirmar senha" name="confirmarSenha" type="password"
                value={dadosLogin.confirmarSenha} onChange={handleChange}
                placeholder="Repita a senha" />
            </div>
          )}

          {/* Erro */}
          {erro && (
            <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg py-2 px-3">{erro}</p>
          )}

          {/* Botões */}
          <div className="flex gap-4">
            {step > 1 && (
              <button type="button" className={btnBase}
                onClick={() => { setErro(""); setStep((s) => s - 1) }}>
                VOLTAR
              </button>
            )}
            <button type="submit" disabled={carregando} className={btnBase}>
              {step === 4 ? (carregando ? "Cadastrando..." : "FINALIZAR CADASTRO") : "PRÓXIMO"}
            </button>
          </div>

        </form>
      </div>
    </main>
  )
}

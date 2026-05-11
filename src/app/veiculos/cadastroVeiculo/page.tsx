"use client"

import Header from "@/components/Header/Header"
import { AutomovelUsuario } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const TIPO_ICONS: Record<string, string> = {
  CARRO: "🚗",
  MOTO: "🏍️",
  CAMINHAO: "🚛",
}

export default function CadastroVeiculo() {
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
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    const storedUserId = localStorage.getItem("ID_USUARIO")
    if (storedUserId) setUserId(parseInt(storedUserId))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAutomovelData((prev) => ({ ...prev, [name]: value }))
    setErro(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro(null)

    if (!automovelData.TP_AUTOMOVEL) {
      setErro("Selecione o tipo do veículo.")
      return
    }

    setCarregando(true)

    try {
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

      if (userId) {
        try {
          await fetch("/api/relacionamento_automovel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ID_AUTOMOVEL: data.ID_AUTOMOVEL, ID_USUARIO: userId }),
          })
        } catch {
          console.warn("Relacionamento não criado.")
        }
      }

      setSucesso(true)
      setTimeout(() => router.push("/veiculos"), 1800)
    } catch (error) {
      setErro("Erro de conexão. Tente novamente.")
      console.error(error)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0d14] text-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap');
        .cad-root { font-family: 'Barlow', sans-serif; }
        .heading-font { font-family: 'Barlow Condensed', sans-serif; }
        .card-glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
        }
        .accent-line { background: linear-gradient(90deg, #2563eb, #60a5fa, transparent); }
        .glow { box-shadow: 0 0 40px rgba(37,99,235,0.12); }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:none } }
        .tag { font-size:10px; letter-spacing:0.12em; text-transform:uppercase; font-weight:600; }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          color: #fff;
          font-size: 14px;
          font-family: 'Barlow', sans-serif;
          transition: border-color 0.2s, background 0.2s;
          outline: none;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus { border-color: #2563eb; background: rgba(37,99,235,0.08); }
        .field-input option { background: #0f1522; color: #fff; }
        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 6px;
        }

        .tipo-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 10px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Barlow', sans-serif;
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .tipo-btn:hover { border-color: rgba(37,99,235,0.5); background: rgba(37,99,235,0.08); color: rgba(255,255,255,0.7); }
        .tipo-btn.selected { border-color: #2563eb; background: rgba(37,99,235,0.15); color: #60a5fa; box-shadow: 0 0 16px rgba(37,99,235,0.2); }
        .tipo-btn .icon { font-size: 26px; line-height: 1; }

        .hist-btn {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Barlow', sans-serif;
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-align: center;
        }
        .hist-btn:hover { border-color: rgba(37,99,235,0.4); background: rgba(37,99,235,0.06); color: rgba(255,255,255,0.6); }
        .hist-btn.selected { border-color: #10b981; background: rgba(16,185,129,0.12); color: #34d399; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: #2563eb;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
        }
        .submit-btn:hover:not(:disabled) { background: #1d4ed8; box-shadow: 0 0 24px rgba(37,99,235,0.4); }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .sucesso-anim { animation: fadeIn 0.4s ease forwards; }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .check-icon { animation: checkPop 0.5s ease 0.15s both; }
      `}</style>

      <div className="cad-root">
        <Header />

        {/* Hero banner */}
        <div className="relative w-full h-52 overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url('/wallpaper_carro_paisagem.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, #0a0d14)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a0d14 0%, transparent 40%, transparent 60%, #0a0d14 100%)" }} />
        </div>

        <div className="max-w-2xl mx-auto px-4 -mt-28 pb-16 relative z-10">
          <div className="card-glass glow rounded-2xl overflow-hidden fade-in">
            <div className="h-1 accent-line w-full" />

            <div className="p-6 sm:p-8">
              <p className="tag text-blue-400 flex items-center gap-2 mb-3">
                <span className="w-4 h-4 rounded bg-blue-600/30 flex items-center justify-center text-[9px]">▶</span>
                Novo veículo
              </p>
              <h1 className="heading-font text-3xl sm:text-4xl font-bold tracking-wide text-white leading-none mb-1">
                Cadastro de Veículo
              </h1>
              <p className="text-white/35 text-sm mb-6">Preencha os dados do seu veículo para continuar.</p>

              <div className="h-px bg-white/5 mb-6" />

              {sucesso ? (
                <div className="sucesso-anim flex flex-col items-center justify-center py-14 gap-4 text-center">
                  <div className="check-icon w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="heading-font text-2xl font-bold text-white">Veículo cadastrado!</p>
                    <p className="text-white/40 text-sm mt-1">Redirecionando para seus veículos...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Tipo */}
                  <div>
                    <span className="field-label">Tipo de veículo</span>
                    <div className="flex gap-3">
                      {["CARRO", "MOTO", "CAMINHAO"].map((tipo) => (
                        <button key={tipo} type="button"
                          onClick={() => { setAutomovelData((p) => ({ ...p, TP_AUTOMOVEL: tipo })); setErro(null) }}
                          className={`tipo-btn ${automovelData.TP_AUTOMOVEL === tipo ? "selected" : ""}`}>
                          <span className="icon">{TIPO_ICONS[tipo]}</span>
                          <span>{tipo === "CAMINHAO" ? "Caminhão" : tipo.charAt(0) + tipo.slice(1).toLowerCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Marca / Modelo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">Marca</label>
                      <input className="field-input" name="DS_MARCA" type="text"
                        value={automovelData.DS_MARCA} onChange={handleChange}
                        placeholder="Ex: Toyota" required />
                    </div>
                    <div>
                      <label className="field-label">Modelo</label>
                      <input className="field-input" name="DS_MODELO" type="text"
                        value={automovelData.DS_MODELO} onChange={handleChange}
                        placeholder="Ex: Corolla" required />
                    </div>
                  </div>

                  {/* Ano / Placa */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">Ano</label>
                      <input className="field-input" name="NR_ANO" type="number"
                        value={automovelData.NR_ANO || ""} onChange={handleChange}
                        placeholder={String(new Date().getFullYear())}
                        min="1900" max={new Date().getFullYear() + 1} required />
                    </div>
                    <div>
                      <label className="field-label">Placa</label>
                      <input className="field-input" style={{ textTransform: "uppercase" }}
                        name="DS_PLACA" type="text"
                        value={automovelData.DS_PLACA} onChange={handleChange}
                        placeholder="ABC1D23" maxLength={8} required />
                    </div>
                  </div>

                  {/* Quilometragem */}
                  <div>
                    <label className="field-label">Quilometragem (km)</label>
                    <input className="field-input" name="NR_QUILOMETRAGEM" type="number"
                      value={automovelData.NR_QUILOMETRAGEM || ""} onChange={handleChange}
                      placeholder="Ex: 45000" min="0" />
                  </div>

                  {/* Histórico */}
                  <div>
                    <span className="field-label">Histórico</span>
                    <div className="flex gap-3">
                      {[{ value: "NOVO", label: "✦ Novo" }, { value: "USADO", label: "◈ Usado" }].map((h) => (
                        <button key={h.value} type="button"
                          onClick={() => { setAutomovelData((p) => ({ ...p, DS_HISTORICO_AUTOMOVEL: h.value })); setErro(null) }}
                          className={`hist-btn ${automovelData.DS_HISTORICO_AUTOMOVEL === h.value ? "selected" : ""}`}>
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="field-label">Descrição <span style={{ opacity: 0.4, fontSize: "9px" }}>(opcional)</span></label>
                    <input className="field-input" name="DS_AUTOMOVEL" type="text"
                      value={automovelData.DS_AUTOMOVEL} onChange={handleChange}
                      placeholder="Ex: Revisado em 2024, uso diário" />
                  </div>

                  {/* Erro */}
                  {erro && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      {erro}
                    </div>
                  )}

                  <div className="pt-1">
                    <button type="submit" disabled={carregando} className="submit-btn">
                      {carregando ? "Cadastrando..." : "Cadastrar Veículo →"}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

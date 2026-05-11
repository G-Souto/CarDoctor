"use client"
import Header from "@/components/Header/Header"
import { Usuario, telefoneusuario, enderecousuario, usuario_endereco, loginusuario } from "@/types"
import { useEffect, useRef, useState } from "react"

export default function UserProfile() {
  const [userId, setUserId] = useState<number | null>(null)
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [telefones, setTelefones] = useState<telefoneusuario[]>([])
  const [endereco, setEndereco] = useState<enderecousuario | null>(null)
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedId = localStorage.getItem("ID_USUARIO")
    if (storedId) setUserId(parseInt(storedId))
    const savedPhoto = localStorage.getItem("FOTO_PERFIL")
    if (savedPhoto) setFotoPerfil(savedPhoto)
  }, [])

  useEffect(() => {
    if (!userId) { setIsLoading(false); return }

    const carregar = async () => {
      setIsLoading(true)
      setErro(null)
      try {
        // 1. Busca o login para pegar o CPF (DS_USUARIO) associado ao ID_USUARIO
        const loginRes = await fetch("http://localhost:3000/login")
        const logins: loginusuario[] = await loginRes.json()
        const loginDoUsuario = logins.find((l) => l.ID_USUARIO === userId)
        if (!loginDoUsuario) throw new Error("Login não encontrado")

        // 2. Busca dados do usuário pelo CPF
        const usuRes = await fetch(`http://localhost:3000/usuario/${loginDoUsuario.DS_USUARIO}`)
        const usuData: Usuario = await usuRes.json()
        setUsuario(usuData)

        // 3. Busca relacionamento endereço e filtra pelo userId
        const relRes = await fetch("http://localhost:3000/relacionamento_endereco")
        const relData: usuario_endereco[] = await relRes.json()
        const relDoUsuario = relData.find((r) => r.ID_USUARIO === userId)

        // 4. Busca o endereço pelo CEP (se houver relacionamento)
        if (relDoUsuario) {
          // Busca todos endereços e filtra pelo ID_ENDERECO
          const endRes = await fetch(`http://localhost:3000/endereco`)
          const endData: enderecousuario[] = await endRes.json()
          const endDoUsuario = endData.find((e) => e.ID_ENDERECO === relDoUsuario.ID_ENDERECO)
          if (endDoUsuario) setEndereco(endDoUsuario)
        }

        // 5. Busca todos telefones e filtra pelo userId
        const telRes = await fetch("http://localhost:3000/telefone")
        const telData: telefoneusuario[] = await telRes.json()
        setTelefones(telData.filter((t) => t.ID_USUARIO === userId))

      } catch (err) {
        console.error("Erro ao carregar perfil:", err)
        setErro("Não foi possível carregar os dados. Verifique a conexão com o servidor.")
      } finally {
        setIsLoading(false)
      }
    }

    carregar()
  }, [userId])

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setFotoPerfil(base64)
      localStorage.setItem("FOTO_PERFIL", base64)
    }
    reader.readAsDataURL(file)
  }

  return (
    <main className="min-h-screen bg-[#0a0d14] text-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap');
        .perfil-root { font-family: 'Barlow', sans-serif; }
        .heading-font { font-family: 'Barlow Condensed', sans-serif; }
        .card-glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
        }
        .accent-line {
          background: linear-gradient(90deg, #2563eb, #60a5fa, transparent);
        }
        .avatar-ring {
          background: conic-gradient(from 0deg, #2563eb, #60a5fa, #1d4ed8, #2563eb);
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
        .tag {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
      `}</style>

      <div className="perfil-root">
        <Header />

        {/* Hero banner */}
        <div className="relative w-full h-52 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "url('/estrada.png')", backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, #0a0d14)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a0d14 0%, transparent 40%, transparent 60%, #0a0d14 100%)" }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-28 pb-16 relative z-10">

          {/* Cartão principal */}
          <div className="card-glass rounded-2xl overflow-hidden fade-in">

            {/* Topo azul decorativo */}
            <div className="h-1 accent-line w-full" />

            <div className="p-6 sm:p-8">
              {/* Cabeçalho com avatar */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="avatar-ring p-[2px] rounded-full">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#0f1522] flex items-center justify-center">
                      {fotoPerfil ? (
                        <img src={fotoPerfil} alt="Foto" className="w-full h-full object-cover" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-500 opacity-60" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Alterar foto"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center border-2 border-[#0a0d14] transition-colors duration-200 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                    </svg>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                </div>

                {/* Nome e badge */}
                <div className="flex-1 text-center sm:text-left pt-1">
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="skeleton h-8 w-48 rounded-lg mx-auto sm:mx-0" />
                      <div className="skeleton h-4 w-24 rounded mx-auto sm:mx-0" />
                    </div>
                  ) : usuario ? (
                    <>
                      <h1 className="heading-font text-3xl sm:text-4xl font-bold tracking-wide text-white leading-none">
                        {usuario.NM_USUARIO}
                      </h1>
                      <p className="text-blue-400 text-sm mt-1 font-medium">{usuario.NR_IDADE} anos</p>
                    </>
                  ) : (
                    <p className="text-white/40 italic">Usuário não encontrado</p>
                  )}

                  <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="tag px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      ✦ Membro CarDoctor
                    </span>
                    {usuario && (
                      <span className="tag px-3 py-1 rounded-full bg-white/5 text-white/40 border border-white/10">
                        ID #{userId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div className="h-px bg-white/5 mx-6 sm:mx-8" />

            {/* Seções de dados */}
            <div className="p-6 sm:p-8 space-y-4">

              {erro && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400 text-sm flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {erro}
                </div>
              )}

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`rounded-xl border border-white/6 p-5 space-y-3 ${i === 2 ? 'md:col-span-2' : ''}`}>
                      <div className="skeleton h-3 w-20 rounded" />
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-3/4 rounded" />
                      <div className="skeleton h-4 w-1/2 rounded" />
                    </div>
                  ))}
                </div>
              ) : usuario ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Dados Pessoais */}
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="tag text-blue-400 mb-4 flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-blue-600/30 flex items-center justify-center text-[9px]">▶</span>
                      Dados Pessoais
                    </p>
                    <div className="space-y-3">
                      <Campo label="Nome completo" valor={usuario.NM_USUARIO} />
                      <Campo label="Data de nascimento" valor={usuario.DT_NASCIMENTO} />
                      <Campo label="CPF" valor={formatCPF(String(usuario.NR_CPF))} />
                      <Campo label="CNH" valor={String(usuario.NR_CNH)} />
                    </div>
                  </div>

                  {/* Telefones */}
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                    <p className="tag text-emerald-400 mb-4 flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-emerald-600/30 flex items-center justify-center text-[9px]">▶</span>
                      Contato
                    </p>
                    {telefones.length > 0 ? (
                      <div className="space-y-4">
                        {telefones.map((t) => (
                          <div key={t.ID_TELEFONE}>
                            <Campo label={t.TP_TELEFONE} valor={`+${t.NR_DDI} (${t.NR_DDD}) ${t.NR_TELEFONE}`} />
                            <span className={`tag mt-1 inline-block px-2 py-0.5 rounded-full ${t.ST_TELEFONE === 'A' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                              {t.ST_TELEFONE === 'A' ? '● Ativo' : t.ST_TELEFONE}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/25 text-sm italic">Nenhum telefone cadastrado</p>
                    )}
                  </div>

                  {/* Endereço */}
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5 md:col-span-2">
                    <p className="tag text-orange-400 mb-4 flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-orange-600/30 flex items-center justify-center text-[9px]">▶</span>
                      Endereço
                      {endereco && (
                        <span className="tag ml-auto px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          {endereco.TP_ENDERECO}
                        </span>
                      )}
                    </p>
                    {endereco ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Campo label="Logradouro" valor={endereco.NM_LOGRADOURO} />
                        <Campo label="Bairro" valor={endereco.NM_BAIRRO} />
                        <Campo label="CEP" valor={formatCEP(endereco.NR_CEP)} />
                        <Campo label="Cidade" valor={endereco.NM_CIDADE} />
                        <Campo label="Estado" valor={endereco.NM_ESTADO} />
                        {endereco.DS_COMPLEMENTO && <Campo label="Complemento" valor={endereco.DS_COMPLEMENTO} />}
                        {endereco.DS_PONTO_REFERENCIA && <Campo label="Ponto de referência" valor={endereco.DS_PONTO_REFERENCIA} />}
                      </div>
                    ) : (
                      <p className="text-white/25 text-sm italic">Nenhum endereço cadastrado</p>
                    )}
                  </div>

                </div>
              ) : !erro && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  </div>
                  <p className="text-white/30 font-medium">Dados não encontrados</p>
                  <p className="text-white/15 text-sm mt-1">Faça login para ver seu perfil</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <span className="block text-[10px] font-semibold tracking-widest uppercase text-white/30 mb-0.5">{label}</span>
      <span className="text-sm text-white/80 font-medium">{valor || "—"}</span>
    </div>
  )
}

function formatCPF(cpf: string): string {
  const d = cpf.replace(/\D/g, "")
  if (d.length !== 11) return cpf
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

function formatCEP(cep: string): string {
  const d = cep.replace(/\D/g, "")
  if (d.length !== 8) return cep
  return d.replace(/(\d{5})(\d{3})/, "$1-$2")
}

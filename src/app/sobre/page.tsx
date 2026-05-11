import Header from "@/components/Header/Header"

const membros = [
  { nome: "Gustavo Souto", rm: "RM558595", foto: "shrek 3.png" },
  { nome: "Michele Souza", rm: "RM558596", foto: "shrek 2.png" },
  { nome: "Luiza Danielle", rm: "RM558597", foto: "shrek 4.png" },
]

export default function Sobre() {
  return (
    <main className="min-h-screen bg-[#0a0d14] text-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap');
        .sobre-root { font-family: 'Barlow', sans-serif; }
        .heading-font { font-family: 'Barlow Condensed', sans-serif; }
        .card-glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
        }
        .accent-line {
          background: linear-gradient(90deg, #2563eb, #60a5fa, transparent);
        }
        .member-ring {
          background: conic-gradient(from 0deg, #2563eb, #60a5fa, #1d4ed8, #2563eb);
        }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
        .tag {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .glow {
          box-shadow: 0 0 40px rgba(37, 99, 235, 0.15);
        }
      `}</style>

      <div className="sobre-root">
        <Header />

        {/* Hero banner — mesmo padrão do perfil */}
        <div className="relative w-full h-52 overflow-hidden">
          
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, #0a0d14)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a0d14 0%, transparent 40%, transparent 60%, #0a0d14 100%)" }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-28 pb-16 relative z-10 space-y-4 fade-in">

          {/* Card sobre o projeto */}
          <div className="card-glass glow rounded-2xl overflow-hidden">
            <div className="h-1 accent-line w-full" />
            <div className="p-6 sm:p-8">

              <p className="tag text-blue-400 flex items-center gap-2 mb-4">
                <span className="w-4 h-4 rounded bg-blue-600/30 flex items-center justify-center text-[9px]">▶</span>
                Sobre o projeto
              </p>

              <h1 className="heading-font text-4xl sm:text-5xl font-bold tracking-wide text-white leading-none mb-4">
                CarDoctor
              </h1>

              <p className="text-white/60 text-base leading-relaxed max-w-2xl">
                CarDoctor é uma plataforma digital que oferece a opção de realizar
                um autodiagnóstico do seu veículo sem a necessidade de ir até uma
                oficina mecânica, visando a praticidade e podendo ser acessado de
                qualquer lugar do Brasil.
              </p>


              <div className="mt-6 flex flex-wrap gap-3">
                <span className="tag px-3 py-1.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  ✦ Autodiagnóstico
                </span>
                <span className="tag px-3 py-1.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                  100% Digital
                </span>
                <span className="tag px-3 py-1.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                  Todo o Brasil
                </span>
              </div>
            </div>
          </div>

          {/* Card da equipe */}
          <div className="card-glass rounded-2xl overflow-hidden">
            <div className="h-1 accent-line w-full" />
            <div className="p-6 sm:p-8">

              <p className="tag text-emerald-400 flex items-center gap-2 mb-6">
                <span className="w-4 h-4 rounded bg-emerald-600/30 flex items-center justify-center text-[9px]">▶</span>
                Equipe
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {membros.map((m) => (
                  <div
                    key={m.rm}
                    className="flex flex-col items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-5"
                  >
                    <div className="member-ring p-[2px] rounded-full">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-[#0f1522]">
                        <img
                          src={m.foto}
                          alt={`Foto de ${m.nome}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-white font-semibold text-sm">{m.nome}</p>
                      <div className="flex items-center justify-center gap-1.5 mt-1">
                        <img src="git_icon.png" alt="GitHub" className="w-4 h-4 opacity-50" />
                        <span className="tag text-white/35">{m.rm}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

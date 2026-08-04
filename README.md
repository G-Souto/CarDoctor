# 🚗 CarDoctor

<p align="center">
  <strong>Seu veículo em boas mãos.</strong>
</p>

<p align="center">
  Plataforma web desenvolvida para auxiliar motoristas na identificação de possíveis problemas em seus veículos, oferecendo informações e recursos para facilitar o acompanhamento e a manutenção automotiva.
</p>

---

## 📋 Sobre o projeto

O **CarDoctor** é uma plataforma digital voltada para o setor automotivo, criada com o objetivo de tornar o acompanhamento e o diagnóstico de veículos mais simples e acessível.

A aplicação permite que o usuário tenha acesso a informações relacionadas ao seu veículo e utilize recursos de **autodiagnóstico**, reduzindo a necessidade de procurar uma oficina mecânica para identificar problemas básicos.

A proposta é oferecer uma experiência simples e intuitiva, permitindo que o usuário acompanhe seu veículo de forma prática e tenha acesso às informações necessárias para tomar melhores decisões sobre manutenção.

---

## ✨ Funcionalidades

* 🔐 Sistema de autenticação
* 👤 Cadastro e gerenciamento de usuários
* 🚘 Cadastro e gerenciamento de veículos
* 🔎 Autodiagnóstico do veículo
* 🛠️ Informações relacionadas à manutenção automotiva
* 📋 Visualização de informações dos veículos cadastrados
* 💬 Sistema de feedbacks
* 👨‍💻 Página de perfil do usuário
* ℹ️ Página institucional sobre o projeto
* 📱 Interface responsiva
* 🔗 Integração com API backend

---

## 🖥️ Tecnologias utilizadas

### Front-end

* **Next.js 14**
* **React 18**
* **TypeScript**
* **Tailwind CSS**
* **PostCSS**
* **ESLint**

### Arquitetura

O projeto utiliza a estrutura **App Router** do Next.js, organizando as páginas, componentes, serviços e dados de forma modular.

A estrutura principal do projeto contém:

```text
CarDoctor/
├── public/
│   └── imagens e recursos estáticos
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── cadastro/
│   │   ├── feedbacks/
│   │   ├── login/
│   │   ├── perfil/
│   │   ├── sobre/
│   │   └── veiculos/
│   │
│   ├── components/
│   │   ├── Header/
│   │   ├── Input/
│   │   ├── Menu/
│   │   └── Spinner/
│   │
│   ├── data/
│   │   └── dados utilizados pela aplicação
│   │
│   ├── services/
│   │   └── authService.ts
│   │
│   └── types.ts
│
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

A organização atual separa páginas, componentes reutilizáveis, serviços e dados, facilitando a manutenção e evolução da aplicação.

---

## ⚙️ Como executar o projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

* [Node.js](https://nodejs.org/)
* npm
* Git

### 1. Clone o repositório

```bash
git clone https://github.com/G-Souto/CarDoctor.git
```

Entre na pasta:

```bash
cd CarDoctor
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o backend

O front-end foi desenvolvido para consumir uma API backend.

Por padrão, a aplicação espera que a API esteja disponível em:

```text
http://localhost:8080
```

Caso o backend esteja hospedado em outro endereço, ajuste a URL utilizada pela aplicação.

### 4. Inicie o projeto

```bash
npm run dev
```

Depois, acesse:

```text
http://localhost:3000
```

---

## 🔑 Autenticação

O sistema possui fluxo de autenticação para permitir que cada usuário tenha acesso às suas informações.

O projeto também utiliza o identificador do usuário autenticado para estabelecer a relação entre o usuário e seus veículos.

O ID do usuário é armazenado no navegador utilizando:

```text
ID_USUARIO
```

> Para ambientes de produção, recomenda-se utilizar mecanismos de autenticação mais seguros, como cookies HTTP-only e tokens com expiração, em vez de armazenar informações sensíveis diretamente no `localStorage`.

---

## 🔌 Integração com Backend

O CarDoctor possui integração com uma API responsável pelo gerenciamento dos dados da aplicação.

A comunicação entre o front-end e o backend permite trabalhar com informações relacionadas a:

* Usuários
* Autenticação
* Veículos
* Diagnósticos
* Feedbacks
* Dados automotivos

A separação entre a interface e os serviços facilita futuras alterações na API e permite que diferentes partes da aplicação sejam desenvolvidas de maneira independente.

---

## 🌐 Deploy

O projeto possui uma versão publicada na Vercel:

**CarDoctor:**
https://car-doctor-xi.vercel.app/

---

## 👥 Integrantes

Projeto desenvolvido por:

* **Luisa Danielle**
* **Gustavo de Melo**
* **Michelle Potenza**

---

## 🎯 Objetivo acadêmico

O CarDoctor foi desenvolvido como projeto acadêmico com o objetivo de aplicar conhecimentos de desenvolvimento web, integração entre front-end e backend, gerenciamento de usuários e construção de interfaces modernas.

Além da aplicação prática, o projeto busca demonstrar conceitos de:

* Desenvolvimento web moderno
* Componentização
* TypeScript
* Integração com APIs
* Responsividade
* Organização de projetos
* Experiência do usuário (UX)

---

## 🚀 Próximas melhorias

Algumas funcionalidades que podem ser adicionadas futuramente:

* [ ] Histórico completo de diagnósticos
* [ ] Sistema de recomendações de manutenção
* [ ] Integração com oficinas próximas
* [ ] Notificações de manutenção preventiva
* [ ] Histórico de serviços realizados
* [ ] Dashboard com informações do veículo
* [ ] Melhorias no sistema de autenticação
* [ ] Testes automatizados
* [ ] Documentação da API
* [ ] Integração com dispositivos OBD-II

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e de demonstração de conhecimentos em desenvolvimento de software.

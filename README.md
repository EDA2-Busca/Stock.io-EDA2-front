# 💻 Gorgonas — Frontend (Site para Catalogar Produtos)

Frontend do sistema de Catalogo de produtos, construído com Next.js (App Router) e TypeScript.

## 📌 Sumário
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Úteis](#-scripts-úteis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🛠️ Tecnologias
| Categoria | Tecnologia |
|---|---|
| Framework | Next.js (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| HTTP Client | Axios |
| Formulários | Formik & Yup |
| Notificações | React Toastify |

## ⚙️ Pré-requisitos
- Node.js 18.x ou superior  
- npm ou Yarn

## 🚀 Instalação Rápida
```bash
# clonar
git clone <URL_DO_REPOSITORIO>
cd gorgonas-frontend

# instalar dependências
npm install
# ou
yarn install
```

## 🔒 Variáveis de Ambiente
Crie `.env.local` na raiz (mesmo nível do package.json):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

> Não commite esse arquivo — já está no .gitignore.

## ▶️ Scripts Úteis
```bash
npm run dev       # servidor de desenvolvimento (http://localhost:3000)
npm run build     # build para produção
npm run start     # inicia build em produção
npm run lint      # lint do projeto
npm run test      # executa testes (se configurados)
```

## 📁 Estrutura do Projeto (resumida)
```
src/
├─ app/               # rotas (layout.tsx, page.tsx) - App Router
│  ├─ feed-deslogado/
│  └─ globals.css
├─ components/        # componentes (Client & Server)
│  └─ ToastProvider.tsx
├─ types/             # tipos TypeScript
└─ utils/             # utilitários (ex: api.ts - instância Axios)
.env.local
package.json
```

## ✅ Boas práticas sugeridas
- Mantenha DTOs/validações sincronizadas entre frontend (Yup) e backend.
- Centralize instância Axios em src/utils/api.ts usando NEXT_PUBLIC_API_BASE_URL.
- Use ToastProvider para mensagens de sucesso/erro consistentes.
- Adicione testes unitários e lint/format em CI.

## 🤝 Contribuição
Abra issues e PRs. Descreva mudanças e inclua testes quando aplicável.

Desenvolvido pelo time Gorgonas.

## 👥 Equipe

Equipe responsável pelo desenvolvimento e manutenção do frontend. Para contribuições, abra uma issue ou PR no repositório.

| Foto | Nome | Função |
|---:|---|---|
| <img src="https://github.com/joaofmoreiraa.png" alt="João" width="80" style="border-radius:8px" /> | **[João Victor Felix Moreira](https://github.com/joaofmoreiraa)** | Coordenador de Projeto |
| <img src="https://github.com/uwatanabev.png" alt="Bernardo" width="80" style="border-radius:8px" /> | **[Bernardo Watanabe Venzi](https://github.com/uwatanabev)** | Desenvolvedor |
| <img src="https://github.com/dev-americo.png" alt="Pedro" width="80" style="border-radius:8px" /> | **[Pedro Américo](https://github.com/dev-americo)** | Desenvolvedor |
| <img src="https://github.com/Danielfelipe08.png" alt="Daniel" width="80" style="border-radius:8px" /> | **[Daniel Felipe](https://github.com/Danielfelipe08)** | Desenvolvedor |
| <img src="https://github.com/andrehsb.png" alt="Andrei" width="80" style="border-radius:8px" /> | **[Andrei Henrique](https://github.com/andrehsb)** | Desenvolvedor |
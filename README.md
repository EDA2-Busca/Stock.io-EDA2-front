# 💻 Gorgonas — Frontend (Site para Catalogar Produtos)

Frontend do sistema de Catalogo de produtos e ecommerce, construído com Next.js (App Router) e TypeScript.

## 📌 Sumário
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts Úteis](#-scripts-úteis)
- [Estrutura do Projeto](#-estrutura-do-projeto)

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

#biblioteca utilizada
npm install lucide-react
```

## 🔒 Variáveis de Ambiente
Crie `.env.local` na raiz (mesmo nível do package.json):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```


## ▶️ Scripts Úteis
```bash
npm run dev       # servidor de desenvolvimento (http://localhost:3000)

```


## Estruturas de dados implementadas para otimização
O projeto utiliza a estrutura de **Árvore Trie** para otimizar a recuperação de informações. Enquanto uma busca comum em um array tem complexidade $O(n)$, a nossa implementação atinge $O(m)$, onde *m* é o comprimento do termo buscado.

### Onde as Árvores são utilizadas:

1.  **Home Page (Busca Híbrida):**
    * **Trie de Produtos:** Armazena e indexa todos os produtos da vitrine.
    * **Trie de Categorias:** Uma árvore independente que mapeia nomes de categorias (ex: "Farmácia") para suas listas de produtos, permitindo que o usuário encontre setores inteiros digitando apenas o prefixo.
2.  **Páginas de Categoria:**
    * Indexação local de produtos específicos da categoria, permitindo filtros instantâneos sem novas chamadas de API.
3.  **Página de Lojas:**
    * **Trie de Lojas:** Implementação dedicada para busca de estabelecimentos parceiros pelo nome ou segmento.

## 👥 Equipe

Dupla responsavel pela implementação dos algoritmos de busca

| Foto | Nome | Função |
|---:|---|---|
| <img src="https://github.com/giovannafg.png" alt="Giovanna" width="80" style="border-radius:8px" /> | **[Giovanna Felipe](https://github.com/giovannafg)** | Desenvolvedor |
| <img src="https://github.com/andrehsb.png" alt="Andrei" width="80" style="border-radius:8px" /> | **[André Henrique](https://github.com/andrehsb)** | Desenvolvedor |
import { ProdutoParaCard } from "@/components/ProductRow";

export type CategoriaIndex = {
    id: number;
    nome: string;
    produtos: ProdutoParaCard[];
};

class NoCategoria {
    public filhos: (NoCategoria | undefined)[];
    public categorias: CategoriaIndex[];
    
    constructor() {
        this.filhos = new Array(256).fill(undefined);
        this.categorias = [];
    }
}

export class ArvoreBuscaCategoria {
    private raiz: NoCategoria;

    constructor() {
        this.raiz = new NoCategoria();
    }
    private limparTexto(texto: string): string {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    public inserir(categoria: CategoriaIndex): void {
        const palavra = this.limparTexto(categoria.nome);
        let atual = this.raiz;

        for (const letra of palavra) {
            const indice = letra.charCodeAt(0);
            if (indice > 255) continue; 
            
            if (!atual.filhos[indice]) {
                atual.filhos[indice] = new NoCategoria();
            }
            atual = atual.filhos[indice]!;
            
            const jaExiste = atual.categorias.some(c => c.nome === categoria.nome);
            if (!jaExiste) {
                atual.categorias.push(categoria);
            }
        }
    }

    public buscar(termo: string): CategoriaIndex[] {
        let atual = this.raiz;
        const termoBusca = this.limparTexto(termo.trim());

        if (termoBusca === "") return [];

        for (const letra of termoBusca) {
            const indice = letra.charCodeAt(0);
            if (indice > 255 || !atual.filhos[indice]) {
                return [];
            }
            atual = atual.filhos[indice]!;
        }
        return atual.categorias;
    }
}
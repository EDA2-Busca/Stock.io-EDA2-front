import { ProdutoParaCard } from "@/components/ProductRow";

class No {
    public filhos: (No | undefined)[];
    public produtos: ProdutoParaCard[];
    public fim: boolean;

    constructor() {
        this.filhos = new Array(256).fill(undefined);
        this.produtos = [];
        this.fim = false;
    }   
}

export class ArvoreBusca{
    private raiz: No;
    constructor(){
        this.raiz = new No()
    }
    private gerarIndice(char: string): number {
        return char.charCodeAt(0); 
    }
    public inserir(produto: ProdutoParaCard): void{
        let atual = this.raiz;
        const nomeParaBusca = produto.nome.toLowerCase();

        for(const letra of nomeParaBusca){
            const indice = this.gerarIndice(letra);

            if(!atual.filhos[indice]){
                atual.filhos[indice] = new No();
            }
            
            atual = atual.filhos[indice]!;
        }
        atual.fim = true;
    }
    public buscar(termo: string): ProdutoParaCard[] {
        let atual = this.raiz;
        const termoBusca = termo.toLowerCase();

        for (const letra of termoBusca) {
            const indice = this.gerarIndice(letra);
            if (indice > 255 || !atual.filhos[indice]) {
                return [];
            }
            atual = atual.filhos[indice]!;
        }

        return atual.produtos; // Retorna todos os produtos que passam por este prefixo
    }
}
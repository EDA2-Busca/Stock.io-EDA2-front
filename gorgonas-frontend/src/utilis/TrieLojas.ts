export type Loja = {
  id: number;
  nome: string;
  categoria: { nome: string }; 
  logo: string | null;
  slug?: string; 
};

class NoLoja {
    public filhos: (NoLoja | undefined)[];
    public lojas: Loja[]; 
    public fim: boolean;

    constructor() {
        this.filhos = new Array(256).fill(undefined);
        this.lojas = [];
        this.fim = false;
    }   
}

export class ArvoreBuscaLoja {
    private raiz: NoLoja;

    constructor() {
        this.raiz = new NoLoja();
    }

    private gerarIndice(char: string): number {
        return char.charCodeAt(0); 
    }

    public inserir(loja: Loja): void {
        const palavras = loja.nome.toLowerCase().split(" ");

        palavras.forEach(palavra => {
            let atual = this.raiz;

            for (const letra of palavra) {
                const indice = this.gerarIndice(letra);

                if (!atual.filhos[indice]) {
                    atual.filhos[indice] = new NoLoja();
                }
                
                atual = atual.filhos[indice]!;

                const jaExiste = atual.lojas.some(l => l.id === loja.id);
                if (!jaExiste) {
                    atual.lojas.push(loja);
                }
            }
            atual.fim = true;
        });
    }

    public buscar(termo: string): Loja[] {
        let atual = this.raiz;
        const termoBusca = termo.trim().toLowerCase();

        if (termoBusca === "") return [];

        for (const letra of termoBusca) {
            const indice = this.gerarIndice(letra);
            
            if (indice > 255 || !atual.filhos[indice]) {
                return [];
            }
            atual = atual.filhos[indice]!;
        }

        return atual.lojas;
    }
}
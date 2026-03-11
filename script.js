// O estado final que queremos alcançar
const ESTADO_OBJETIVO = "123456780";

// Mapeamento dos vizinhos: Para cada posição (0 a 8) no array/string, 
// quais índices o espaço vazio (0) pode trocar de lugar?
const MOVIMENTOS_VALIDOS = {
    0: [1, 3],
    1: [0, 2, 4],
    2: [1, 5],
    3: [0, 4, 6],
    4: [1, 3, 5, 7],
    5: [2, 4, 8],
    6: [3, 7],
    7: [4, 6, 8],
    8: [5, 7]
};

// Função principal disparada pelo botão
function iniciarBusca() {
    const input = document.getElementById('initialState').value;
    
    if (input.length !== 9 || !/^[0-8]+$/.test(input)) {
        alert("Por favor, insira exatamente 9 números de 0 a 8.");
        return;
    }

    desenharTabuleiro(input);
    resolverBFS(input);
}

// O Algoritmo de Busca em Largura (BFS)
function resolverBFS(estadoInicial) {
    // Fila armazena objetos com: estado atual, caminho percorrido, posição do zero
    let fila = [{ 
        estado: estadoInicial, 
        caminho: [], //historico de movimentações
        posicaoZero: estadoInicial.indexOf('0') //espaço vazio
    }];
    
    // Set para não repetir estados e evitar loop infinito
    let visitados = new Set();
    visitados.add(estadoInicial);

    let estadosTestados = 0;

    while (fila.length > 0) {
        // Primeiro estado da fila
        let atual = fila.shift();
        estadosTestados++;

        // Checa se chegamos no objetivo
        if (atual.estado === ESTADO_OBJETIVO) {
            exibirResultados(atual.caminho, estadosTestados);
            return;
        }

        // Pega as posições para onde o 0 pode ir
        let movimentosPossiveis = MOVIMENTOS_VALIDOS[atual.posicaoZero];

        for (let proximaPosicao of movimentosPossiveis) {
            // Gera o novo estado trocando o 0 com o número vizinho
            let novoEstado = trocarCaracteres(atual.estado, atual.posicaoZero, proximaPosicao);

            // Se ainda não visitamos essa configuração de tabuleiro
            if (!visitados.has(novoEstado)) {
                visitados.add(novoEstado);
                
                // Qual número movemos? (Apenas para mostrar no log/caminho)
                let numeroMovido = atual.estado[proximaPosicao];
                
                // Coloca o novo estado no final da fila para ser testado depois
                fila.push({
                    estado: novoEstado,
                    caminho: [...atual.caminho, numeroMovido], // Adiciona o movimento ao histórico
                    posicaoZero: proximaPosicao
                });
            }
        }
    }

    alert("Solução não encontrada para este estado!");
}

// --- Funções Auxiliares ---

// Função para trocar dois caracteres de lugar numa string
function trocarCaracteres(str, i, j) {
    let arrayDeChars = str.split('');
    let temp = arrayDeChars[i];
    arrayDeChars[i] = arrayDeChars[j];
    arrayDeChars[j] = temp;
    return arrayDeChars.join('');
}

// Atualiza o HTML com os resultados do trabalho
function exibirResultados(caminho, totalTestados) {
    document.getElementById('path').innerText = caminho.length > 0 ? caminho.join(' -> ') : "Já estava resolvido!";
    document.getElementById('moves').innerText = caminho.length;
    document.getElementById('testedStates').innerText = totalTestados;
}

// Desenha a grade inicial no HTML
function desenharTabuleiro(estado) {
    const board = document.getElementById('board');
    board.innerHTML = ''; // Limpa o tabuleiro

    for (let i = 0; i < 9; i++) {
        let numero = estado[i];
        let tile = document.createElement('div');
        tile.classList.add('tile');
        
        if (numero === '0') {
            tile.classList.add('empty');
            tile.innerText = '';
        } else {
            tile.innerText = numero;
        }
        
        board.appendChild(tile);
    }
}
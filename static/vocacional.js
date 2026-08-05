// CONFIGURAÇÃO DA API (Deixe vazio para usar a rota relativa)
const API_BASE_URL = ""; 

let perguntasSorteadas = [];
let respostas = [];
let indiceAtual = 0;

// 1. BUSCA AS PERGUNTAS DO BACKEND (API)
async function iniciarQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    if (!quizContainer) return;

    quizContainer.innerHTML = "<p class='loading'>Carregando teste vocacional...</p>";

    try {
        const response = await fetch(`${API_BASE_URL}/api/perguntas`);
        if (!response.ok) throw new Error("Erro ao buscar perguntas da API");

        perguntasSorteadas = await response.json();
        respostas = new Array(perguntasSorteadas.length);
        indiceAtual = 0;

        if (perguntasSorteadas.length === 0) {
            quizContainer.innerHTML = "<p>Nenhuma pergunta encontrada no servidor.</p>";
            return;
        }

        mostrarPerguntaDaVez();
    } catch (error) {
        console.error("Erro na inicialização:", error);
        quizContainer.innerHTML = "<p>Ops! Ocorreu um erro ao carregar o teste. Tente novamente mais tarde.</p>";
    }
}

// 2. RENDERIZA DINAMICAMENTE APENAS O CARD ATUAL
function mostrarPerguntaDaVez() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = ""; 

    if (indiceAtual < perguntasSorteadas.length) {
        const pergunta = perguntasSorteadas[indiceAtual];

        const card = document.createElement("div");
        card.className = "quiz-card pergunta-ativa";

        card.innerHTML = `
            <span class="progresso-contador">Pergunta ${indiceAtual + 1} de ${perguntasSorteadas.length}</span>
            <h2 class="pergunta-texto">${pergunta.texto}</h2>
            <div class="botoes-container">
                <button class="btn btn-sim">SIM</button>
                <button class="btn btn-talvez">TALVEZ</button>
                <button class="btn btn-nao">NÃO</button>
            </div>
        `;

        card.querySelector(".btn-sim").onclick = () => processarResposta("SIM", card.querySelector(".btn-sim"));
        card.querySelector(".btn-talvez").onclick = () => processarResposta("TALVEZ", card.querySelector(".btn-talvez"));
        card.querySelector(".btn-nao").onclick = () => processarResposta("NÃO", card.querySelector(".btn-nao"));

        quizContainer.appendChild(card);
    } else {
        // QUANDO AS PERGUNTAS ACABAM, EXIBE OS CAMPOS NOME/TELEFONE
        exibirCamposIdentificacao();
    }
}

// 3. PROCESSA O CLIQUE E PREPARA OS DADOS PARA O PYTHON
function processarResposta(valor, botao) {
    const pergunta = perguntasSorteadas[indiceAtual];
    
    respostas[indiceAtual] = {
        pergunta_id: pergunta.id, 
        escolha: valor
    };

    botao.classList.add("selecionado");

    setTimeout(() => {
        indiceAtual++;
        mostrarPerguntaDaVez();
    }, 320);
}

// 4. EXIBE OS CAMPOS DE IDENTIFICAÇÃO (NOME E TELEFONE)
function exibirCamposIdentificacao() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `
        <div class="quiz-card">
            <span class="progresso-contador">Quase Lá!</span>
            <div class="pergunta-texto">
                Preencha seus dados para visualizar o resultado:
            </div>

            <div class="form-identificacao">
                <div class="campo-grupo">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" placeholder="Digite seu nome" required>
                </div>
                <div class="campo-grupo">
                    <label for="telefone">WhatsApp / Telefone:</label>
                    <input type="tel" id="telefone" name="telefone" placeholder="(11) 99999-9999" required>
                </div>
                
                <button class="btn-enviar-resultado" onclick="finalizarQuiz()">
                    Ver resultado!
                </button>
            </div>
        </div>
    `;
}

// 5. ENVIA AS RESPOSTAS PARA O BACKEND CALCULAR
async function finalizarQuiz() {
    // Captura os valores digitados nos inputs antes de limpar a tela
    const nomeValor = document.getElementById("nome")?.value || "Não informado";
    const telefoneValor = document.getElementById("telefone")?.value || "Não informado";

    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "<p class='loading'>Processando e salvando seu perfil...</p>";

    // Monta o payload completo antes do fetch
    const payload = {
        nome: nomeValor,
        telefone: telefoneValor,
        respostas: respostas
    };

    console.log("Enviando resultados para a API:", payload);

    try {
        const response = await fetch(`${API_BASE_URL}/api/resultado`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const dadosResposta = await response.json();
        exibirTelaFinal(dadosResposta);

    } catch (error) {
        console.error("Erro ao enviar resultado:", error);
        quizContainer.innerHTML = `
            <div class="quiz-card">
                <h3>Erro ao salvar</h3>
                <p>Não conseguimos processar suas respostas com o servidor. Por favor, tente novamente.</p>
            </div>
        `;
    }
}

// 6. EXIBE O RESULTADO FINAL VINDO DO BACKEND
function exibirTelaFinal(dadosResposta) {
    const quizContainer = document.getElementById("quiz-container");
    
    const textoResultado = dadosResposta.texto_completo;
    const imagemUrl = dadosResposta.imagem_url;

    quizContainer.innerHTML = `
        <div class="quiz-card resultado-final" style="text-align: center;">
            <h3 style="color: #b6babe; font-size: 1.5em; margin-bottom: 10px;">Parabéns! Teste Concluído 🎉</h3>
            <p style="font-size: 1.1em; margin-bottom: 20px;">${textoResultado}</p>
            ${imagemUrl ? `<img src="${imagemUrl}" alt="Resultado Vocacional" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">` : ""}
        </div>
    `;
}

// Inicializa a aplicação quando o script carrega
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarQuiz);
} else {
    iniciarQuiz();
}
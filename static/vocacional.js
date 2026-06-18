// CONFIGURAÇÃO DA API (Ajuste a URL conforme o seu ambiente/FastAPI)
const API_BASE_URL = "http://127.0.0.1:8000"; 

let perguntasSorteadas = [];
let respostas = [];
let indiceAtual = 0;

// 1. BUSCA AS PERGUNTAS DO BACKEND (API)
async function iniciarQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    if (!quizContainer) return;

    quizContainer.innerHTML = "<p class='loading'>Carregando teste vocacional...</p>";

    try {
        // Faz a requisição para o endpoint do FastAPI que já retorna as 7 perguntas sorteadas
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
    quizContainer.innerHTML = ""; // Limpa o container

    // Se ainda houverem perguntas a responder
    if (indiceAtual < perguntasSorteadas.length) {
        const pergunta = perguntasSorteadas[indiceAtual];

        // Cria a estrutura do Card dinamicamente
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

        // Adiciona os eventos de clique nos botões recém-criados
        card.querySelector(".btn-sim").onclick = () => processarResposta("SIM", card.querySelector(".btn-sim"));
        card.querySelector(".btn-talvez").onclick = () => processarResposta("TALVEZ", card.querySelector(".btn-talvez"));
        card.querySelector(".btn-nao").onclick = () => processarResposta("NÃO", card.querySelector(".btn-nao"));

        quizContainer.appendChild(card);
    } else {
        // Final do Quiz: Processa os cálculos e exibe o botão de conclusão ou envia automático
        finalizarQuiz();
    }
}

// 3. PROCESSA O CLIQUE E AVANÇA O ÍNDICE
function processarResposta(valor, botao) {
    const pergunta = perguntasSorteadas[indiceAtual];
    
    // Pesos das áreas mapeados
    const pesosArea = { exatas: 3.1, humanas: 3.3, biologicas: 3.2 };
    let pontos = 0;

    if (valor === "SIM") {
        pontos = pesosArea[pergunta.area] || 3;
    } else if (valor === "TALVEZ") {
        pontos = 0.5 * (pesosArea[pergunta.area] || 3); // Pontua metade do peso
    }

    // Salva o objeto da resposta
    respostas[indiceAtual] = {
        id_pergunta: pergunta.id, // Importante para auditoria/API
        area: pergunta.area,
        pontos: pontos
    };

    // Feedback visual rápido no botão clicado
    botao.classList.add("selecionado");

    // Avança para o próximo card após um delay suave (320ms)
    setTimeout(() => {
        indiceAtual++;
        mostrarPerguntaDaVez();
    }, 320);
}

// 4. CALCULA O PERFIL E ENVIA PARA O BACKEND VIA POST
async function finalizarQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "<p class='loading'>Processando e salvando seu perfil...</p>";

    // Calcula a pontuação final localmente
    const pontuacoes = { exatas: 0, humanas: 0, biologicas: 0 };
    respostas.forEach(r => {
        if (r && r.area) pontuacoes[r.area] += r.pontos;
    });

    const max = Math.max(...Object.values(pontuacoes));
    const areasMaisPontuadas = Object.keys(pontuacoes).filter(a => pontuacoes[a] === max);
    const perfilPredominante = areasMaisPontuadas.join(", ");

    // Prepara o payload para enviar para a API
    const payload = {
        perfil: perfilPredominante.toUpperCase(),
        pontuacao_detalhada: pontuacoes,
        respostas_candidato: respostas
    };

    console.log("Enviando resultados para a API do projeto:", payload);

    try {
        // Envia os dados para o seu Backend. O Backend será responsável por encaminhar para o CRM ativo
        const response = await fetch(`${API_BASE_URL}/api/resultados`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Erro ao salvar resultado na API");
        const dadosResposta = await response.json();

        // Renderiza a tela de sucesso final baseada no perfil
        exibirTelaFinal(perfilPredominante);

    } catch (error) {
        console.error("Erro ao enviar resultado:", error);
        quizContainer.innerHTML = `
            <div class="quiz-card">
                <h3>Erro ao salvar</h3>
                <p>Calculamos seu perfil como <strong>${perfilPredominante.toUpperCase()}</strong>, mas não conseguimos sincronizar com o servidor.</p>
            </div>
        `;
    }
}

// 5. EXIBE AS IMAGENS E MENSAGENS DO CLARETIANO
function exibirTelaFinal(perfil) {
    const quizContainer = document.getElementById("quiz-container");
    
    // Mapeamento das imagens oficiais
    const imagensPerfil = {
        exatas: "https://rbarquivos.apprbs.com.br/file/claretiano/Email/img/68e00fce7a5803827869407260-1080x1920px_Artes_TesteVocacional_2025_3-8.png",
        humanas: "https://rbarquivos.apprbs.com.br/file/claretiano/Email/img/68e00fbb93a457117916344408-1080x1920px_Artes_TesteVocacional_2025_2-8.png",
        biologicas: "https://rbarquivos.apprbs.com.br/file/claretiano/Email/img/68e00faa659359995334302209-1080x1920px_Artes_TesteVocacional_2025_1-8.png"
    };

    const primeiraArea = perfil.split(", ")[0].toLowerCase();
    const imagemUrl = imagensPerfil[primeiraArea] || "";

    quizContainer.innerHTML = `
        <div class="quiz-card resultado-final" style="text-align: center;">
            <h3 style="color: #003263; font-size: 1.5em; margin-bottom: 10px;">Parabéns! Teste Concluído 🎉</h3>
            <p style="font-size: 1.1em; margin-bottom: 20px;">Seu perfil predominante mapeado foi: <strong>${perfil.toUpperCase()}</strong></p>
            ${imagemUrl ? `<img src="${imagemUrl}" alt="Card ${perfil}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">` : ""}
        </div>
    `;
}

// Inicializa a aplicação quando o script carrega
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarQuiz);
} else {
    iniciarQuiz();
}
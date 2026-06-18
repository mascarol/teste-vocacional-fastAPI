let perguntasSorteadas = [];
let respostas = [];
let indiceAtual = 0; // Controla qual pergunta está ativa na tela

// NOVA: Garante que as perguntas já existem no HTML antes de tentar escondê-las e embaralhar
function iniciarQuiz() {
    const todas = document.querySelectorAll(".question");
    
    // Se a plataforma ainda não renderizou as perguntas na tela, espera 100ms e tenta de novo
    if (todas.length === 0) {
        setTimeout(iniciarQuiz, 100);
        return;
    }
    embaralharPerguntas();
}

// Embaralha e seleciona 7 perguntas do HTML
function cortarPerguntas() { /* Mantido apenas para histórico se necessário */ }

function embaralharPerguntas() {
    console.log("Embaralhando perguntas...");
    const todas = Array.from(document.querySelectorAll(".question"));
    
    // Esconde todas as 55 perguntas imediatamente
    todas.forEach(div => div.style.display = "none");
    
    // Sorteia as 7 perguntas
    perguntasSorteadas = todas.sort(() => Math.random() - 0.5).slice(0, 7);
    respostas = new Array(perguntasSorteadas.length);
    indiceAtual = 0; 

    perguntasSorteadas.forEach((div, i) => {
        const botoes = div.querySelectorAll(".btn");
        botoes.forEach(btn => {
            btn.onclick = () => responder(i, btn.textContent.trim().toUpperCase(), btn);
        });
    });
    
    console.log("Perguntas sorteadas:", perguntasSorteadas.length);
    mostrarPerguntaDaVez(); 
}

// AJUSTADA: Gerencia a exibição de apenas um card por vez de forma blindada
function mostrarPerguntaDaVez() {
    // CORREÇÃO CRÍTICA: Varre o HTML e garante que TODAS as perguntas fiquem invisíveis
    document.querySelectorAll(".question").forEach(div => div.style.display = "none");
    
    // Remove qualquer mensagem de conclusão anterior caso o teste seja refeito
    const msgAntiga = document.querySelector(".mensagem-conclusao");
    if (msgAntiga) msgAntiga.remove();

    // Se ainda restarem perguntas a responder (do índice 0 ao 6)
    if (indiceAtual < perguntasSorteadas.length) {
        const divAtual = perguntasSorteadas[indiceAtual];
        divAtual.style.display = "block"; // Torna visível estritamente a atual
        
        // Cria dinamicamente um contador de etapas ("Pergunta X de 7") no topo do card
        let progressoSpan = divAtual.querySelector(".progresso-contador");
        if (!progressoSpan) {
            progressoSpan = document.createElement("span");
            progressoSpan.className = "progresso-contador";
            progressoSpan.style.display = "block";
            progressoSpan.style.fontSize = "0.9em";
            progressoSpan.style.color = "#0030a6";
            progressoSpan.style.fontWeight = "bold";
            progressoSpan.style.marginBottom = "10px";
            divAtual.insertBefore(progressoSpan, divAtual.firstChild);
        }
        progressoSpan.textContent = `Pergunta ${indiceAtual + 1} de 7`;
        
    } else {
        // Quando o candidato responde a 7ª pergunta, exibe o feedback
        const quizContainer = document.getElementById("quiz") || document.body;
        const msgFinal = document.createElement("div");
        msgFinal.className = "question mensagem-conclusao";
        msgFinal.style.display = "block";
        msgFinal.innerHTML = `
            <h3 style="color: #003263; margin-bottom: 8px;">Tudo respondido! 🎉</h3>
            <p>Suas respostas foram processadas. Clique no botão de avançar logo abaixo para ver o seu resultado!</p>
        `;
        quizContainer.appendChild(msgFinal);
    }
}

// Marca visualmente, computa os pontos e gerencia o avanço das etapas
function responder(indice, valor, botao) {
    const pesosArea = {
        exatas: 3.1,
        humanas: 3.3,
        biologicas: 3.2
    };
    
    const area = perguntasSorteadas[indice].dataset.area;
    
    let pontos = 0;
    if (valor === "SIM") {
        pontos = pesosArea[area] || 3;
    } else if (valor === "TALVEZ") {
        pontos = 0.5 * (pesosArea[area] || 3); // O "Talvez" agora pontua metade do peso de forma justa
    }
    
    respostas[indice] = {
        area: area,
        pontos: pontos
    };
    
    // Gerenciamento visual dos botões clicados
    const botoes = botao.closest(".widget").querySelectorAll(".btn");
    botoes.forEach(b => b.classList.remove("selecionado"));
    
    botao.classList.add("selecionado");
    botao.closest(".question").classList.add("respondida");
    
    // Se completou as 7 perguntas, atualiza o campo oculto do Rubeus imediatamente
    const respondidasCount = respostas.filter(r => r !== undefined).length;
    if (respondidasCount === perguntasSorteadas.length) {
        preencherCampoResultadoAutomatico();
    }

    // Espera o usuário ver o clique e passa para o próximo card de forma fluida
    setTimeout(() => {
        indiceAtual++;
        mostrarPerguntaDaVez();
    }, 320);
}

// Mantém toda a lógica nativa de cálculo e integração com campos do Rubeus
function preencherCampoResultadoAutomatico() {
    const pontuacoes = { exatas: 0, humanas: 0, biologicas: 0 };
    respostas.forEach(r => {
        if (r && r.area) pontuacoes[r.area] += r.pontos;
    });
    const max = Math.max(...Object.values(pontuacoes));
    const areasMaisPontuadas = Object.keys(pontuacoes).filter(a => pontuacoes[a] === max);
    const valorFinal = areasMaisPontuadas.join(", ");
    console.log("Resultado calculado (pré-save):", valorFinal, pontuacoes);
    
    if (typeof processo !== "undefined" && processo.camposPersonalizados) {
        processo.camposPersonalizados.campopersonalizado_180_compl_proc = valorFinal;
    }
    const nameSelector = 'textarea[name="processo.camposPersonalizados.campopersonalizado_180_compl_proc"]';
    
    function fillTextareaIfFound() {
        const campo = document.querySelector(nameSelector) || document.querySelector('[name="processo.camposPersonalizados.campopersonalizado_180_compl_proc"]');
        if (campo) {
            campo.value = valorFinal;
            campo.dispatchEvent(new Event("input", { bubbles: true }));
            campo.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
        }
        return false;
    }
    
    if (fillTextareaIfFound()) return;
    
    const mo = new MutationObserver((mutations, observer) => {
        if (fillTextareaIfFound()) observer.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
        try { mo.disconnect(); } catch (e) {}
    }, 15000);
}

// Mantém a exibição visual das imagens oficiais
function calcularResultado() {
    const respondidasCount = respostas.filter(r => r !== undefined).length;
    if (respondidasCount !== perguntasSorteadas.length) {
        alert("Responda todas as perguntas antes de ver o resultado.");
        return;
    }
    const pontuacoes = { exatas: 0, humanas: 0, biologicas: 0 };
    respostas.forEach(r => pontuacoes[r.area] += r.pontos);
    const max = Math.max(...Object.values(pontuacoes));
    const areasMaisPontuadas = Object.keys(pontuacoes).filter(a => pontuacoes[a] === max);
    
    let resultadoTexto = "", imagem = "";
    if (areasMaisPontuadas.length > 1) {
        resultadoTexto = "Você tem aptidão para várias áreas: " + areasMaisPontuadas.join(", ").toUpperCase() + "!";
    } else {
        switch (areasMaisPontuadas[0]) {
            case "exatas":
                imagem = "https://rbarquivos.apprbs.com.br/file/claretiano/Email/img/68e00fce7a5803827869407260-1080x1920px_Artes_TesteVocacional_2025_3-8.png";
                break;
            case "humanas":
                imagem = "https://rbarquivos.apprbs.com.br/file/claretiano/Email/img/68e00fbb93a457117916344408-1080x1920px_Artes_TesteVocacional_2025_2-8.png";
                break;
            case "biologicas":
                imagem = "https://rbarquivos.apprbs.com.br/file/claretiano/Email/img/68e00faa659359995334302209-1080x1920px_Artes_TesteVocacional_2025_1-8.png";
                break;
        }
        resultadoTexto = "Seu perfil predominante é: " + areasMaisPontuadas[0].toUpperCase();
    }
    const resultadoDiv = document.getElementById("resultado");
    if (resultadoDiv) {
        resultadoDiv.innerHTML = `
            <p style="font-size:1.1em; margin-top:10px; font-weight: bold; color: #003263;">${resultadoTexto}</p>
            ${imagem ? `<img src="${imagem}" style="max-width:100%; margin-top:20px; border-radius:10px;">` : ""}
        `;
        resultadoDiv.style.display = "block";
        resultadoDiv.scrollIntoView({ behavior: "smooth" });
    }
    preencherCampoResultadoAutomatico();
}

// Observador nativo do botão Rubeus (Avançar/Próximo)
const observer = new MutationObserver(() => {
    const btnConcluir = document.getElementById("rbBtnNext");
    if (btnConcluir && !btnConcluir.dataset.listenerAdded) {
        btnConcluir.dataset.listenerAdded = "true";
        btnConcluir.addEventListener("click", () => {
            setTimeout(calcularResultado, 500);
        });
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Modificado para chamar a função de verificação segura
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarQuiz);
} else {
    iniciarQuiz();
}
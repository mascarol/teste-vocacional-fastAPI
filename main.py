import os
from pathlib import Path
import random
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Backend Teste Vocacional Claretiano")

# --- AJUSTE DOS CAMINHOS DINÂMICOS ---
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
STATIC_DIR.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR, html=True), name="static")

POOL_PERGUNTAS = [
    # --- EXATAS (1 a 25) ---
    {"id": 1, "texto": "Gosto de resolver problemas de matemática ou lógica", "area": "exatas"},
    {"id": 2, "texto": "Tenho interesse em entender como as coisas funcionam", "area": "exatas"},
    {"id": 3, "texto": "Me interesso por tecnologia, máquinas ou computadores", "area": "exatas"},
    {"id": 4, "texto": "Gosto de experiências práticas e trabalhar com as mãos", "area": "exatas"},
    {"id": 5, "texto": "Tenho facilidade com numbers e cálculos", "area": "exatas"},
    {"id": 6, "texto": "Gosto de observar e analisar dados, gráficos ou informações", "area": "exatas"},
    {"id": 7, "texto": "Aprendo rápido quando o assunto envolve prática", "area": "exatas"},
    {"id": 8, "texto": "Consigo focar por longos períodos em algo que gosto", "area": "exatas"},
    {"id": 9, "texto": "Gosto de analisar as situações por meio de números, estatísticas e fatos concretos", "area": "exatas"},
    {"id": 10, "texto": "Na solução de um problema, é melhor partir para a prática do que ficar discutindo e analisando", "area": "exatas"},
    {"id": 11, "texto": "Sou prático e rápido nas minhas decisões", "area": "exatas"},
    {"id": 12, "texto": "Eu gosto quando posso criticar uma ideia ou processo", "area": "exatas"},
    {"id": 13, "texto": "Eu entendo melhor as coisas quando ver sua aplicação prática", "area": "exatas"},
    {"id": 14, "texto": "Prefiro que me apreciem por ser uma pessoa racional do que por ser uma pessoa amiga", "area": "exatas"},
    {"id": 15, "texto": "Eu gosto de trabalhar com ferramentas e máquinas", "area": "exatas"},
    {"id": 16, "texto": "Gosto de relacionar as causas das coisas com os seus efeitos", "area": "exatas"},
    {"id": 17, "texto": "Eu me sinto mais confortável em atividades que eu possa fazer com as minhas próprias mãos", "area": "exatas"},
    {"id": 18, "texto": "Gosto de pesquisar, analisar, classificar, calcular, estudar", "area": "exatas"},
    {"id": 19, "texto": "Prefiro analisar com detalhes antes de decidir", "area": "exatas"},
    {"id": 20, "texto": "Gosto de construir, consertar e criar coisas", "area": "exatas"},
    {"id": 21, "texto": "Eu me sinto mais confortável quando tenho tempo de estudar uma situação para achar uma solução", "area": "exatas"},
    {"id": 22, "texto": "Gosto de agir, transportar, embalar, desmontar, construir, agilizar", "area": "exatas"},
    {"id": 23, "texto": "Gosto de ser justo, de criticar com fatos e dados, mesmo que isso desagrade às pessoas", "area": "exatas"},
    {"id": 24, "texto": "Sinto-me mais confortável lidando com coisas rotineiras e previsíveis", "area": "exatas"},
    {"id": 25, "texto": "Gosto de atividades dinâmicas e com ação", "area": "exatas"},
    
    # --- BIOLÓGICAS (26 a 40) ---
    {"id": 26, "texto": "Gosto de cuidar da saúde e do bem-estar de outras pessoas", "area": "biologicas"},
    {"id": 27, "texto": "Sinto satisfação em ajudar alguém que está passando por um problema físico ou emocional", "area": "biologicas"},
    {"id": 28, "texto": "Tenho interesse em entender como o corpo humano funciona", "area": "biologicas"},
    {"id": 29, "texto": "Tenho curiosidade em saber como as doenças surgem e como podem ser tratadas", "area": "biologicas"},
    {"id": 30, "texto": "Gosto de aprender sobre biologia, anatomia, química ou fisiologia", "area": "biologicas"},
    {"id": 31, "texto": "Me interesso por assuntos como saúde, corpo humano e natureza", "area": "biologicas"},
    {"id": 32, "texto": "Tenho paciência e gosto de ouvir os outros", "area": "biologicas"},
    {"id": 33, "texto": "As pessoas me acham um bom ouvinte", "area": "biologicas"},
    {"id": 34, "texto": "Procuro ver o lado positivo das pessoas", "area": "biologicas"},
    {"id": 35, "texto": "Tenho facilidade para compreender os motivos das pessoas", "area": "biologicas"},
    {"id": 36, "texto": "Eu me interesso pelo bem estar de pessoas e animais", "area": "biologicas"},
    {"id": 37, "texto": "Eu não meço esforços para ajudar um amigo", "area": "biologicas"},
    {"id": 38, "texto": "Gosto de cuidar, aconselhar, ensinar, influenciar, encorajar", "area": "biologicas"},
    {"id": 39, "texto": "Tenho facilidade para seguir procedimentos com atenção e disciplina", "area": "biologicas"},
    {"id": 40, "texto": "Acredito que ajudar os outros a ter uma vida melhor é uma das profissões mais importantes que existem", "area": "biologicas"},
    
    # --- HUMANAS (41 a 55) ---
    {"id": 41, "texto": "Gosto de ler, escrever ou conversar sobre ideias", "area": "humanas"},
    {"id": 42, "texto": "Gosto de desenhar, pintar ou criar coisas diferentes", "area": "humanas"},
    {"id": 43, "texto": "Tenho vontade de ajudar pessoas, ouvir e aconselhar", "area": "humanas"},
    {"id": 44, "texto": "Consigo explicar bem uma idea ou assunto para os outros", "area": "humanas"},
    {"id": 45, "texto": "Tenho boa coordenação motora e sou cuidadoso(a) com detalhes", "area": "humanas"},
    {"id": 46, "texto": "Tenho criatividade para imaginar novas soluções ou ideias", "area": "humanas"},
    {"id": 47, "texto": "Lido bem com pessoas e sei trabalhar em grupo", "area": "humanas"},
    {"id": 48, "texto": "Me comunico bem e gosto de apresentar ideias", "area": "humanas"},
    {"id": 49, "texto": "Eu entendo melhor as coisas quando gosto da pessoa que está explicando", "area": "humanas"},
    {"id": 50, "texto": "Gosto de registrar e manter meu material escolar organizado", "area": "humanas"},
    {"id": 51, "texto": "Eu prefiro abrir mão da minha opinião a criar um conflito entre as pessoas", "area": "humanas"},
    {"id": 52, "texto": "Eu valorizo as críticas, sugestões e opiniões dos outros quando são ditas de maneira amigável", "area": "humanas"},
    {"id": 53, "texto": "Numa discussão é mais importante, para mim, manter a harmonia entre as pessoas do que ganhar a discussão", "area": "humanas"},
    {"id": 54, "texto": "Numa discussão com muitas opiniões diferentes a melhor alternativa para resolver rapidamente é fazer uma votação", "area": "humanas"},
    {"id": 55, "texto": "Gosto de trabalhar com ideias, teorias e informação", "area": "humanas"}
]

PESOS_AREA = {
    "exatas": 3.1,
    "humanas": 3.3,
    "biologicas": 3.2
}

IMAGENS_RESULTADO = {
    "exatas": "https://rbarquivos.apprbs.com.br/file/claretiano/Email/img/68e00fce7a5803827869407260-1080x1920px_Artes_TesteVocacional_2025_3-8.png",
    "humanas": "https://rbarquivos.apprbs.com.br/file/claretiano/Email/img/68e00fbb93a457117916344408-1080x1920px_Artes_TesteVocacional_2025_2-8.png",
    "biologicas": "https://rbarquivos.apprbs.com.br/file/claretiano/Email/img/68e00faa659359995334302209-1080x1920px_Artes_TesteVocacional_2025_1-8.png"
}

class RespostaItem(BaseModel):
    pergunta_id: int
    escolha: str

class QuizSubmission(BaseModel):
    respostas: List[RespostaItem]

@app.get("/api/perguntas")
def obter_perguntas():
    return random.sample(POOL_PERGUNTAS, 7)

@app.post("/api/resultado")
def calcular_resultado(submissao: QuizSubmission):
    pontuacoes = {"exatas": 0.0, "humanas": 0.0, "biologicas": 0.0}
    mapa_perguntas = {p["id"]: p for p in POOL_PERGUNTAS}
    
    for item in submissao.respostas:
        pergunta = mapa_perguntas.get(item.pergunta_id)
        if pergunta:
            area = pergunta["area"]
            if item.escolha == "SIM":
                pontuacoes[area] += PESOS_AREA.get(area, 3.0)
            elif item.escolha == "TALVEZ":
                pontuacoes[area] += 1.0

    max_pontos = max(pontuacoes.values())
    areas_vencedoras = [area for area, pontos in pontuacoes.items() if pontos == max_pontos]
    
    imagem_url = ""
    if len(areas_vencedoras) > 1:
        resultado_texto = f"Você tem aptidão para múltiplas áreas: {', '.join(areas_vencedoras)}!"
    else:
        resultado_texto = f"Seu perfil predominante é: {areas_vencedoras[0].upper()}"
        imagem_url = IMAGENS_RESULTADO.get(areas_vencedoras[0], "")
        
    return {
        "areas_vencedoras": areas_vencedoras,
        "texto_completo": resultado_texto,
        "imagem_url": imagem_url,
        "pontuacoes": pontuacoes
    }
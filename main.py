import os
import random
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

# ⚠️ Habilita o CORS para que qualquer frontend (de qualquer origem) consiga consumir sua API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURAÇÃO DOS CAMINHOS ---
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
STATIC_DIR.mkdir(exist_ok=True)

# Pool com as 55 perguntas originais
POOL_PERGUNTAS =[
    # 📐 EXATAS (1 a 20)
    {"id": 1, "texto": "Mexer nas configurações de apps para otimizar tudo é sua vibe?", "area": "exatas"},
    {"id": 2, "texto": "No videogame, você foca mais na estratégia do que na história?", "area": "exatas"},
    {"id": 3, "texto": "Fazer contas de cabeça ou dividir o PIX é moleza para você?", "area": "exatas"},
    {"id": 4, "texto": "Curte resolver enigmas, quebra-cabeças ou bugs no PC?", "area": "exatas"},
    {"id": 5, "texto": "Passaria horas analisando gráficos de engajamento do TikTok?", "area": "exatas"},
    {"id": 6, "texto": "Você prefere regras claras e lógica em vez de improvisação?", "area": "exatas"},
    {"id": 7, "texto": "Tenta arrumar o roteador sozinho antes de chamar o técnico?", "area": "exatas"},
    {"id": 8, "texto": "Curte tentar prever resultados usando dados e probabilidades?", "area": "exatas"},
    {"id": 9, "texto": "Organizar os arquivos do PC em pastas te dá paz de espírito?", "area": "exatas"},
    {"id": 10, "texto": "Gostaria de aprender programação para automatizar tarefas?", "area": "exatas"},
    {"id": 11, "texto": "Você gosta de descobrir padrões em sequências de números ou formas?", "area": "exatas"},
    {"id": 12, "texto": "Prefere planejar os gastos do mês a gastar tudo por impulso?", "area": "exatas"},
    {"id": 13, "texto": "Curte entender a física por trás de grandes construções ou carros?", "area": "exatas"},
    {"id": 14, "texto": "Montar móveis seguindo o manual sozinho é um desafio divertido?", "area": "exatas"},
    {"id": 15, "texto": "Você prefere respostas exatas (tipo sim ou não) a respostas vagas?", "area": "exatas"},
    {"id": 16, "texto": "Acha interessante como a criptografia protege seus dados nas redes?", "area": "exatas"},
    {"id": 17, "texto": "Tem curiosidade em saber como funcionam os algoritmos de busca?", "area": "exatas"},
    {"id": 18, "texto": "Mapas, tabelas e infográficos são fáceis de ler para você?", "area": "exatas"},
    {"id": 19, "texto": "Você prefere jogos de tabuleiro táticos (tipo Xadrez) a jogos de pura sorte?", "area": "exatas"},
    {"id": 20, "texto": "Tem facilidade para pensar de forma geométrica ou espacial?", "area": "exatas"},

    # 🌍 HUMANAS (21 a 40)
    {"id": 21, "texto": "Você repara muito no comportamento e no sentimento das pessoas?", "area": "humanas"},
    {"id": 22, "texto": "Curte entender o impacto social das polêmicas do Twitter/X?", "area": "humanas"},
    {"id": 23, "texto": "Gosta de debates profundos sobre atualidades ou filosofia?", "area": "humanas"},
    {"id": 24, "texto": "Maratonar documentários de True Crime é seu rolê ideal?", "area": "humanas"},
    {"id": 25, "texto": "Você é a pessoa que sempre ouve os desabafos dos amigos?", "area": "humanas"},
    {"id": 26, "texto": "Tem interesse em criar campanhas publicitárias ou roteiros?", "area": "humanas"},
    {"id": 27, "texto": "Prefere séries focadas no drama e na mente dos personagens?", "area": "humanas"},
    {"id": 28, "texto": "Curte aprender sobre culturas, idiomas e história antiga?", "area": "humanas"},
    {"id": 29, "texto": "Defende causas sociais e minorias com unhas e dentes?", "area": "humanas"},
    {"id": 30, "texto": "Tem facilidade para liderar equipes e resolver tretas de grupo?", "area": "humanas"},
    {"id": 31, "texto": "Escrever redações, textos ou expressar ideias em palavras é fácil para você?", "area": "humanas"},
    {"id": 32, "texto": "Você se interessa por museus, arte ou manifestações culturais?", "area": "humanas"},
    {"id": 33, "texto": "Gosta de analisar discursos e propagandas para ver o que há por trás?", "area": "humanas"},
    {"id": 34, "texto": "Entender as motivações históricas de uma sociedade te chama atenção?", "area": "humanas"},
    {"id": 35, "texto": "Você costuma se colocar no lugar do outro antes de julgar uma ação?", "area": "humanas"},
    {"id": 36, "texto": "Acha interessante entender como as gírias e os idiomas evoluem?", "area": "humanas"},
    {"id": 37, "texto": "Curte a área de eventos, comunicação, podcasts ou jornalismo?", "area": "humanas"},
    {"id": 38, "texto": "O bem-estar e os direitos da sua comunidade são prioridades para você?", "area": "humanas"},
    {"id": 39, "texto": "Gosta de entender os mistérios da mente e dos transtornos psicológicos?", "area": "humanas"},
    {"id": 40, "texto": "Se sente confortável defendendo uma ideia em público ou em voz alta?", "area": "humanas"},

    # 🌿 BIOLÓGICAS (41 a 60)
    {"id": 41, "texto": "É a primeira pessoa a socorrer quem passa mal no rolê?", "area": "biologicas"},
    {"id": 42, "texto": "Vê um bicho de rua machucado e já quer cuidar ou pesquisar sobre?", "area": "biologicas"},
    {"id": 43, "texto": "Acha fascinante entender como o corpo humano funciona por dentro?", "area": "biologicas"},
    {"id": 44, "texto": "Curte a ideia de fazer experimentos científicos em laboratório?", "area": "biologicas"},
    {"id": 45, "texto": "Prefere rolês na natureza do que em locais fechados e tecnológicos?", "area": "biologicas"},
    {"id": 46, "texto": "Olha a tabela nutricional dos alimentos por pura curiosidade?", "area": "biologicas"},
    {"id": 47, "texto": "Filmes de vírus ou apocalipse te fazem pensar em ciência real?", "area": "biologicas"},
    {"id": 48, "texto": "Assuntos como sustentabilidade e eco-friendly te atraem?", "area": "biologicas"},
    {"id": 49, "texto": "Cuidar de plantas ou estudar ecossistemas te interessa?", "area": "biologicas"},
    {"id": 50, "texto": "Trabalhar diretamente para salvar vidas ou proteger a saúde do planeta te motiva?", "area": "biologicas"},
    {"id": 51, "texto": "Tem curiosidade sobre o mundo microscópico, células e mutações?", "area": "biologicas"},
    {"id": 52, "texto": "Você se interessa por anatomia, funcionamento dos órgãos ou cirurgias?", "area": "biologicas"},
    {"id": 53, "texto": "Acompanha notícias sobre biologia marinha ou novas espécies?", "area": "biologicas"},
    {"id": 54, "texto": "Entender como os remédios ou vacinas agem no corpo te desperta interesse?", "area": "biologicas"},
    {"id": 55, "texto": "Você gostaria de entender a fundo o comportamento e instinto dos animais?", "area": "biologicas"},
    {"id": 56, "texto": "A biotecnologia e a modificação genética aplicadas à saúde te fascinam?", "area": "biologicas"},
    {"id": 57, "texto": "Você lida bem com a visão de machucados ou sangue sem passar mal?", "area": "biologicas"},
    {"id": 58, "texto": "Gosta de jardinagem, hortas ou de entender o ciclo dos vegetais?", "area": "biologicas"},
    {"id": 59, "texto": "Tem interesse em estudar como a química cerebral afeta nossas emoções?", "area": "biologicas"},
    {"id": 60, "texto": "Proteger a biodiversidade e os oceanos é uma causa urgente para você?", "area": "biologicas"}
]

PESOS_AREA = {
    "exatas": 3.1,
    "humanas": 3.3,
    "biologicas": 3.2
}

IMAGENS_RESULTADO = {
    "exatas": "/static/exatas.png",
    "humanas": "/static/humanas.png",
    "biologicas": "/static/biologicas.png"
}

# --- MODELOS DE ENTRADA (VALIDAÇÃO DE DADOS) ---
class RespostaItem(BaseModel):
    pergunta_id: int
    escolha: str

class QuizSubmission(BaseModel):
    respostas: list[RespostaItem]

# --- ENDPOINTS DA API ---

@app.get("/api/perguntas")
def obter_perguntas_sorteadas():
    """
    Sorteia 7 perguntas aleatórias do pool de 55 e envia para o frontend.
    """
    qtd_sorteio = min(len(POOL_PERGUNTAS), 7)
    perguntas_sorteadas = random.sample(POOL_PERGUNTAS, qtd_sorteio)
    return perguntas_sorteadas

@app.post("/api/resultado")
def calcular_resultado(submissao: QuizSubmission):
    """
    Processa as respostas recebidas do frontend, calcula os pesos e retorna o perfil ideal.
    """
    pontuacoes = {"exatas": 0.0, "humanas": 0.0, "biologicas": 0.0}
    mapa_perguntas = {p["id"]: p for p in POOL_PERGUNTAS}
    
    for item in submissao.respostas:
        pergunta = mapa_perguntas.get(item.pergunta_id)
        if pergunta:
            area = pergunta["area"]
            peso = PESOS_AREA.get(area, 1.0)
            
            if item.escolha.upper() == "SIM":
                pontuacoes[area] += 1.0 * peso
            elif item.escolha.upper() == "TALVEZ":
                pontuacoes[area] += 0.5 * peso
                
    max_pontos = max(pontuacoes.values())
    areas_vencedoras = [area for area, pontos in pontuacoes.items() if pontos == max_pontos]
    
    if len(areas_vencedoras) > 1:
        areas_formatadas = " e ".join([area.upper() for area in areas_vencedoras])
        resultado_texto = f"Uau! Você tem forte aptidão para múltipas áreas: {areas_formatadas}! 🌟"
        imagem_url = IMAGENS_RESULTADO.get("empate", "link_da_imagem.jpg")
    else:
        resultado_texto = ""
        imagem_url = IMAGENS_RESULTADO.get(areas_vencedoras[0], "")
        
    return {
        "areas_vencedoras": areas_vencedoras,
        "texto_completo": resultado_texto,
        "imagem_url": imagem_url,
        "pontuacoes": pontuacoes
    }


# --- ROTEAMENTO DE ARQUIVOS ESTÁTICOS ---

@app.get("/")
def pagina_inicial():
    """
    Entrega o index.html principal de forma inteligente.
    """
    if os.path.exists(BASE_DIR / "index.html"):
        return FileResponse(BASE_DIR / "index.html")
    elif os.path.exists(STATIC_DIR / "index.html"):
        return FileResponse(STATIC_DIR / "index.html")
    return {"erro": "index.html nao foi encontrado em nenhuma pasta."}

# Mapeia a pasta /static (Caso o HTML procure por "static/style.css")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Mapeia a raiz do projeto (Caso o HTML procure por "style.css" na pasta principal)
app.mount("/", StaticFiles(directory=BASE_DIR), name="raiz")
## 🎯 Teste Vocacional Digital - API & Data Analytics

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Google Sheets API](https://img.shields.io/badge/Google%20Sheets%20API-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

Plataforma web interativa desenvolvida para aplicação de testes vocacionais direcionados a estudantes do Ensino Médio. O sistema processa as respostas em tempo real por meio de um algoritmo ponderado e realiza a persistência assíncrona dos dados para análise agregada de perfis (Exatas, Humanas e Biológicas).

🌐 **Aplicação em Produção:** 
[https://teste-vocacional-fastapi.onrender.com]
(https://teste-vocacional-fastapi.onrender.com)

---

## 📌 Sumário

- [Visão Geral e Impacto Social](#-visão-geral-e-impacto-social)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Estrutura do Banco / Tabela de Dados](#-estrutura-do-banco--tabela-de-dados)
- [Endpoints da API](#-endpoints-da-api)
---

## 🚀 Visão Geral e Impacto Social

O projeto visa mitigar a escassez de ferramentas acessíveis de orientação vocacional no ambiente escolar, oferecendo:
- **Resposta Instantânea:** Algoritmo de cálculo de afinidade com retorno imediato para o estudante.
- **Gestão Baseada em Dados (*Data for Good*):** Armazenamento estruturado de dados que permite a coordenações pedagógicas mapear o perfil vocacional de turmas e planejar feiras de profissões, oficinas e ações direcionadas.
- **Acessibilidade:** Interface leve e multiplataforma, otimizada para uso em smartphones e computadores.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Python 3, FastAPI, Pydantic, Uvicorn.
- **Persistência & Integração:** `gspread`, Google Sheets API (OAuth2 Service Account).
- **Processamento Assíncrono:** `BackgroundTasks` do FastAPI.
- **Frontend:** HTML5, CSS3, JavaScript (Fetch API, Audio API).
- **Hospedagem / Deployment:** Render.

---

## 📐 Arquitetura do Sistema

O pipeline de dados opera com separação entre a resposta ao cliente e o salvamento em banco/planilha, garantindo zero latência no frontend:

[ Client / Frontend ] ── (HTTP POST / JSON) ──► [ API FastAPI ]
                                                      │
     ┌────────────────────────────────────────────────┴────────────────────────────────┐
     ▼                                                                                 ▼
[ Resposta Imediata ]                                                         [ Background Task ]
(Retorna pontuação e perfil)                                              (Salva na planilha em 2º plano)
                                                                                       │
                                                                                       ▼
                                                                           [ Google Sheets API ]

---

## 📊 Estrutura do Banco / Tabela de Dados

Os registros enviados via API são gravados na planilha seguindo a estrutura abaixo:
| Coluna | Campo | Tipo | Descrição | Exemplo |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `usuario_id` | Varchar | Identificador único gerado automaticamente | `USR-8472` |
| **B** | `data_hora` | Datetime | Data e horário da submissão | `08/08/2026 14:30:00` |
| **C** | `nome` | Varchar | Nome do participante | `Maria Silva` |
| **D** | `telefone` | Varchar | WhatsApp / Contato informado | `(16) 99999-9999` |
| **E** | `area_vencedora` | Varchar | Perfil resultante (`EXATAS`, `HUMANAS`, `BIOLÓGICAS` ou `EMPATE`) | `EXATAS` |
| **F** | `exatas` | Float | Pontuação ponderada calculada em Exatas | `9.3` |
| **G** | `humanas` | Float | Pontuação ponderada calculada em Humanas | `3.3` |
| **H** | `biologicas` | Float | Pontuação ponderada calculada em Biológicas | `6.4` |

## 🔌 Endpoints da API
GET /api/perguntas
Sorteia e retorna uma amostra de perguntas cadastradas no pool.
Resposta (200 OK):
JSON
[
  {
    "id": 1,
    "texto": "Mexer nas configurações de apps para otimizar tudo é sua vibe?",
    "area": "exatas"
  }
]
POST /api/resultado
Processa as respostas do questionário, calcula as pontuações e agenda a gravação dos dados em segundo plano.
Body da Requisição:
JSON
{
  "nome": "Maria Silva",
  "telefone": "16999999999",
  "respostas": [
    { "pergunta_id": 1, "escolha": "SIM" },
    { "pergunta_id": 21, "escolha": "TALVEZ" }
  ]
}

Resposta (200 OK):
JSON
{
  "usuario_id": "USR-4819",
  "areas_vencedoras": ["EXATAS"],
  "texto_completo": "Seu perfil principal é: EXATAS! 🎯",
  "imagem_url": "/static/exatas.png",
  "pontuacoes": {
    "exatas": 9.3,
    "humanas": 3.3,
    "biologicas": 6.4
  }
}
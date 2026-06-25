Markdown

# 🧠 Teste Vocacional Inteligente — API REST & Frontend

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23f5d63b)

Uma aplicação Full-Stack simplificada que une uma API REST robusta desenvolvida em **FastAPI** a uma interface de usuário dinâmica e responsiva (HTML5, CSS3 e JavaScript Puro). 

O projeto foi estruturado para simular um cenário real de triagem e análise comportamental, aplicando lógica de algoritmos para processar dados de entrada e retornar diagnósticos personalizados com base em perfis de aptidão.

---

## 🎯 Funcionalidades Chave

* **Algoritmo de Randomização:** Seleção inteligente e randômica de 7 perguntas distintas a partir de um banco de dados estático contendo 60 questões mapeadas.
* **Processamento de Matriz de Respostas:** Endpoint preparado para receber e computar as respostas do usuário (`SIM` / `TALVEZ` / `NÃO`), aplicando pesos lógicos para a tomada de decisão.
* **Mapeamento de Aptidão:** Motor de regras que calcula e define a dominância entre três grandes áreas de conhecimento: *Exatas*, *Humanas* ou *Biológicas*.
* **Entrega Dinâmica de Asset:** Retorno estruturado via API contendo o diagnóstico textual e o caminho do asset visual (imagem) correspondente ao resultado final.

---

## 📂 Arquitetura e Estrutura do Projeto

O projeto adota uma estrutura limpa, onde o próprio servidor FastAPI fica responsável por expor os endpoints de dados e servir os arquivos estáticos da interface.

```text
├── main.py                 # Backend (Rotas da API REST, CORS e Servidor Estático)
├── requisitos.txt           # Gerenciador de Dependências do ecossistema Python
└── static/                 # Frontend Consumidor
    ├── index.html          # Estrutura da Interface de Usuário
    ├── style.css           # Estilização e Design Responsivo
    ├── vocacional.js       # Consumo Assíncrono da API (Fetch API)
    └── imagens/            # Assets visuais de retorno (exatas.png, humanas.png...).
```
---

## 🔌 Documentação da API (Endpoints REST)
1. Obter Perguntas do Teste

    Rota: GET /api/perguntas

    Descrição: Retorna uma lista de 7 perguntas sorteadas aleatoriamente do banco de dados de triagem.

    Resposta de Sucesso (JSON):
    JSON

    [
      {"id": 12, "texto": "Você gosta de resolver problemas de lógica?"},
      {"id": 45, "texto": "Você se interessa por anatomia humana?"}
    ]

2. Processar Resultado Vocacional

    Rota: POST /api/resultado

    Descrição: Recebe a matriz de respostas do usuário, calcula os pesos e retorna a área de maior afinidade profissional.

    Payload de Entrada (JSON):
    JSON

    {
      "respostas": [
        {"pergunta_id": 12, "valor": "SIM"},
        {"pergunta_id": 45, "valor": "NÃO"}
      ]
    }
---

## 🔧 Configuração e Execução do Ambiente
Pré-requisitos

    Python 3.8 ou superior instalado.

Passo a Passo

    Clone o repositório e acesse o diretório:
    Bash

    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio

    Crie e ative o seu ambiente virtual (Virtualenv):
    Bash

    # Linux/macOS
    python3 -m venv venv
    source venv/bin/activate

    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    Instale as dependências do projeto:
    Bash

    pip install -r requisitos.txt

    Inicie o servidor de desenvolvimento via Uvicorn:
    Bash

    uvicorn main:app --reload

    Acesse a aplicação:
    Abra o seu navegador e navegue até http://127.0.0.1:8000.

## 🛠️ Detalhes Técnicos de Implementação

    Suporte a CORS (Cross-Origin Resource Sharing): A API já possui Middleware de CORS totalmente configurado no main.py, permitindo que o backend seja consumido de forma desacoplada por servidores de frontend externos (ex: Live Server, Netlify, Vercel) sem bloqueios de segurança.

    Consumo Assíncrono: O arquivo vocacional.js faz uso de requisições assíncronas modernas (fetch com async/await), garantindo uma experiência de usuário fluida e sem recarregamentos de página (Single Page Application behavior).
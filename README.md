# Teste Vocacional

Aplicação simples de teste vocacional em Python com FastAPI e frontend estático.

## O que faz

- Sorteia 7 perguntas aleatórias de um banco de 60 perguntas.
- Recebe as respostas do usuário (SIM/TALVEZ/NÃO).
- Calcula as áreas de aptidão: `exatas`, `humanas` ou `biologicas`.
- Retorna um resultado com texto e imagem conforme a área vencedora.

## Estrutura do projeto

- `main.py` - backend em FastAPI com rotas da API e rota principal para servir o frontend.
- `requisitos.txt` - dependências do Python.
- `static/` - arquivos estáticos do frontend:
  - `index.html`
  - `style.css`
  - `vocacional.js`
  - imagens de resultado (`exatas.png`, `humanas.png`, `biologicas.png`)

## Dependências

Instale as dependências no ambiente virtual:

```bash
pip install -r requisitos.txt
```

## Como executar

1. Ative seu ambiente virtual.
2. Rode o servidor com o Uvicorn:

```bash
uvicorn main:app --reload
```

3. Abra no navegador:

```text
http://127.0.0.1:8000/
```

## Endpoints disponíveis

- `GET /api/perguntas` - retorna 7 perguntas sorteadas.
- `POST /api/resultado` - processa as respostas e retorna o resultado vocacional.

## Uso do frontend

O frontend faz chamada para a API em `static/vocacional.js` usando `fetch` para:

- `GET /api/perguntas`
- `POST /api/resultado`

Se você estiver usando outra origem, confira a configuração de CORS no `main.py`.

## Observações

- O projeto já habilita CORS para permitir o consumo da API de qualquer origem.
- O frontend e a API são servidos pelo mesmo aplicativo FastAPI.

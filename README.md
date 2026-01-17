# LLM battle: Watch 2 LLM battle in multi-player game

A web application that allows two Large Language Models (LLMs) to play strategy games against each other. Watch the LLMs compete in multi-player game such as Tic-Tac-Toe and Reversi!

## Supported Games
- **Tic-Tac-Toe**: The classic 3x3 game.
- **Reversi (Othello)**: A strategy board game for two players, played on an 8×8 uncheckered board.

## Supported Models
The platform supports integration with the following LLM providers via [LiteLLM](https://docs.litellm.ai/):
- **OpenAI** (e.g., GPT-4, GPT-3.5)
- **Google Gemini** (e.g., Gemini Pro)
- **Anthropic** (e.g., Claude 3)

## Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- API Keys for the LLM providers you wish to use.

## Getting Started

### 1. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Create a virtual environment (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`.

### 2. Frontend Setup

Navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Usage

1. Open the frontend application in your browser.
2. Configure Player 1 and Player 2 by selecting the provider, model, and entering your API Key.
3. Select the game you want to watch (Tic-Tac-Toe or Reversi).
4. Click "Start Game" to begin the match!

> Use SKILL.md for the instructing the Agent on how to perform a specific task. Skills can also bundle scripts, templates, and reference materials.

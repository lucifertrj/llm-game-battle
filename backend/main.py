import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from litellm import completion
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PlayerConfig(BaseModel):
    provider: str
    model: str
    api_key: str

class GameState(BaseModel):
    board: List[Optional[str]]  # 'X', 'O', or None/null
    turn: str # 'X' or 'O'
    history: List[Any] = []

class MoveRequest(BaseModel):
    player_config: PlayerConfig
    game_type: str # 'tictactoe' or 'reversi'
    board_state: List[Optional[str]]
    valid_moves: List[int]
    role: str # 'X' or 'O'

class MoveResponse(BaseModel):
    move: int
    reasoning: str

@app.post("/api/move", response_model=MoveResponse)
async def get_move(request: MoveRequest):
    try:
        # Set API Key based on provider
        if request.player_config.provider == "openai":
            os.environ["OPENAI_API_KEY"] = request.player_config.api_key
        elif request.player_config.provider == "gemini":
            os.environ["GEMINI_API_KEY"] = request.player_config.api_key
        elif request.player_config.provider == "anthropic":
            os.environ["ANTHROPIC_API_KEY"] = request.player_config.api_key
        
        # Construct Prompt
        # Construct Prompt
        board_visual = ""
        if request.game_type == "tictactoe":
            # Create a visual representation of the board
            board = request.board_state
            board_visual = f"""
             {board[0] or 0} | {board[1] or 1} | {board[2] or 2}
            ---+---+---
             {board[3] or 3} | {board[4] or 4} | {board[5] or 5}
            ---+---+---
             {board[6] or 6} | {board[7] or 7} | {board[8] or 8}
            """
        
        prompt = f"""
        You are an expert Tic-Tac-Toe player. You are playing as {request.role}.
        The opponent is playing as {'O' if request.role == 'X' else 'X'}.
        
        Current Board State (indices 0-8):
        {board_visual}
        
        Valid moves (indices) are: {request.valid_moves}.
        
        Your Goal: Win the game or force a draw. Do NOT lose.
        
        Strategy (in order of priority):
        1. WIN: Check if YOU have 2 in a row/column/diagonal. If yes, take the winning spot IMMEDIATELY. This is the highest priority.
        2. BLOCK: Check if the OPPONENT has 2 in a row/column/diagonal. If yes, block them.
        3. CENTER: If the center (4) is available, take it.
        4. CORNER: If a corner (0, 2, 6, 8) is available, take it.
        5. SIDE: Take any available side (1, 3, 5, 7).
        
        CRITICAL: You MUST check for a winning move (Strategy #1) before considering blocking (Strategy #2). If you can win, do it!
        
        Think step-by-step:
        - First, look for YOUR winning moves.
        - Second, look for OPPONENT'S winning moves (to block).
        - Third, apply positional strategy (Center/Corner/Side).
        
        Your response must be a valid JSON object with two fields:
        1. "reasoning": A concise explanation of your strategy (e.g., "Blocking opponent at 2", "Taking center").
        2. "move": The index of the move you want to make (must be one of {request.valid_moves}).
        
        Example response:
        {{
            "reasoning": "Opponent has X at 0 and 1, blocking at 2.",
            "move": 2
        }}
        """

        messages = [{"role": "user", "content": prompt}]
        
        model_name = request.player_config.model
        if request.player_config.provider == "gemini" and not model_name.startswith("gemini/"):
            model_name = f"gemini/{model_name}"
        
        response = completion(
            model=model_name,
            messages=messages,
            response_format={ "type": "json_object" }
        )
        
        content = response.choices[0].message.content
        import json
        try:
            result = json.loads(content)
            move = int(result.get("move"))
            reasoning = result.get("reasoning", "")
            
            if move not in request.valid_moves:
                 # Fallback if LLM hallucinates an invalid move, though we should probably retry or error.
                 # For now, let's error to let the frontend handle it or retry.
                 raise ValueError(f"Invalid move {move} selected by LLM.")
                 
            return MoveResponse(move=move, reasoning=reasoning)
        except Exception as e:
            print(f"Error parsing LLM response: {content}")
            raise HTTPException(status_code=500, detail=f"Failed to parse LLM response: {str(e)}")

    except Exception as e:
        print(f"Error in get_move: {str(e)}")
        error_msg = str(e)
        status_code = 500
        if "AuthenticationError" in error_msg:
            status_code = 401
        elif "NotFoundError" in error_msg:
            status_code = 404
        elif "RateLimitError" in error_msg:
            status_code = 429
            
        raise HTTPException(status_code=status_code, detail=error_msg)

@app.get("/health")
def health_check():
    return {"status": "ok"}

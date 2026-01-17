---
name: llm-arena-backend
description: FastAPI Python backend for LLM Arena game server. Use when working on API endpoints, LLM provider integration via LiteLLM, game move processing, prompt engineering for AI players, error handling, or backend testing.
compatibility: Python 3.10+, FastAPI, LiteLLM, network access required for LLM API calls
metadata:
  tags: "fastapi, python, llm, api"
---

# LLM Arena Backend Skill

## When to Use This Skill

Use this skill when:
- Creating or modifying API endpoints
- Integrating new LLM providers
- Engineering prompts for game AI
- Handling LLM response parsing
- Debugging API errors
- Writing backend tests
- Configuring CORS or middleware

## Directory Structure

```
backend/
├── SKILL.md            # This file
├── main.py             # FastAPI application with all endpoints
├── requirements.txt    # Python dependencies
└── test_game.py        # Test scenarios for game logic
```

## MCP Server Integration

### Sequential Thinking MCP

Use for complex backend reasoning tasks:

**Prompt Engineering:**
```
Think step-by-step about creating an optimal game prompt:
Step 1: What game state information does the LLM need?
Step 2: How should winning/blocking moves be prioritized?
Step 3: What output format ensures valid, parseable moves?
Step 4: How to handle edge cases (full board, no valid moves)?
Step 5: What examples help the LLM understand the task?
```

**Debugging API Errors:**
```
Analyze this 500 error step-by-step:
Step 1: What endpoint was called and with what data?
Step 2: At what point in the code did execution fail?
Step 3: What external dependencies were involved?
Step 4: What are the possible root causes?
Step 5: How to fix and prevent recurrence?
```

### Qdrant MCP Server

Store and retrieve backend-specific knowledge:

**Storage Keys:**
```
llm-arena:backend:progress:{timestamp}         # Progress snapshots
```

- After the completion of every task store the progress in Qdrant vector store using **qdrant-store**
- Save the progress in the format progress.md
- The file needs to include: TODO TASK, IN PROGRESS TASK, COMPLETED TASK


### Context7 MCP

Pull live documentation for:
- **FastAPI:** Middleware, dependencies, request/response models
- **LiteLLM:** Provider configuration, model names, error handling
- **Pydantic:** Model validation, field constraints, serialization
- **Python:** Async patterns, exception handling, JSON parsing

**Example:**
```
Context7: Get latest FastAPI CORS middleware configuration
Context7: Get LiteLLM Gemini provider model naming conventions
Context7: Get Pydantic v2 validator syntax
```

## API Reference

### POST /api/move

Process a game move request from an LLM player.

**Request Schema:**
```python
class MoveRequest(BaseModel):
    player_config: PlayerConfig  # Provider, model, API key
    game_type: str               # 'tictactoe' or 'reversi'
    board_state: List[Optional[str]]  # Current board
    valid_moves: List[int]       # Available move indices
    role: str                    # 'X' or 'O'

class PlayerConfig(BaseModel):
    provider: str   # 'openai', 'anthropic', 'gemini'
    model: str      # Model identifier
    api_key: str    # API key for provider
```

**Response Schema:**
```python
class MoveResponse(BaseModel):
    move: int       # Selected move index
    reasoning: str  # Explanation of the move
```

## Common Pitfalls

### 1. JSON Parsing Failures

**Problem:** LLM returns markdown-wrapped JSON or malformed response
**Symptoms:** `json.JSONDecodeError`, 500 errors
**Solution:**
```python
content = response.choices[0].message.content

# Strip markdown code blocks
content = content.strip()
if content.startswith("```json"):
    content = content[7:]
elif content.startswith("```"):
    content = content[3:]
if content.endswith("```"):
    content = content[:-3]
content = content.strip()

try:
    result = json.loads(content)
except json.JSONDecodeError as e:
    # Log the problematic response for debugging
    print(f"Failed to parse: {content[:200]}")
    raise HTTPException(status_code=500, detail=f"Invalid JSON from LLM: {str(e)}")
```

### 2. Invalid Move Selection

**Problem:** LLM hallucinates a move outside valid_moves
**Symptoms:** Game crashes or invalid state
**Solution:**
```python
move = result.get("move")

# Validate move
if move is None:
    raise HTTPException(status_code=500, detail="LLM response missing 'move' field")

try:
    move = int(move)
except (ValueError, TypeError):
    raise HTTPException(status_code=500, detail=f"Invalid move type: {type(move)}")

if move not in request.valid_moves:
    # Option 1: Return error
    raise HTTPException(
        status_code=500, 
        detail=f"LLM selected invalid move {move}. Valid: {request.valid_moves}"
    )
    
    # Option 2: Fallback to random valid move (less strict)
    # import random
    # move = random.choice(request.valid_moves)
    # reasoning = f"Fallback (LLM chose invalid: {result.get('move')})"
```

### 3. Provider Model Name Mismatch

**Problem:** LiteLLM doesn't recognize the model
**Symptoms:** 404 errors, "Model not found"
**Solution:**
```python
model_name = request.player_config.model

# Normalize model names per provider
if request.player_config.provider == "gemini":
    if not model_name.startswith("gemini/"):
        model_name = f"gemini/{model_name}"

# OpenAI and Anthropic models work as-is with LiteLLM
# Examples:
#   OpenAI: gpt-4o, gpt-4-turbo, gpt-3.5-turbo
#   Anthropic: claude-3-opus-20240229, claude-3-sonnet-20240229
#   Gemini: gemini/gemini-2.5-pro, gemini/gemini-2.5-flash
```
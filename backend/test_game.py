import requests
import json
import os

# Configuration
API_URL = "http://127.0.0.1:8000/api/move"
# You can set these environment variables before running the script if needed, 
# but the backend should pick up the ones set in its environment or passed in the request.
# For this test, we assume the backend is running and has access to keys or we pass dummy keys if using a mock.
# We'll use a dummy key and provider for now, assuming the user has configured the backend.
# If the backend fails with auth error, we'll know.

def test_move(scenario_name, board, valid_moves, role, expected_moves=None, unexpected_moves=None):
    print(f"\n--- Testing Scenario: {scenario_name} ---")
    print(f"Board: {board}")
    print(f"Role: {role}")
    
    # Read key from .env
    api_key = "dummy_key"
    try:
        with open(os.path.join(os.path.dirname(__file__), "../.env"), "r") as f:
            content = f.read().strip()
            if content.startswith("sk-"):
                api_key = content
    except:
        pass

    payload = {
        "player_config": {
            "provider": "openai", 
            "model": "gpt-4o",
            "api_key": api_key
        },
        "game_type": "tictactoe",
        "board_state": board,
        "valid_moves": valid_moves,
        "role": role
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code == 200:
            result = response.json()
            move = result["move"]
            reasoning = result["reasoning"]
            print(f"AI Move: {move}")
            print(f"Reasoning: {reasoning}")
            
            if expected_moves and move in expected_moves:
                print("✅ SUCCESS: AI made a good move.")
            elif unexpected_moves and move in unexpected_moves:
                print("❌ FAILURE: AI made a bad move.")
            else:
                print("⚠️  UNCERTAIN: Move was not explicitly expected or unexpected.")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

if __name__ == "__main__":
    # Scenario 1: Win immediately
    # X | X | .
    # O | O | .
    # . | . | .
    # X to play. Winning move is 2.
    board_win = ["X", "X", None, "O", "O", None, None, None, None]
    valid_moves_win = [2, 5, 6, 7, 8]
    test_move("Win Immediately", board_win, valid_moves_win, "X", expected_moves=[2])

    # Scenario 2: Block opponent
    # O | O | .
    # X | . | .
    # . | . | .
    # X to play. Opponent (O) has 0 and 1. Must block at 2.
    board_block = ["O", "O", None, "X", None, None, None, None, None]
    valid_moves_block = [2, 4, 5, 6, 7, 8]
    test_move("Block Opponent", board_block, valid_moves_block, "X", expected_moves=[2])

    # Scenario 3: Center Strategy
    # . | . | .
    # . | . | .
    # . | . | .
    # X to play. Best move is Center (4).
    board_start = [None] * 9
    valid_moves_start = list(range(9))
    test_move("Opening Move", board_start, valid_moves_start, "X", expected_moves=[4, 0, 2, 6, 8]) # Center or Corner

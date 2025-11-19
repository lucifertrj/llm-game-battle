import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getLLMMove = async (playerConfig, gameType, boardState, validMoves, role) => {
    try {
        const response = await axios.post(`${API_URL}/move`, {
            player_config: playerConfig,
            game_type: gameType,
            board_state: boardState,
            valid_moves: validMoves,
            role: role
        });
        return response.data;
    } catch (error) {
        console.error("Error getting LLM move:", error);
        throw error;
    }
};

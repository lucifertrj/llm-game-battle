import { useState, useEffect, useCallback, useRef } from 'react';
import { getLLMMove } from '../services/api';

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const DIRECTIONS = [-9, -8, -7, -1, 1, 7, 8, 9]; // For 8x8 board (Reversi)

export function useGameLogic(gameType, players) {
    const [board, setBoard] = useState([]);
    const [turn, setTurn] = useState('X'); // 'X' (P1/Black) or 'O' (P2/White)
    const [winner, setWinner] = useState(null);
    const [logs, setLogs] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const gameOverRef = useRef(false);

    // Initialize Board
    useEffect(() => {
        gameOverRef.current = false;
        if (gameType === 'tictactoe') {
            setBoard(Array(9).fill(null));
        } else if (gameType === 'reversi') {
            const initialBoard = Array(64).fill(null);
            // Standard Reversi setup:
            // 27: White (O), 28: Black (X)
            // 35: Black (X), 36: White (O)
            // Wait, standard is:
            // 3,3 (27) -> White
            // 3,4 (28) -> Black
            // 4,3 (35) -> Black
            // 4,4 (36) -> White
            // Let's stick to X=Black (starts), O=White
            initialBoard[27] = 'O';
            initialBoard[28] = 'X';
            initialBoard[35] = 'X';
            initialBoard[36] = 'O';
            setBoard(initialBoard);
        }
        setTurn('X');
        setWinner(null);
        setLogs([]);
    }, [gameType]);

    const checkTicTacToeWinner = (currentBoard) => {
        for (let combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        if (!currentBoard.includes(null)) return 'Draw';
        return null;
    };

    const getReversiFlips = (currentBoard, moveIdx, player) => {
        const opponent = player === 'X' ? 'O' : 'X';
        let flips = [];

        const r = Math.floor(moveIdx / 8);
        const c = moveIdx % 8;

        for (let dir of DIRECTIONS) {
            let currentFlips = [];
            let i = moveIdx + dir;

            while (i >= 0 && i < 64) {
                const cr = Math.floor(i / 8);
                const cc = i % 8;

                // Check for wrap-around (important for 1D array logic)
                const pr = Math.floor((i - dir) / 8);
                const pc = (i - dir) % 8;
                if (Math.abs(cr - pr) > 1 || Math.abs(cc - pc) > 1) break;

                if (currentBoard[i] === opponent) {
                    currentFlips.push(i);
                } else if (currentBoard[i] === player) {
                    if (currentFlips.length > 0) {
                        flips = [...flips, ...currentFlips];
                    }
                    break;
                } else {
                    break; // Empty or null
                }
                i += dir;
            }
        }
        return flips;
    };

    const getValidMoves = useCallback((currentBoard, currentTurn) => {
        if (gameType === 'tictactoe') {
            return currentBoard.map((cell, idx) => cell === null ? idx : null).filter(val => val !== null);
        } else if (gameType === 'reversi') {
            const moves = [];
            for (let i = 0; i < 64; i++) {
                if (currentBoard[i] === null) {
                    const flips = getReversiFlips(currentBoard, i, currentTurn);
                    if (flips.length > 0) {
                        moves.push(i);
                    }
                }
            }
            return moves;
        }
        return [];
    }, [gameType]);

    const makeMove = async () => {
        if (winner || isThinking || gameOverRef.current) return;

        const currentPlayerConfig = turn === 'X' ? players.p1 : players.p2;
        const validMoves = getValidMoves(board, turn);

        if (validMoves.length === 0) {
            if (gameType === 'reversi') {
                // Pass turn
                console.log(`No moves for ${turn}, passing.`);
                const nextTurn = turn === 'X' ? 'O' : 'X';
                const nextValidMoves = getValidMoves(board, nextTurn);
                if (nextValidMoves.length === 0) {
                    // Game Over
                    gameOverRef.current = true;
                    const xCount = board.filter(c => c === 'X').length;
                    const oCount = board.filter(c => c === 'O').length;
                    setWinner(xCount > oCount ? 'X' : (oCount > xCount ? 'O' : 'Draw'));
                    return;
                }
                setTurn(nextTurn);
                return;
            }
            // TicTacToe draw is handled in checkWinner, so this shouldn't happen unless board is full
            return;
        }

        setIsThinking(true);
        try {
            const response = await getLLMMove(
                currentPlayerConfig,
                gameType,
                board,
                validMoves,
                turn
            );

            const moveIdx = response.move;
            const reasoning = response.reasoning;

            setLogs(prev => [...prev, { player: turn, move: moveIdx, reasoning }]);

            const newBoard = [...board];
            newBoard[moveIdx] = turn;

            if (gameType === 'reversi') {
                const flips = getReversiFlips(board, moveIdx, turn);
                flips.forEach(idx => {
                    newBoard[idx] = turn;
                });
            }

            setBoard(newBoard);

            // Check Win
            let newWinner = null;
            if (gameType === 'tictactoe') {
                newWinner = checkTicTacToeWinner(newBoard);
            } else {
                // Reversi end check (board full or no moves)
                // We check "no moves" at start of next turn, but check full board here
                if (!newBoard.includes(null)) {
                    const xCount = newBoard.filter(c => c === 'X').length;
                    const oCount = newBoard.filter(c => c === 'O').length;
                    newWinner = xCount > oCount ? 'X' : (oCount > xCount ? 'O' : 'Draw');
                }
            }

            if (newWinner) {
                setWinner(newWinner);
                gameOverRef.current = true;
            } else {
                setTurn(turn === 'X' ? 'O' : 'X');
            }

        } catch (error) {
            console.error("Move error:", error);
            const errorMessage = error.response?.data?.detail || error.message || "Unknown error";
            alert(`Error: ${errorMessage}`);
            setIsThinking(false); // Ensure we stop thinking state
            return; // Stop execution
        } finally {
            setIsThinking(false);
        }
    };

    // Auto-play effect
    useEffect(() => {
        if (!winner && players && !gameOverRef.current) {
            const timer = setTimeout(() => {
                makeMove();
            }, 1500); // Delay for visual pacing
            return () => clearTimeout(timer);
        }
    }, [board, turn, winner, players]);

    return { board, turn, winner, logs, isThinking };
}

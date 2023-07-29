import type { Square } from "chess.js";

export const getPieceImage = (piece: string, piece_color: string) => {
    const pieceNames: { [key: string]: string } = {
        r: 'rook',
        n: 'knight',
        b: 'bishop',
        q: 'queen',
        p: 'pawn',
        k: 'king'
    };
    const pieceName = pieceNames[piece];
    const pieceColor = piece_color === 'w' ? 'white' : 'black';
    return `/pieces/${pieceName}_${pieceColor}.svg`;
};

export const getSquare = (rank: string, file: string): Square => {
    const s: Square = (file + rank) as Square;
    return s;
};
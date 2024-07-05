import React, {useState} from 'react';
import Chessboard from './chessboard/Chessboard';
import ChessboardClass from "../ChessboardClass";
import { moveKnight } from './pieceLogic/knightLogic.ts';
import { movePawn } from './pieceLogic/pawnLogic.ts';
import { moveBishop } from './pieceLogic/bishopLogic.ts';
import { moveRook } from './pieceLogic/rookLogic.ts';
import { moveQueen } from './pieceLogic/queenLogic.ts';
import { moveKing } from './pieceLogic/kingLogic.ts';

const Game = () => {

    const startingBoard = new ChessboardClass();
    const [chessboard, setChessboard] = useState(startingBoard);
    //selectedPiece is an aarray: [rank, file, (letter representing the piece)]
    const [selectedPiece, setSelectedPiece] = useState(undefined);

    const onClick = function(rank, file, piece) {
        
        // If there's a selected piece, handle the move logic
        if (selectedPiece !== undefined) {
            alert("There's already a selected piece.");
            handleMove(rank, file, selectedPiece[2]);
            return;
        }

        if(!piece) { // If there's no piece on clicked square, terminate the function
            alert("Function terminated because there's no piece on clicked square.");
            return;
        }
        let pieceColor;
        if(piece === piece.toUpperCase()) {
            // It is a white piece because white pieces are uppercase.
            pieceColor = "w";
        } else {
            // Else it must be a black piece.
            pieceColor = "b";
        }
        if(pieceColor !== chessboard.getActiveColor()) {
            // If the clicked piece is not the same color as current
            // player, terminate the function.
            alert(`Terminated because clicked piece is not the same color as active player. Piece color: ${pieceColor}. Active color: ${chessboard.getActiveColor()}`);
            return;
        }
        if(selectedPiece === undefined)  {
            // If there's no currently selected piece, store one
            // and terminate the function.
            setSelectedPiece([rank, file, piece]);
            return;
        }
        if(selectedPiece !== undefined) {
            if((file + rank) === (selectedPiece[1] + selectedPiece[0])) {
                // If there's a selected piece and the same piece is clicked,
                // unselect it.
                setSelectedPiece(undefined);
                return;
            }
        }
    }

    const handleMove = (rank, file, piece) => {

        const destinationSquare = [rank, file];

        // Run the appropriate function depending on which piece is being moved.
        switch(piece.toLowerCase()) {
            case "p":
                movePawn(selectedPiece, destinationSquare, chessboard);
                break;
            case "r":
                moveRook(selectedPiece, destinationSquare, chessboard);
                break;
            case "n":
                moveKnight(selectedPiece, destinationSquare, chessboard);
                break;
            case "b":
                moveBishop(selectedPiece, destinationSquare, chessboard);
                break;
            case "q":
                moveQueen(selectedPiece, destinationSquare, chessboard);
                break;
            case "k":
                moveKing(selectedPiece, destinationSquare, chessboard);
                break;
            default:
                alert("Unknown piece type.");
        }
        setSelectedPiece(undefined);
    }

    return (
        <div className="game">
            {/* Other components for displaying game information */}
            <Chessboard fen={chessboard.getFen()} board={chessboard.getBoard()} onClick={onClick} selectedPiece={selectedPiece} />
        </div>
    );
};

export default Game;
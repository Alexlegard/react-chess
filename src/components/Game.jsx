import React, {useState} from 'react';
import Chessboard from './chessboard/Chessboard';
import ChessboardClass from '../ChessboardClass';
import PromotionPopup from './util/PromotionPopup.tsx';
import { moveKnight } from './pieceLogic/knightLogic.ts';
import { movePawn } from './pieceLogic/pawnLogic.ts';
import { moveBishop } from './pieceLogic/bishopLogic.ts';
import { moveRook } from './pieceLogic/rookLogic.ts';
import { moveQueen } from './pieceLogic/queenLogic.ts';
import { moveKing } from './pieceLogic/kingLogic.ts';

const Game = () => {

    const startingBoard = new ChessboardClass();
    const [chessboard, setChessboard] = useState(startingBoard);
    //selectedPiece is an array: [rank, file, (letter representing the piece)]
    const [selectedPiece, setSelectedPiece] = useState(undefined);
    const [isPromotionPending, setIsPromotionPending] = useState(false);
    const [promotionData, setPromotionData] = useState(null);

    const onClick = function(rank, file, piece) {

        // If promotion is pending, don't allow clicks (on the board)
        if(isPromotionPending) {
            return;
        }
        
        // If there's a selected piece, handle the move logic
        if (selectedPiece !== undefined) {
            handleMove(rank, file, selectedPiece[2]);
            return;
        }

        if(!piece) { // If there's no piece on clicked square, terminate the function
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
                movePawn(selectedPiece, destinationSquare, chessboard, onPromotionNeeded);
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
        chessboard.isMate();
        alert(chessboard.result);
    }

    const onPromotionNeeded = (destinationRank, destinationFile, color) => {
        setIsPromotionPending(true);
        setPromotionData([destinationRank, destinationFile, color]);
    }

    const handlePromotion = (piece) => {
        switch(piece) {
            case "q":
                setIsPromotionPending(false);
                chessboard.promotePawn(promotionData[0][1], promotionData[0][0], promotionData[1][1], promotionData[1][0], "q");
                chessboard.deselectEnPassantTarget();
                setPromotionData(null);
                return;
            case "r":
                setIsPromotionPending(false);
                chessboard.promotePawn(promotionData[0][1], promotionData[0][0], promotionData[1][1], promotionData[1][0], "r");
                chessboard.deselectEnPassantTarget();
                setPromotionData(null);
                return;
            case "n":
                setIsPromotionPending(false);
                chessboard.promotePawn(promotionData[0][1], promotionData[0][0], promotionData[1][1], promotionData[1][0], "n");
                chessboard.deselectEnPassantTarget();
                setPromotionData(null);
                return;
            case "b":
                setIsPromotionPending(false);
                chessboard.promotePawn(promotionData[0][1], promotionData[0][0], promotionData[1][1], promotionData[1][0], "b");
                chessboard.deselectEnPassantTarget();
                setPromotionData(null);
                return;
        }
    }

    const handleCancelPromotion = () => {
        setIsPromotionPending(false);
        setPromotionData(null);
        return;
    }

    return (
        <div className="game">
            <Chessboard fen={chessboard.getFen()} board={chessboard.getBoard()} onClick={onClick} selectedPiece={selectedPiece} />
            {isPromotionPending && (
                <PromotionPopup
                    onPromote={handlePromotion}
                    onCancel={handleCancelPromotion}
                    color={chessboard.getActiveColor()}
                />
            )}
            <div className='debug' style={{ color: 'white' }}>
                <div>{chessboard.enPassantTarget}</div>
            </div>
        </div>
    );
};

export default Game;

//TODO: Implement checkmate detection and end the game
//TODO: 1) Create the isCheckmateOrStalemate function
//TODO: 2) isCheckmateOrStalemate calls findAValidMove to make sure there's at least
//TODO: one valid move for the current player.
//TODO: 3) This function tries every square until it finds a piece belonging to
//TODO: that player. Then it calls the function getAllPossibleMovesForPiece.
//TODO: 4) Depending on which piece it is passed, getAllPossibleMovesForPiece calls
//TODO: the piece-specific function getAllPossiblePawnMoves, getAllPossibleRookMoves,
//TODO: and so forth.
//TODO: 5) I'll think about the specific details of these piece-specific functions later.
import ChessboardClass from "../../ChessboardClass";
/*
 * @param {Array} originalSquare - Array containing the rank, then file of the pawn's home square,
 *   and the letter p or P
 * @param {Array} destinationSquare - Array containing the rank, file, and piece occupying the destination square
 * @param {Chessboard} board - Chessboard instance representing the current board state
 * @returns {Void}
 * 
 */
export const movePawn = (originalSquare: any[], destinationSquare: any[], board: ChessboardClass): void => {
    debugger;
    // Determine if it's the pawn's first move.
    let pawnCanMoveTwoSquares = false;
    if(originalSquare[0] === '2' && board.activeColor === "w" ||
        originalSquare[0] === '7' && board.activeColor === "b") {
        pawnCanMoveTwoSquares = true;
    }

    if(pawnCanMoveTwoSquares) {
        makePawnFirstMove(originalSquare, destinationSquare, board);
    }
    else {
        makePawnNonFirstMove(originalSquare, destinationSquare, board);
    }

}

function makePawnFirstMove(originalSquare, destinationSquare, board) {
    debugger;
    // Check if the move matches the pattern of a valid pawn move.
    if(matchesPawnFirstMovePattern(originalSquare, destinationSquare, board)) {

            // Check if the two squares in front of the pawn are empty
            if(board.isSquareEmpty(destinationSquare[1], destinationSquare[0]) && board.isPathEmpty(originalSquare, destinationSquare)) {
                board.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
            }
    }
}

function makePawnNonFirstMove(originalSquare, destinationSquare, board) {
    debugger;
    // Check if the move matches the pattern of a pawn move
    if(matchesPawnNonFirstMovePattern(originalSquare, destinationSquare, board)) {
        
        // check if the square in front of the pawn is empty.
        if(board.isSquareEmpty(destinationSquare[1], destinationSquare[0])) {
            board.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
        }
    }
}

function matchesPawnFirstMovePattern(originalSquare, destinationSquare, board) {
    debugger;
    return (originalSquare[1] === destinationSquare[1] && 
        board.activeColor === "w" && (destinationSquare[0] - originalSquare[0] === 1 || destinationSquare[0] - originalSquare[0] === 2) ||
        board.activeColor === "b" && (destinationSquare[0] - originalSquare[0] === -1 || destinationSquare[0] - originalSquare[0] === -2));
}

function matchesPawnNonFirstMovePattern(originalSquare, destinationSquare, board) {
    debugger;
    return (originalSquare[1] === destinationSquare[1] && 
        board.activeColor === "w" && (destinationSquare[0] - originalSquare[0] === 1) ||
        board.activeColor === "b" && (destinationSquare[0] - originalSquare[0] === -1));
}


















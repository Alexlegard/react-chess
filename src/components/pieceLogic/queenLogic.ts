import ChessboardClass from "../../ChessboardClass";
import { validateMoveSafety } from "../../validateMoveSafety";
/*
 * @param {Array} originalSquare - Array containing the rank and file of the knight's home square,
 *   and the letter n or N
 * @param {Array} destinationSquare - Array containing the rank, file, and piece occupying the destination square
 * @param {Chessboard} board - Chessboard instance representing the current board state
 * @returns {Void}
 * 
 */
export const moveQueen = (originalSquare: any[], destinationSquare: any[], board: ChessboardClass): void => {

    debugger;

    // Calculate the rank and file difference. The queen is a hybrid between a rook and bishop, so logically,
    // the condition that allows the queen to move should be a combination of the rook and bishop.
    // ie. (isRookMove) || (isBishopMove)
    const rankDiff = Math.abs(originalSquare[0] - destinationSquare[0]);
    const asciiOfOriginalFile = originalSquare[1].charCodeAt(0);
    const asciiOfDestinationFile = destinationSquare[1].charCodeAt(0);
    const fileDiff = Math.abs(asciiOfOriginalFile - asciiOfDestinationFile);

    const horizontalMove = rankDiff == 0 && fileDiff >= 1;
    const verticalMove = rankDiff >= 1 && fileDiff == 0;
    const diagonalMove = ( rankDiff === fileDiff && rankDiff > 0 );

    // The queen may move either horizontally, vertically, or diagonally
    if( horizontalMove || verticalMove || diagonalMove ) {

        // Check if the path to that square is empty
        if(board.isPathEmpty(originalSquare, destinationSquare)) {

            // Simulate and test the move's safety
            if(validateMoveSafety(board.board, [originalSquare[0], originalSquare[1]],
                [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {

                // If the destination square is empty, move there
                if(board.isSquareEmpty(destinationSquare[1], destinationSquare[0])) {
                    board.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
                }
                // If the destination square is occupied by an enemy piece, capture it.
                if(board.isSquareOccupiedByEnemyPiece(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2])) {
                    board.captureEnemyPiece(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
                }
            }
        }
    }
}
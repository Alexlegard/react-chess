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
export const moveKnight = (originalSquare: any[], destinationSquare: any[], board: ChessboardClass): void => {

    debugger;
    // Calculate the rank and file difference, which we need to calculate valid knight moves
    const rankDiff = Math.abs(originalSquare[0] - destinationSquare[0]);
    const asciiOfOriginalFile = originalSquare[1].charCodeAt(0);
    const asciiOfDestinationFile = destinationSquare[1].charCodeAt(0);
    const fileDiff = Math.abs(asciiOfOriginalFile - asciiOfDestinationFile);

    // Check if it matches the pattern of a valid knight move: 2 squares in one direction and one square perpendicular.
    if((rankDiff === 2 && fileDiff === 1) || (rankDiff === 1 && fileDiff === 2)) {

        //Check if the destination square is empty, occupied by a friendly piece, or an enemy piece
        if(board.isSquareEmpty(destinationSquare[1], destinationSquare[0])) {
            debugger;
            //alert(`Params: ${board.board.map(row => [...row])}, ${[originalSquare[0], originalSquare[1]]}, ${[destinationSquare[0], destinationSquare[1]]}, ${originalSquare[2]}, ${board.activeColor}`);
            if(validateMoveSafety(board.board.map(row => [...row]), [originalSquare[0], originalSquare[1]],
                [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {
                    board.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
            }
        }
        // If the destination square contains an enemy piece, we need to do a capture.
        if(board.isSquareOccupiedByEnemyPiece(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2])) {
            debugger;
            if(validateMoveSafety(board.board.map(row => [...row]), [originalSquare[0], originalSquare[1]],
                [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {
                    board.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
            }
        }  
    }
}
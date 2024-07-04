import ChessboardClass from "../../ChessboardClass";

/*
 * @param {Array} originalSquare - Array containing the rank and file of the knight's home square,
 *   and the letter n or N
 * @param {Array} destinationSquare - Array containing the rank, file, and piece occupying the destination square
 * @param {Chessboard} board - Chessboard instance representing the current board state
 * @returns {Void}
 * 
 */
export const moveRook = (originalSquare: any[], destinationSquare: any[], board: ChessboardClass): void => {

    debugger;

    // Calculate the rank and file difference. The rook should only move if the rank difference is at
    // least 1and the file difference 0, OR the file difference is at least 1 and the rank difference 0.
    const rankDiff = Math.abs(originalSquare[0] - destinationSquare[0]);
    const asciiOfOriginalFile = originalSquare[1].charCodeAt(0);
    const asciiOfDestinationFile = destinationSquare[1].charCodeAt(0);
    const fileDiff = Math.abs(asciiOfOriginalFile - asciiOfDestinationFile);

    if( rankDiff >= 1 && fileDiff == 0 ||
        rankDiff == 0 && fileDiff >= 1
     ) {
        // Check if the destination square is empty, and the path to that square is empty.
        if( board.isSquareEmpty(destinationSquare[1], destinationSquare[0]) && board.isPathEmpty(originalSquare, destinationSquare) ) {
            alert("Destination square is empty and the path to that square is empty.");
            board.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
        }
    }
}
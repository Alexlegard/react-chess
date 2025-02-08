import ChessboardClass from "../../ChessboardClass";
import { validateMoveSafety, canAnyWhitePieceAttackSquare, canAnyBlackPieceAttackSquare } from "../../validateMoveSafety";
/*
 * @param {Array} originalSquare - Array containing the rank and file of the knight's home square,
 *   and the letter n or N
 * @param {Array} destinationSquare - Array containing the rank, file, and piece occupying the destination square
 * @param {Chessboard} board - Chessboard instance representing the current board state
 * @returns {Void}
 * 
 */
export const moveKing = (originalSquare: any[], destinationSquare: any[], board: ChessboardClass): void => {

    const originalSquareReadable = originalSquare[1] + originalSquare[0];
    const destinationSquareReadable = destinationSquare[1] + destinationSquare[0];

    // Calculate the rank and file difference. If rankDiff + fileDiff = 1, the king can move (horizontally)
    // If rankDiff and fileDiff are 1, the king can move (diagonally)
    const rankDiff = Math.abs(originalSquare[0] - destinationSquare[0]);
    const asciiOfOriginalFile = originalSquare[1].charCodeAt(0);
    const asciiOfDestinationFile = destinationSquare[1].charCodeAt(0);
    const fileDiff = Math.abs(asciiOfOriginalFile - asciiOfDestinationFile);

    const canMoveHorizontally = (rankDiff + fileDiff === 1);
    const canMoveDiagonally = (rankDiff === 1 && fileDiff === 1);

    // The king may move horizontally or diagonally, one square.
    if( canMoveHorizontally || canMoveDiagonally ) {
        // Check if the destination square is empty
        if(board.isSquareEmpty(destinationSquare[1], destinationSquare[0])) {
            if(validateMoveSafety(board.board.map(row => [...row]), [originalSquare[0], originalSquare[1]],
                [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {
                board.removeCastlingRights(board.activeColor);
                board.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
            }
        }
        // Check if the destination square is occupied by an enemy piece.
        if(board.isSquareOccupiedByEnemyPiece(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2])) {
            if(validateMoveSafety(board.board.map(row => [...row]), [originalSquare[0], originalSquare[1]],
                [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {
                board.removeCastlingRights(board.activeColor);
                board.captureEnemyPiece(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
            }
        }
    }

    // Individually check for each of the four forms of castling.
    if(originalSquareReadable === "e1" && destinationSquareReadable === "g1" &&
        board.isSquareEmpty("f", 1) && board.isSquareEmpty("g", 1) && board.whiteCanCastleKingside &&
        !canAnyBlackPieceAttackSquare(board.board.map(row => [...row]), [7, 4]) &&
        !canAnyBlackPieceAttackSquare(board.board.map(row => [...row]), [7, 5]) &&
        !canAnyBlackPieceAttackSquare(board.board.map(row => [...row]), [7, 6])
    ) {
        board.castleWhiteKingside();
    }
    if(originalSquareReadable === "e1" && destinationSquareReadable === "c1" &&
        board.isSquareEmpty("c", 1) && board.isSquareEmpty("d", 1) && board.whiteCanCastleQueenside &&
        !canAnyBlackPieceAttackSquare(board.board.map(row => [...row]), [7, 4]) &&
        !canAnyBlackPieceAttackSquare(board.board.map(row => [...row]), [7, 3]) &&
        !canAnyBlackPieceAttackSquare(board.board.map(row => [...row]), [7, 2])
    ) {
        board.castleWhiteQueenside();
    }
    if(originalSquareReadable === "e8" && destinationSquareReadable === "g8" &&
        board.isSquareEmpty("f", 8) && board.isSquareEmpty("g", 8) && board.blackCanCastleKingside &&
        !canAnyWhitePieceAttackSquare(board.board.map(row => [...row]), [0, 4]) &&
        !canAnyWhitePieceAttackSquare(board.board.map(row => [...row]), [0, 5]) &&
        !canAnyWhitePieceAttackSquare(board.board.map(row => [...row]), [0, 6])
    ) {
        board.castleBlackKingside();
    }
    if(originalSquareReadable === "e8" && destinationSquareReadable === "c8" &&
        board.isSquareEmpty("c", 8) && board.isSquareEmpty("d", 8) && board.blackCanCastleQueenside &&
        !canAnyWhitePieceAttackSquare(board.board.map(row => [...row]), [0, 4]) &&
        !canAnyWhitePieceAttackSquare(board.board.map(row => [...row]), [0, 3]) &&
        !canAnyWhitePieceAttackSquare(board.board.map(row => [...row]), [0, 2])
    ) {
        board.castleBlackQueenside();
    }
}
//TODO: Fix my castling bug
//TODO: -The first two tests, [7,4] and [7,5], seem to work fine, but it can't hurt to make sure
//TODO: I'm actually passing the right parameters.
//TODO: The third test, [7,6], crashes the app.
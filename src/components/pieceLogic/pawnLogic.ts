import ChessboardClass from "../../ChessboardClass";
import { validateMoveSafety } from "../../validateMoveSafety";

/*
 * @param {Array} originalSquare - Array containing the rank, then file of the pawn's home square,
 *   and the letter p or P
 * @param {Array} destinationSquare - Array containing the rank, file, and piece occupying the destination square
 * @param {Chessboard} board - Chessboard instance representing the current board state
 * @returns {Void}
 * 
 */
export const movePawn = (
    originalSquare: any[],
    destinationSquare: any[],
    board: ChessboardClass,
    onPromotionNeeded: (originalSquare: any[], destinationSquare: any[], color) => void
): void => {
    
    // Determine if it's the pawn's first move.
    let pawnCanMoveTwoSquares = false;
    const whitePawnOnSecondRank = originalSquare[0] === '2' && board.activeColor === "w";
    const blackPawnOnSeventhRank = originalSquare[0] === '7' && board.activeColor === "b";

    if(whitePawnOnSecondRank || blackPawnOnSeventhRank) {
        pawnCanMoveTwoSquares = true;
    }

    if(pawnCanMoveTwoSquares) {        
        makePawnFirstMove(originalSquare, destinationSquare, board);
    }
    else {
        makePawnNonFirstMove(originalSquare, destinationSquare, board, onPromotionNeeded);
    }
}

// The pawn can move 1 or 2 squares
function makePawnFirstMove(originalSquare, destinationSquare, board) {
    //debugger;
    // Check if the move matches the pattern of a forward pawn move.
    if(matchesPawnFirstMovePattern(originalSquare, destinationSquare, board)) {

        // Check if the destination and the path to the destination square are empty
        if(!board.isSquareEmpty(destinationSquare[1], destinationSquare[0])) {
            return;
        }
        if(!board.isPathEmpty(originalSquare, destinationSquare)) {
            return;
        }
        
        // Check if the move puts the player's king in danger
        if(!validateMoveSafety(board.board.map(row => [...row]), [originalSquare[0], originalSquare[1]],
            [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {
            return;
        }

        // If the pawn moved 2 squares, set the en passant target to the square over which the pawn had moved over.
        if(Math.abs(destinationSquare[0] - originalSquare[0]) === 2) {
            let enPassantTargetRank;
            if(board.activeColor === "w") {
                enPassantTargetRank = 3;
            } else {
                enPassantTargetRank = 6;
            }
            board.setEnPassantTarget(originalSquare[1], enPassantTargetRank);
        } else {
            // Else we should disable en passant in case the other side's pawn had just moved.
            //debugger;
            board.deselectEnPassantTarget();
        }
        board.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
    }
    else if(matchesPawnCapturePattern(originalSquare, destinationSquare, board)) {
        if(!validateMoveSafety(board.board.map(row => [...row]), [originalSquare[0], originalSquare[1]],
            [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {
            return;
        }
        board.captureEnemyPiece(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
        board.deselectEnPassantTarget();
    }
}

function makePawnNonFirstMove(
    originalSquare: any[],
    destinationSquare: any[],
    board: ChessboardClass,
    onPromotionNeeded: (originalSquare: any[], destinationSquare: any[], color: string) => void
) {
    //debugger;
    // Check if the move matches the pattern of a forward pawn move
    if(matchesPawnNonFirstMovePattern(originalSquare, destinationSquare, board)) {
        //debugger;

        // Return if the square in front of the pawn is not empty
        if(!board.isSquareEmpty(destinationSquare[1], destinationSquare[0])) {
            return;
        }

        // Return if the move will put the player's king in danger
        if(!validateMoveSafety(board.board.map(row => [...row]), [originalSquare[0], originalSquare[1]],
            [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {
            return;
        }
        
        // Check if the pawn is moving to the promotion square. The board already knows whose turn it is.
        if(board.isPawnPromoting(destinationSquare[0])) {
            //debugger;
            onPromotionNeeded(originalSquare, destinationSquare, board.activeColor);
            
        } else {
            //debugger;
            board.movePieceToEmptySquare(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
            board.deselectEnPassantTarget();
            
        }
        
    }
    // Check if the move is one square forward diagonally and the destination is occupied by an enemy piece.
    else if(matchesPawnCapturePattern(originalSquare, destinationSquare, board)) {
        //debugger;
        if(!validateMoveSafety(board.board.map(row => [...row]), [originalSquare[0], originalSquare[1]],
            [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {
            return;
        }
        if(board.isPawnPromoting(destinationSquare[0])) {
            //debugger;
            onPromotionNeeded(originalSquare, destinationSquare, board.activeColor);
        }
        
        else {
            //debugger;
            board.captureEnemyPiece(originalSquare[1], originalSquare[0], destinationSquare[1], destinationSquare[0], originalSquare[2]);
            board.deselectEnPassantTarget();
        }
    }
    // Check if we can make an en passant capture.
    else if(matchesEnPassantPattern(originalSquare, destinationSquare, board)) {
        if(!validateMoveSafety(board.board.map(row => [...row]), [originalSquare[0], originalSquare[1]],
            [destinationSquare[0], destinationSquare[1]], originalSquare[2], board.activeColor)) {
            return;
        }
        //debugger;
        board.captureEnPassant(originalSquare, destinationSquare);
    }
}

function matchesEnPassantPattern(originalSquare, destinationSquare, board) {

    //debugger;

    if(board.enPassantTarget === "-") {
        return false;
    }

    alert(originalSquare[1]);
    // Convert files (letters) into numeric values which are the correct index
    const originalFileIndex = originalSquare[1].toLowerCase().charCodeAt(0) - 97;
    const destinationFileIndex = destinationSquare[1].toLowerCase().charCodeAt(0) - 97;

    // Check if the destination square is forward one square diagonally.
    const whitePawnForwardOneSquare = (destinationSquare[0] - originalSquare[0] === 1) && board.activeColor === "w";
    const blackPawnForwardOneSquare = (destinationSquare[0] - originalSquare[0] === -1) && board.activeColor === "b";
    const horizontalOneSquare = (Math.abs(destinationFileIndex - originalFileIndex) === 1);
    let forwardOneSquareDiagonal;

    if(board.activeColor === "w" && whitePawnForwardOneSquare && horizontalOneSquare) {
        forwardOneSquareDiagonal = true;
    }
    if(board.activeColor === "b" && blackPawnForwardOneSquare && horizontalOneSquare) {
        forwardOneSquareDiagonal = true;
    }

    // If board.enPassantTargetReadable matches the destination square, we should be able to make the capture.
    let destinationSquareReadable = destinationSquare[1] + destinationSquare[0];
    let isEnPassantTargetSquare = destinationSquareReadable === board.enPassantTargetReadable;

    if(forwardOneSquareDiagonal && isEnPassantTargetSquare) {
        //board.captureEnPassant(originalSquare, destinationSquare);
        return true;
    }
}

function matchesPawnFirstMovePattern(originalSquare, destinationSquare, board) {
    
    const sameFile = originalSquare[1] === destinationSquare[1];
    const whitePawnForwardOneOrTwoSquares = board.activeColor === "w" && 
        (destinationSquare[0] - originalSquare[0] === 1 || destinationSquare[0] - originalSquare[0] === 2);
    const blackPawnForwardOneOrTwoSquares = board.activeColor === "b" && 
        (destinationSquare[0] - originalSquare[0] === -1 || destinationSquare[0] - originalSquare[0] === -2);

    return sameFile && (whitePawnForwardOneOrTwoSquares || blackPawnForwardOneOrTwoSquares);
}

function matchesPawnNonFirstMovePattern(originalSquare, destinationSquare, board) {

    const fileMatches = (originalSquare[1] === destinationSquare[1]);
    const whitePawnForwardOneSquare = board.activeColor === "w" && (destinationSquare[0] - originalSquare[0] === 1);
    const blackPawnDownOneSquare = board.activeColor === "b" && (destinationSquare[0] - originalSquare[0] === -1);
    
    return (fileMatches && ( whitePawnForwardOneSquare || blackPawnDownOneSquare ));
}

function matchesPawnCapturePattern(originalSquare, destinationSquare, board) {
    

    // Return false if destination square does not have a capturable piece
    if(!board.isSquareOccupiedByEnemyPiece(destinationSquare[1], destinationSquare[0], originalSquare[2])) {
        return false;
    }

    // Convert files (letters) into numeric values which are the correct index
    const originalFileIndex = originalSquare[1].toLowerCase().charCodeAt(0) - 97;
    const destinationFileIndex = destinationSquare[1].toLowerCase().charCodeAt(0) - 97;

    const whitePawnForwardOneSquare = (destinationSquare[0] - originalSquare[0] === 1) && board.activeColor === "w";
    const blackPawnForwardOneSquare = (destinationSquare[0] - originalSquare[0] === -1) && board.activeColor === "b";
    const horizontalOneSquare = (Math.abs(destinationFileIndex - originalFileIndex) === 1);

    if(board.activeColor === "w" && whitePawnForwardOneSquare && horizontalOneSquare) {
        return true;
    }
    if(board.activeColor === "b" && blackPawnForwardOneSquare && horizontalOneSquare) {
        return true;
    }
}

//TODO: The makePawnNonFirstMove function is called.
//TODO: Check if the move matches the pattern of a forward non first pawn move (one square forward)
//TODO: If it does: Check if the pawn reaches the promotions square: 8th rank for white, 1st rank for black.
//TODO: (Similar logic should be used if the pawn captures a piece to land on the 8th or 1st rank)
//TODO: If it does reach the promotion square:
//TODO:  -Create the onPromotionNeeded function, and call this function.
//TODO: The functions parameters are the original square, destination square, and pawn color.
//TODO: From there, we should allow the Game component to do its job, bring up the promotion UI,
//TODO: And wait for a selection.














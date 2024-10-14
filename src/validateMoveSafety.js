import { isDiagonalPathEmpty, isRankPathEmpty, isFilePathEmpty } from './pathingUtils.js';

/*
* Returns true if the proposed move is safe and not putting their own king in danger.
* 
* @param board ------ Board property of ChessboardClass. Formatted board[rank][file]
*                     eg. board[0][0] is the a8 square
*                     while board[7][7] is the h1 square.
* @param originalSquare - Array representing the square to be moved from. [rank, file]
*                     eg. [2, "c"]
* @param destinationSquare - Array representing the square to be moved to. [rank, file]
*                     eg. [4, "c"]
* @param piece ------ Letter representing the piece to be moved. eg. "N" for white knight
* @param activePlayer - Letter representing whose turn it is. Either "w" or "b".
*/
export const validateMoveSafety = (board, originalSquare, destinationSquare, piece, activePlayer) => {
    debugger;
    let originalRank = 8 - originalSquare[0];
    let originalFile = originalSquare[1].charCodeAt(0) - 97;
    let destinationRank = 8 - destinationSquare[0];
    let destinationFile = destinationSquare[1].charCodeAt(0) - 97;
    let safeMove = false;
    
    // Step 1: Simulate the move
    // Clear the originalSquare
    board[originalRank][originalFile] = "";

    // Place the piece on destinationSquare
    board[destinationRank][destinationFile] = piece;

    // Step 2: Find the player's king and save it as an array
    let exitFlag = false;
    let kingPosition = undefined;

    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            let whiteTurnWhiteKing = board[i][j] === "K" && activePlayer === "w";
            let blackTurnBlackKing = board[i][j] === "k" && activePlayer === "b";

            if(whiteTurnWhiteKing || blackTurnBlackKing) {
                kingPosition = [i, j];
                exitFlag = true;
                break;
            } 
        }
        if(exitFlag) {
            break;
        }
    }
    // Step 3: Check if any enemy piece can attack the square that the player's king is on.
    // Let "pathingUtils.js" take care of the complexities.
    if(activePlayer === "w") {
        const isWhiteKingInDanger = canAnyBlackPieceAttackSquare(board, kingPosition);
        safeMove = !isWhiteKingInDanger;
    }
    if(activePlayer === "b") {
        const isBlackKingInDanger = canAnyWhitePieceAttackSquare(board, kingPosition);
        safeMove = !isBlackKingInDanger;
    }
    return safeMove;
}

/* Returns true if the white king is under attack by any piece.
*
* @param board - 2d array representing the board.
* @param kingPosition - position of the white king (rank, then file)
*/
export function canAnyBlackPieceAttackSquare(board, kingPosition) {
    debugger;
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            switch(board[i][j]) {
                case "p":
                    // Check possible pawn captures from this square
                    if(canBlackPawnAttackSquare([i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "r":
                    // Check possible rook moves from this square
                    if(canRookAttackSquare(board, [i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "n":
                    // Check possible knight moves from this square
                    if(canKnightAttackSquare([i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "b":
                    // Check possible bishop moves from this square
                    if(canBishopAttackSquare(board, [i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "q":
                    // Check possible queen moves (or rook moves + bishop moves)
                    // from this square
                    if(canQueenAttackSquare(board, [i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "k":
                    // Check possible king moves from this square
                    if(canKingAttackSquare([i, j], kingPosition)) {
                        return true;
                    }
                    break;
                default:
                    break; // Empty square or white piece
            }
        }
    }
    return false;
}

/* Returns true if the black king is under attack by any piece.
*
* @param board - 2d array representing the board.
* @param kingPosition - position of the black king (rank, then file)
*/
export function canAnyWhitePieceAttackSquare(board, kingPosition) {
    debugger;
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            switch(board[i][j]) {
                case "P":
                    // Check possible pawn captures from this square
                    if(canWhitePawnAttackSquare([i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "R":
                    // Check possible rook moves from this square
                    if(canRookAttackSquare(board, [i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "N":
                    // Check possible knight moves from this square
                    if(canKnightAttackSquare([i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "B":
                    // Check possible bishop moves from this square
                    if(canBishopAttackSquare(board, [i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "Q":
                    // Check possible queen moves (or rook moves + bishop moves)
                    // from this square
                    if(canQueenAttackSquare(board, [i, j], kingPosition)) {
                        return true;
                    }
                    break;
                case "K":
                    // Check possible king moves from this square
                    if(canKingAttackSquare([i, j], kingPosition)) {
                        return true;
                    }
                    break;
                default:
                    break; // Empty square or white piece
            }
        }
    }
    return false;
}

function canBlackPawnAttackSquare(pawnLocation, checkedSquare) {
    debugger;
    const pawnIsOneRankForward = (pawnLocation[0] + 1 === checkedSquare[0]);
    const pawnIsOneFileToTheSide = pawnLocation[1] + 1 === checkedSquare[1] || pawnLocation[1] - 1 === checkedSquare[1];
    return pawnIsOneRankForward && pawnIsOneFileToTheSide;
}

function canWhitePawnAttackSquare(pawnLocation, checkedSquare) {
    debugger;
    const pawnIsOneRankBack = (pawnLocation[0] - 1 === checkedSquare[0]);
    const pawnIsOneFileToTheSide = pawnLocation[1] + 1 === checkedSquare[1] || pawnLocation[1] - 1 === checkedSquare[1];
    return pawnIsOneRankBack && pawnIsOneFileToTheSide;
}

function canKnightAttackSquare(knightLocation, checkedSquare) {
    debugger;
    const rankDiff = Math.abs(knightLocation[0] - checkedSquare[0]);
    const fileDiff = Math.abs(knightLocation[1] - checkedSquare[1]);
    return (rankDiff === 2 && fileDiff === 1) || (rankDiff === 1 && fileDiff === 2);
}

function canKingAttackSquare(kingLocation, checkedSquare) {
    debugger;
    const rankDiff = Math.abs(kingLocation[0] - checkedSquare[0]);
    const fileDiff = Math.abs(kingLocation[1] - checkedSquare[1]);
    const oneSquareOrthogonal = (rankDiff + fileDiff === 1);
    const oneSquareDiagonal = (rankDiff === 1) && (fileDiff === 1);
    return oneSquareOrthogonal || oneSquareDiagonal;
}

function canBishopAttackSquare(board, bishopLocation, checkedSquare) {
    debugger;
    // 1) Match the pattern of a bishop move
    const rankDiff = Math.abs(bishopLocation[0] - checkedSquare[0]);
    const fileDiff = Math.abs(bishopLocation[1] - checkedSquare[1]);
    const matchesBishopPattern = (rankDiff === fileDiff) && rankDiff > 0;

    // 2) Squares between the bishop and checked square must be empty.
    if(matchesBishopPattern) {
        // I will organise the isDiagonalPathEmpty, and other logic related to
        // sliding pieces, into my pathing module later.
        const pathIsEmpty = isDiagonalPathEmpty(board, bishopLocation, checkedSquare);
        return pathIsEmpty;
    }
    return false;
}

function canRookAttackSquare(board, rookLocation, checkedSquare) {
    debugger;
    // 1) The move matches the pattern of a rook move
    const rankDiff = Math.abs(rookLocation[0] - checkedSquare[0]);
    const fileDiff = Math.abs(rookLocation[1] - checkedSquare[1]);
    const verticalMove = rankDiff > 0 && fileDiff === 0;
    const horizontalMove = rankDiff === 0 && fileDiff > 0;
    const matchesRookPattern = verticalMove || horizontalMove;

    // 2) Squares between the rook and the checked square must be empty.
    if(matchesRookPattern) {
        if(verticalMove) {
            // Function in my pathing module
            return isFilePathEmpty(board, rookLocation, checkedSquare);
        }
        if(horizontalMove) {
            // Function in my pathing module
            return isRankPathEmpty(board, rookLocation, checkedSquare);
        }
    }
    return false;
}

function canQueenAttackSquare(board, queenLocation, checkedSquare) {
    debugger;
    return canRookAttackSquare(board, queenLocation, checkedSquare) || canBishopAttackSquare(board, queenLocation, checkedSquare);
}

/*
* Returns true if the proposed en passant is safe and doesn't put the player's king in danger.
*
* @param originalSquare- the pawn's starting square
* @param destinationSquare- The pawn's destination
*/
function validateEnPassantSafety(board, originalSquare, destinationSquare, activePlayer) {
    debugger;
    let originalRankIndex = 8 - originalSquare[0];
    let originalFileIndex = originalSquare[1].charCodeAt(0) - 97;
    let destinationRankIndex = 8 - destinationSquare[0];
    let destinationFileIndex = destinationSquare[1].charCodeAt(0) - 97;

    // Clear the original square
    board[originalRankIndex][originalFileIndex] = "";
    // Place a pawn on the destination square
    if(activePlayer === "w") {
        board[destinationRankIndex][destinationFileIndex] = "P";
    } else if(activePlayer === "b") {
        board[destinationRankIndex][destinationFileIndex] = "p";
    }
    // Derive the location of the pawn being captured, and clear that square
    board[originalRankIndex][destinationFileIndex] = "";

    alert("Successfully validated it is a safe move."); // Debug
    return true;
}
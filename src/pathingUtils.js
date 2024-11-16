/*
* Determine if 2 squares on the same diagonal have an empty path between them.
*
* @param board- 2d array representing the board.
* @param originalSquare- Array representing the original square.       eg. [7, 5]
* @param destinationSquare- Array representing the destination square. eg. [3, 2]
*/
export function isDiagonalPathEmpty(board, originalSquare, destinationSquare) {
    let distance = Math.abs(originalSquare[0] - destinationSquare[0]);

    if(distance < 2) {
        return true;
    }

    let lowSquare, highSquare;

    // If originalSquare[0] is greater, that means the bishop's starting square is
    // nearer to the first rank, since originalSquare[0] = 0 starts at the top of
    // the board and moves down.
    if(originalSquare[0] > destinationSquare[0]) {
        lowSquare = originalSquare;
        highSquare = destinationSquare;
    } else {
        lowSquare = destinationSquare;
        highSquare = originalSquare;
    }

    // Call a different function for each direction of diagonal
    if(lowSquare[1] > highSquare[1]) {
        return isBottomRightToTopLeftDiagonalEmpty(board, lowSquare, highSquare);
    } else {
        return isBottomLeftToTopRightDiagonalEmpty(board, lowSquare, highSquare);
    }
}

/*
* Returns true if a "\" shaped diagonal is empty.
*
* @param board- 2d array representing the board.
* @param bottomRightSquare - Array representing the bottom right square. eg. [7, 6]
* @param topLeftSquare - Array representing the top left square. eg. [3, 2]
*/
function isBottomRightToTopLeftDiagonalEmpty(board, lowSquare, highSquare) {

    for( let rank = highSquare[0] + 1, file = highSquare[1] + 1; rank < lowSquare[0]; rank++, file++ ) {

        let square = board[rank][file];

        // Check if the square is empty
        if (square !== "") {
            return false;
        }
    }

    return true;
}

/*
* Returns true if a "/" shaped diagonal is empty.
*
* @param board- 2d array representing the board.
* @param bottomLeftSquare - Array representing the bottom left square. eg. [7, 2]
* @param topRightSquare - Array representing the top right square. eg. [3, 6]
*/
function isBottomLeftToTopRightDiagonalEmpty(board, lowSquare, highSquare) {

    for(let rank = highSquare[0] + 1, file = highSquare[1] - 1; rank < lowSquare[0]; rank++, file--) {

        let square = board[rank][file];

        if(square !== "") {
            return false;
        }
    }

    return true;
}

/*
* Returns true if the path between two squares on the same file is clear.
*
* @param board- 2d array representing the board.
* @param originalSquare- array representing the rook's original square. eg. [1, "a"]
* @param destinationSquare- array representing the rook's destination. eg. [8, "a"]
*/
export function isFilePathEmpty(board, originalSquare, destinationSquare) {
    let distance = Math.abs(originalSquare[0] - destinationSquare[0]);
    
    //Return true if distance between the 2 squares is 1 or 0
    if(distance < 2) {
        return true;
    }

    // Determine lowSquare and highSquare
    let lowSquare, highSquare;
    if (originalSquare[0] > destinationSquare[0]) {
        lowSquare = originalSquare;
        highSquare = destinationSquare;
    } else {
        lowSquare = destinationSquare;
        highSquare = originalSquare;
    }

    
    //Loop through the squares on the file (column)
    for (let i = highSquare[0] + 1; i < lowSquare[0]; i++) {
        if (board[i][originalSquare[1]] !== "") {
            return false;
        }
    }
    return true;
}

/*
* Returns true if the path between two squares on the same rank is clear.
*
* @param board- 2d array representing the board.
* @param originalSquare- array representing the rook's original square. eg. [7, 0]
* @param destinationSquare- array representing the rook's destination. eg. [7, 2]
*/
export function isRankPathEmpty(board, originalSquare, destinationSquare) {
    let distance = Math.abs(originalSquare[1] - destinationSquare[1]);

    //Return true if distance between the 2 squares is 1 or 0
    if(distance < 2) {
        return true;
    }

    // Determine leftSquare and rightSquare
    let leftSquare, rightSquare;
    if(originalSquare[1] < destinationSquare[1]) {
        leftSquare = originalSquare;
        rightSquare = destinationSquare;
    } else {
        leftSquare = destinationSquare;
        rightSquare = originalSquare;
    }

    // Loop through the squares on the rank
    for( let i = leftSquare[1] + 1; i < rightSquare[1]; i++ ) {

        let leftSquareLetter = leftSquare[0];
        if (board[leftSquareLetter][i] !== "") {
            return false;
        }
    }
    return true;
}
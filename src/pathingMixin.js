let pathingMixin = {
    /* Checks if a square is empty.
    *
    * test params: "a", 3
    */
    isSquareEmpty(file, rank) {
        
        //Check if file is a string
        if (typeof file !== 'string') {
            return true;
        }
        
        const fileIndex = file.toLowerCase().charCodeAt(0) - 96;
        const rankIndex = 8 - rank;

        const piece = this.board[rankIndex][fileIndex-1];
        return piece === "";

        return true;
    },

    /*
    * @param originalFile - Letter representing the original square's file.
    * @param originalRank - Number representing the original square's rank (starting from 1)
    * @param destinationFile - Letter representing the destination square's file
    * @param destinationRank - Number representing the destination square's rank (starting from 1)
    * @param piece - Letter representing the piece. A capital letter is a white piece while a
    *   lowercase letter is a black piece.
    */
    isSquareOccupiedByEnemyPiece(originalFile, originalRank, destinationFile, destinationRank, piece) {

        
        // Convert files (letters) into numeric values which are the correct index
        const originalFileIndex = originalFile.toLowerCase().charCodeAt(0) - 97;
        const destinationFileIndex = destinationFile.toLowerCase().charCodeAt(0) - 97;

        // Correctly calculate the index for the ranks as well
        const originalRankIndex = 8 - originalRank;
        const destinationRankIndex = 8 - destinationRank;

        const destinationSqPiece = this.board[destinationRankIndex][destinationFileIndex];

        // Calculate if both letters are different capitalization.
        // Check if the destination square is empty as well.
        const isOriginalSqPieceUpperCase = piece === piece.toUpperCase();
        const isDestinationSqPieceUpperCase = destinationSqPiece === destinationSqPiece.toUpperCase();
        const differentColor = isOriginalSqPieceUpperCase !== isDestinationSqPieceUpperCase;
        const isSquareEmpty = destinationSqPiece === "";

        // If the piece is empty string (empty square) or same capitalization (friendly piece), return false
        if(!isSquareEmpty && differentColor) {
            return true;
        }
        return false;      
    },

    /* 
     * When moving any kind of longrange piece, we usually have to check if all the squares
     * between both squares are empty (non-inclusive of the squares themselves)
     *
     * @param originalSquare    - Rank, then file (ex. 1, a)
     * @param destinationSquare - Rank, then file (ex. 8, a)
    */
    isPathEmpty(originalSquare, destinationSquare) {

        

        // It's a file if the letters are the same, but the numbers are different
        if(originalSquare[1] === destinationSquare[1] && originalSquare[0] !== destinationSquare[0]) {
            return this.isFilePathEmpty(originalSquare, destinationSquare);
        }

        // It's a rank if the letters are different, but the numbers are the same
        if(originalSquare[1] !== destinationSquare[1] && originalSquare[0] === destinationSquare[0]) {
            return this.isRankPathEmpty(originalSquare, destinationSquare);
        }

        // Logic for checking diagonals...
        // Not checking if it's a proper diagonal at this moment because
        // I already check that in the bishopLogic function.
        if(originalSquare[1] !== destinationSquare[1] && originalSquare[0] !== destinationSquare[0]) {
            return this.isDiagonalPathEmpty(originalSquare, destinationSquare);
        }
    },

    /*
    * @param originalSquare: Array representing the original square
    * @param destinationSquare: Array representing the destination square
    *
    * Both squares are on the same file and are valid for a rook,
    * queen, or 2-square pawn move.
    */
    isFilePathEmpty(originalSquare, destinationSquare) {

        let distance = undefined;

        distance = Math.abs(originalSquare[0] - destinationSquare[0]);
        
        //Return true if distance between the 2 squares is 1 or 0
        if(distance < 2) {
            return true;
        }

        // Determine lowSquare and highSquare
        let lowSquare, highSquare;
        if (originalSquare[0] < destinationSquare[0]) {
            lowSquare = originalSquare;
            highSquare = destinationSquare;
        } else {
            lowSquare = destinationSquare;
            highSquare = originalSquare;
        }

        
        //Loop through the squares on the file (column)
        for (let i = parseInt(lowSquare[0]) + 1; i < highSquare[0]; i++) {
            
            let lowSquareLetter = lowSquare[1];
            if (!this.isSquareEmpty(lowSquareLetter, i)) { // Should be a, 3
                return false;
            }
        }
        return true;
    },

    isRankPathEmpty(originalSquare, destinationSquare) {

        let distance = undefined;

        const asciiOfOriginalSquare = originalSquare[1].charCodeAt(0) - 97;
        const asciiOfDestinationSquare = destinationSquare[1].charCodeAt(0) - 97;

        distance = asciiOfOriginalSquare - asciiOfDestinationSquare;

        //Return true if distance between the 2 squares is 1 or 0
        if(distance < 2) {
            return true;
        }

        // Determine leftSquare and rightSquare
        let leftSquare, rightSquare, leftSquareFileIndex, rightSquareFileIndex;
        if(asciiOfOriginalSquare < asciiOfDestinationSquare) {
            leftSquare = originalSquare;
            leftSquareFileIndex = leftSquare[1].charCodeAt(0) - 97;
            rightSquare = destinationSquare;
            rightSquareFileIndex = rightSquare[1].charCodeAt(0) - 97;
        } else {
            leftSquare = destinationSquare;
            rightSquare = originalSquare;
        }

        // Loop through the squares on the rank
        for( let i = leftSquareFileIndex + 1; i < rightSquareFileIndex; i++ ) {

            let leftSquareLetter = leftSquare[1];
            if (!this.isSquareEmpty(leftSquareLetter, i)) { // Should be a, 3
                return false;
            }
        }
        return true;
    },

    /*
    * @param originalSquare: Array representing the original square.      eg [1, "f", "B"]
    * @param destinationSquare: Array representing the destination square eg [4, "c"]
    *
    * Both squares are on the same diagonal and are valid for a bishop or queen move.
    */
    isDiagonalPathEmpty(originalSquare, destinationSquare) {

        

        // Calculate distance between both squares, and return true if the
        // distance between the 2 squares is 1 or 0
        let distance = undefined;
        distance = Math.abs(originalSquare[0] - destinationSquare[0]);

        if(distance < 2) {
            return true;
        }

        // a file = 0, h file = 7
        // 8th rank = 0, 1st rank = 7
        // (there seems to be an off-by-1 error with this code)
        const originalFileIndex = originalSquare[1].toLowerCase().charCodeAt(0) - 96;
        const originalRankIndex = 8 - originalSquare[0];
        const destinationFileIndex = destinationSquare[1].toLowerCase().charCodeAt(0) - 96;
        const destinationRankIndex = 8 - destinationSquare[0];

        let lowSquare, highSquare;

        if(originalRankIndex > destinationRankIndex) {
            lowSquare = originalSquare;
            highSquare = destinationSquare
        } else {
            lowSquare = destinationSquare;
            highSquare = originalSquare;
        }

        if(lowSquare[1] > highSquare[1]) {
            return this.isBottomRightToTopLeftDiagonalEmpty(lowSquare, highSquare);
        } else {
            return this.isBottomLeftToTopRightDiagonalEmpty(lowSquare, highSquare);
        }
    },

    /* Helper function for isDiagonalPathEmpty.
    * 
    * @param lowSquare  - square that's closer to the 1st rank ex. [1, "f"]
    * @param highSquare - square that's closer to the 8th rank ex. [4, "c"]
    */
    isBottomRightToTopLeftDiagonalEmpty(lowSquare, highSquare) {
        

        const lowFileIndex = lowSquare[1].toLowerCase().charCodeAt(0) - 97;
        const lowRankIndex = 8 - lowSquare[0];
        const highFileIndex = highSquare[1].toLowerCase().charCodeAt(0) - 97;
        const highRankIndex = 8 - highSquare[0];

        for( let rank = highRankIndex + 1, file = highFileIndex + 1; rank < lowRankIndex; rank++, file++ ) {

            let square = this.board[rank][file];

            // Check if the square is empty
            if (square !== "") {
                return false;
            }
        }

        return true;
    },

    /* Helper function for isDiagonalPathEmpty
    *
    * @param lowSquare  - square that's closer to the 1st rank ex. [1, "f"]
    * @param highSquare - square that's closer to the 8th rank ex. [4, "c"]
    */
    isBottomLeftToTopRightDiagonalEmpty(lowSquare, highSquare) {
        

        const lowFileIndex = lowSquare[1].toLowerCase().charCodeAt(0) - 97;
        const lowRankIndex = 8 - lowSquare[0];
        const highFileIndex = highSquare[1].toLowerCase().charCodeAt(0) - 97;
        const highRankIndex = 8 - highSquare[0];

        // Let's make a for loop. It seems logical to start at rank = highRankIndex + 1
        // and end the loop at lowRankIndex - 1

        for(let rank = highRankIndex + 1, file = highFileIndex - 1; rank < lowRankIndex; rank++, file--) {

            let square = this.board[rank][file];

            if(square !== "") {
                return false;
            }
        }

        return true;
    },

    /*
    * @param originalFile - Letter representing the original square's file.
    * @param originalRank - Number representing the original square's rank (starting from 1)
    * @param destinationFile - Letter representing the destination square's file
    * @param destinationRank - Number representing the destination square's rank (starting from 1)
    * @param piece - Letter representing the piece. A capital letter is a white piece while a
    *   lowercase letter is a black piece.
    */
    movePieceToEmptySquare(originalFile, originalRank, destinationFile, destinationRank, piece) {
        debugger;
        // Convert letter into a numeric value
        const originalFileIndex = originalFile.toLowerCase().charCodeAt(0) - 97;
        const destinationFileIndex = destinationFile.toLowerCase().charCodeAt(0) - 97;

        // Correctly calculate the index for the ranks as well
        const originalRankIndex = 8 - originalRank;
        const destinationRankIndex = 8 - destinationRank;

        // Whenever we move a piece, we turn the square it occupied into an empty square.
        this.board[originalRankIndex][originalFileIndex] = "";

        // Then we have to change the destination square to "piece"
        this.board[destinationRankIndex][destinationFileIndex] = piece;

        // Whenever we move a piece, we also need to make sure we're performing a halfmove.
        this.nextHalfmove();

        this.constructFenString();
        return;
    },

    /*
    * @param originalFile - Letter representing the original square's file.
    * @param originalRank - Number representing the original square's rank (starting from 1)
    * @param destinationFile - Letter representing the destination square's file
    * @param destinationRank - Number representing the destination square's rank (starting from 1)
    * @param piece - Letter representing the piece. A capital letter is a white piece while a
    *   lowercase letter is a black piece.
    * 
    * The logic for capturing an enemy piece, in theory should be the same as moving to an empty square.
    */
    captureEnemyPiece(originalFile, originalRank, destinationFile, destinationRank, piece) {

        this.movePieceToEmptySquare(originalFile, originalRank, destinationFile, destinationRank, piece);

        // After we make the move, we should check if we have to remove castling rights
        // if we captured a rook on its home corner square.

        if(this.whiteCanCastleQueenside && this.board[7][0] !== "R") {
            this.whiteCanCastleQueenside = false;
            return;
        }
        if(this.whiteCanCastleKingside && this.board[7][7] !== "R") {
            this.whiteCanCastleKingside = false;
            return;
        }
        if(this.blackCanCastleQueenside && this.board[0][0] !== "r") {
            this.blackCanCastleQueenside = false;
            return;
        }
        if(this.blackCanCastleKingside && this.board[0][7] !== "r") {
            this.blackCanCastleKingside = false;
            return;
        }

    }
}

module.exports = pathingMixin;
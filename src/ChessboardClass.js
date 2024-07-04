class ChessboardClass {
    constructor() {
        this.startingBoard = [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"]
        ];
        this.startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        
        this.board = this.startingBoard;
        this.fen = this.startingFen;

        // Important FEN properties
        this.activeColor = "w";
        this.whiteCanCastleKingside = true;
        this.whiteCanCastleQueenside = true;
        this.blackCanCastleKingside = true;
        this.blackCanCastleQueenside = true;
        this.enPassantTarget = "-";
        this.enPassantTargetReadable = "-";
        this.halfmoveClock = 0;
        this.fullmoveNumber = 1;
    }

    getBoard() {
        return this.board;
    }

    // When we change the board, we also have to
    // update the fen string behind the scenes.
    setBoard(newBoard) {
        this.board = newBoard;
        this.constructFenString();
    }

    getFen() {
        return this.fen;
    }

    getActiveColor() {
        return this.activeColor;
    }

    setActiveColor(newColor) {
        this.activeColor = newColor;
        this.constructFenString();
    }

    getWhiteCanCastleKingside() {
        return this.whiteCanCastleKingside;
    }

    setWhiteCanCastleKingside(value) {
        this.whiteCanCastleKingside = value;
        this.constructFenString();
    }

    getWhiteCanCastleQueenside() {
        return this.whiteCanCastleQueenside;
    }

    setWhiteCanCastleQueenside(value) {
        this.whiteCanCastleQueenside = value;
        this.constructFenString();
    }

    getBlackCanCastleKingside() {
        return this.blackCanCastleKingside;
    }

    setBlackCanCastleKingside(value) {
        this.blackCanCastleKingside = value;
        this.constructFenString();
    }

    getBlackCanCastleQueenside() {
        return this.blackCanCastleQueenside;
    }

    setBlackCanCastleQueenside(value) {
        this.blackCanCastleQueenside = value;
        this.constructFenString();
    }

    getCastlingRights() {
        let result = "";
        if(this.whiteCanCastleKingside) {
            result += "K";
        }
        if(this.whiteCanCastleQueenside) {
            result += "Q";
        }
        if(this.blackCanCastleKingside) {
            result += "k";
        }
        if(this.blackCanCastleQueenside) {
            result += "q";
        }
        if(result === "") {
            result = "-";
        }
        return result;
    }

    /* Checks if a square is empty.
    *
    * test params: "a", 3
    */
    isSquareEmpty(file, rank) {
        
        debugger;

        //Check if file is a string
        if (typeof file !== 'string') {
            return true;
        }
        
        const fileIndex = file.toLowerCase().charCodeAt(0) - 96;
        const rankIndex = 8 - rank;

        const piece = this.board[rankIndex][fileIndex-1];
        return piece === "";

        return true;
    }

    
    /* 
     * When moving any kind of longrange piece, we usually have to check if all the squares
     * between both squares are empty (non-inclusive of the squares themselves)
     *
     * @param originalSquare    - Rank, then file (ex. 1, a)
     * @param destinationSquare - Rank, then file (ex. 8, a)
    */
    isPathEmpty(originalSquare, destinationSquare) {

        debugger;

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
    }

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
    }

    isRankPathEmpty(originalSquare, destinationSquare) {

        debugger;

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
    }

    /*
    * @param originalSquare: Array representing the original square.      eg [1, "f", "B"]
    * @param destinationSquare: Array representing the destination square eg [4, "c"]
    *
    * Both squares are on the same diagonal and are valid for a bishop or queen move.
    */
    isDiagonalPathEmpty(originalSquare, destinationSquare) {

        debugger;

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
    }

    /* Helper function for isDiagonalPathEmpty.
    * 
    * @param lowSquare  - square that's closer to the 1st rank ex. [1, "f"]
    * @param highSquare - square that's closer to the 8th rank ex. [4, "c"]
    */
    isBottomRightToTopLeftDiagonalEmpty(lowSquare, highSquare) {
        debugger;

        const lowFileIndex = lowSquare[1].toLowerCase().charCodeAt(0) - 97;
        const lowRankIndex = 8 - lowSquare[0];
        const highFileIndex = highSquare[1].toLowerCase().charCodeAt(0) - 97;
        const highRankIndex = 8 - highSquare[0];

        for( let rank = highRankIndex + 1, file = highFileIndex + 1; rank < lowRankIndex; rank++, file++ ) {

            let square = this.board[rank][file];

            //alert(`Rank index: ${rank}, File index: ${file}. Currently checking square: ${square}`);

            // Check if the square is empty
            if (square !== "") {
                return false;
            }
        }

        return true;
    }

    /* Helper function for isDiagonalPathEmpty
    *
    * @param lowSquare  - square that's closer to the 1st rank ex. [1, "f"]
    * @param highSquare - square that's closer to the 8th rank ex. [4, "c"]
    */
    isBottomLeftToTopRightDiagonalEmpty(lowSquare, highSquare) {
        debugger;

        const lowFileIndex = lowSquare[1].toLowerCase().charCodeAt(0) - 97;
        const lowRankIndex = 8 - lowSquare[0];
        const highFileIndex = highSquare[1].toLowerCase().charCodeAt(0) - 97;
        const highRankIndex = 8 - highSquare[0];

        // Let's make a for loop. It seems logical to start at rank = highRankIndex + 1
        // and end the loop at lowRankIndex - 1

        for(let rank = highRankIndex + 1, file = highFileIndex - 1; rank < lowRankIndex; rank++, file--) {

            let square = this.board[rank][file];

            alert(`Rank index: ${rank}. File index: ${file}. Currently checking square: ${this.board[rank][file]}`);

            if(square !== "") {
                return false;
            }
        }

        return true;
    }

    /*
     * @param {String} piece - Lowercase letter representing the piece on the original square
     * @param {int} destinationFile - Letter of the file going from a to h.
     * @param {int} destinationRank - index of the rank starting with 1=1  going up to 8=8
     */
    // isDestinationSquareOccupiedByFriendlyPiece(piece, destinationFile, destinationRank) {
    //     alert("test");
    //     if(this.isSquareEmpty(destinationFile, destinationRank)) {
    //         return undefined;
    //     }    
    //     const fileIndex = destinationFile.charCodeAt(0) - 97; // Convert 'a' to 0, ..., 'h' to 7
    //     const rankIndex = destinationRank - 1;
    //     const pieceOnDestinationSquare = this.board[rankIndex][fileIndex];
    //     alert("pieceOnDestinationSquare: " + pieceOnDestinationSquare);
    //     if(this.activeColor === "w") {
    //         if(pieceOnDestinationSquare === pieceOnDestinationSquare.toUpperCase()) {
    //             return true;
    //         }
    //         return false;
    //     } else {
    //         if(pieceOnDestinationSquare === pieceOnDestinationSquare.toLowerCase()) {
    //             return true;
    //         } return false;
    //     }
    // }

    getEnPassantTarget() {
        return this.enPassantTarget;
    }

    getEnPassantTargetReadable() {
        return this.enPassantTargetReadable;
    }

    setEnPassantTarget(file, rank) {
        this.enPassantTarget = [file, rank];
        this.enPassantTargetReadable = `${String.fromCharCode(96 + file)}${rank}`;
        this.constructFenString();
    }

    getHalfmoveClock() {
        return this.halfmoveClock;
    }

    setHalfmoveClock(value) {
        this.halfmoveClock = value;
        this.constructFenString();
    }

    getFullmoveNumber() {
        return this.fullmoveNumber;
    }

    setFullmoveNumber(value) {
        this.fullmoveNumber = value;
        this.constructFenString();
    }

    constructPiecePlacement() {
        let fenPiecePlacement = "";

        for(let i = 0; i < this.board.length; i++) {
            let emptyCount = 0;

            for(let j = 0; j < this.board[i].length; j++) {
                const piece = this.board[i][j];

                if(piece === "") {
                    emptyCount++;
                } else {
                    if(emptyCount > 0) {
                        fenPiecePlacement += emptyCount;
                        emptyCount = 0;
                    }
                    fenPiecePlacement += piece;
                }
            }

            // If there is an empty piece at the end of the row add that as well
            if (emptyCount > 0) {
                fenPiecePlacement += emptyCount;
            }

            // Add a slash to properly create fen notation
            if (i < this.board.length - 1) {
                fenPiecePlacement += "/";
            }
        }
        return fenPiecePlacement;
    }

    // Update the class's fen string using the current class state
    constructFenString() {
        // The fen string consists of six smaller strings: Piece placement, active color,
        // castling rights, en passant target, halfmove clock, and fullmove number.
        let piecePlacement = this.constructPiecePlacement();
        let activeColor = this.activeColor;
        let castlingRights = this.getCastlingRights();
        let enPassantTarget = this.enPassantTargetReadable;
        let halfmoveClock = this.halfmoveClock;
        let fullmoveNumber = this.fullmoveNumber;
        let newFen;
        
        newFen = `${piecePlacement} ${activeColor} ${castlingRights} ${enPassantTarget} ${halfmoveClock} ${fullmoveNumber}`;

        this.fen = newFen;
    }

    /*
    * @param originalFile - Letter representing the original square's file.
    * @param originalRank - Number representing the original square's rank (starting from 1)
    * @param destinationFile - Letter representing the destination square's file
    * @param destinationRank - Number representing the destination square's rank (starting from 1)
    * @param piece - Letter representing the piece. A capital letter is a white piece while a
    *   lowercase letter is a black piece.
    */
    movePieceToEmptySquare(originalFile, originalRank, destinationFile, destinationRank, piece) {

        // Convert letter into a numeric value
        const originalFileIndex = originalFile.toLowerCase().charCodeAt(0) - 97;
        const destinationFileIndex = destinationFile.toLowerCase().charCodeAt(0) - 97;

        // Correctly calculate the index for the ranks as well
        const originalRankIndex = 8 - originalRank;
        const destinationRankIndex = 8 - destinationRank;

        // To move the knight, first we must change the knight's original square into an empty square.
        this.board[originalRankIndex][originalFileIndex] = "";

        // Then we have to change the destination square to "piece"
        this.board[destinationRankIndex][destinationFileIndex] = piece;

        // Whenever we move a piece, we also need to make sure we're performing a halfmove.
        this.nextHalfmove();

        this.constructFenString();
        return;
    }

    /*
    * Performs a halfmove. Updates activeColor, enPassantTarget, halfmoveClock, and fullmoveNumber.
    */
    nextHalfmove(enPassantTarget = "-", reset50MoveRule = false) {
        // activeColor is the player whose move it is
        if(this.activeColor === "w") {
            this.activeColor = "b";
        } else {
            this.activeColor = "w";
            this.fullmoveNumber++;
        }
        // enPassantTarget is the capturable square via En Passant if the opponent moved a pawn
        // two squares last move.
        this.enPassantTarget = "-";

        // halfmoveClock is the number of halfmoves since the last piece capture or pawn move.
        // Used to enforce the 50-move rule.
        if(reset50MoveRule === true) {
            this.halfmoveClock = 0;
        } else {
            this.halfmoveClock++;
        }
    }
}

module.exports = ChessboardClass;